# pnpm 11 Migration

Notes for whoever picks up the pnpm 10 → 11 upgrade. This is not urgent and nothing is broken today, but the repo carries exactly one configuration that pnpm 11 **silently ignores**, so the bump needs to be deliberate rather than a version-string edit.

Current state at the time of writing (2026-08-02): `packageManager` pins `pnpm@10.13.1`; latest is `11.18.0`, latest 10.x is `10.34.5`.

---

## The one real blocker

> Since v11, pnpm no longer reads settings from the `pnpm` field of `package.json`. Settings must be defined in `pnpm-workspace.yaml` instead.

Our `package.json` uses that field for exactly one thing:

```json
"pnpm": {
  "overrides": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  }
}
```

**This fails silently.** On pnpm 11 the field is not read, no warning is printed, and the React 19 pins simply stop applying — you would find out via a duplicated or downgraded React in the tree, not via an error. Move it before bumping, not after:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"

overrides:
  react: "^19.2.3"
  react-dom: "^19.2.3"
```

## Do not "fix" the lefthook postinstall

This is the trap. `scripts/postinstall.mjs` installs lefthook's git hooks by hand, with a comment noting that pnpm blocks lefthook's own postinstall. That reads like a pnpm incompatibility worth solving during the upgrade. **It is not, and it needs no change.**

- pnpm 10.0 stopped running **dependencies'** `preinstall`/`postinstall` scripts by default. That is deliberate supply-chain hardening, not a bug, and pnpm 11 keeps it.
- The **root project's own** lifecycle scripts have never been blocked in any version. `scripts/postinstall.mjs` runs normally on 10 and 11 alike.
- Calling `lefthook install` ourselves grants lefthook _zero_ install-time code execution. Allowlisting it instead would grant strictly more privilege for the same outcome, so the current approach is the more conservative one.

Related: `onlyBuiltDependencies` was replaced by the `allowBuilds` map in 10.26. We configure neither, so there is nothing to migrate there.

## Also worth checking

| Item         | Status                                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node 22+** | Required by pnpm 11. Local dev is on Node 24, so this is already satisfied — but check the Node version used by CI and by Vercel's build image before bumping. |
| `.npmrc`     | Contains only `access=public`. v11 restricts `.npmrc` to registry/auth settings — confirm this publish setting is still honored, or relocate it.               |
| Env vars     | v11 requires a `pnpm_config_*` prefix for config env vars. We set none in CI today, but re-check `.github/workflows/` if that changes.                         |
| Lockfile     | Expect a lockfile format bump. Commit it in the same PR and make sure CI and Vercel install cleanly from it.                                                   |
| `engines`    | No pnpm range is currently declared; nothing to widen.                                                                                                         |

## Suggested order

1. Move `overrides` into `pnpm-workspace.yaml` and delete the `pnpm` field. **Verified on 2026-08-02:** pnpm 10.13.1 reads `overrides` from `pnpm-workspace.yaml` — moving it and running `pnpm install --lockfile-only` left the lockfile's `overrides:` section byte-identical. Both majors honor the new location, so this step is independently safe and can ship on its own.
2. Bump `packageManager` to `pnpm@11.18.0` with a fresh integrity hash, after confirming CI and Vercel are on Node 22+.
3. Delete `node_modules` and the lockfile, reinstall, and diff the lockfile for unexpected React movement.
4. Confirm `pnpm why react` reports a single version, then run `pnpm run build` and `pnpm test:run`. Run `pnpm setup` if the shell PATH needs updating.

Step 1 is the valuable half and carries almost no risk; if the upgrade stalls, landing it alone still removes the silent-failure trap.
