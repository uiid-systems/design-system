/**
 * How the sidebar and its groups stay closed across a reload without
 * flashing open.
 *
 * The pages are static HTML, so the server always renders the sidebar and
 * every group open. The saved state lives in localStorage, which React only
 * reads after it hydrates. Left alone, anything the reader had closed would
 * paint open, then close.
 *
 * The root layout puts `noFlashScript()` in an inline `<script>` in `<head>`,
 * so it runs before the first paint. It handles the two differently:
 *
 * - The sidebar's state is an attribute on `<html>` that CSS reads (see
 *   sidebar.hooks.ts). The script sets it, and that is the whole job: there is
 *   nothing for React to catch up on.
 * - A group's state is React's. The script writes a small `<style>` that
 *   hides each group saved closed and points its chevron the right way, so
 *   the first paint is already right. React then hydrates, loads the saved
 *   state and closes those groups for real, out of sight. `clearNoFlash`
 *   removes the `<style>` the first time the reader opens or closes a group
 *   or navigates, and from then on the groups' own transitions are all there
 *   is.
 *
 * The selectors below are the contract with `SidebarGroup`: each carries
 * `data-sidebar-group` with its id, plus `data-active` when it holds the
 * current page. An active group is never hidden, because it is open on load
 * whatever was saved.
 */

const STYLE_ID = "sidebar-no-flash";

/** Remove the `<style>` the inline script wrote. Safe to call more than once. */
export const clearNoFlash = () => {
  document.getElementById(STYLE_ID)?.remove();
};

/**
 * Runs as a plain inline script, outside React and outside this module, so it
 * can only use its arguments. sidebar.hooks.ts saves both values as JSON: the
 * sidebar as `true` or `false`, the groups as `{ [id]: boolean }`.
 */
const hideClosedBeforePaint = (
  sidebarKey: string,
  sidebarAttribute: string,
  groupsKey: string,
  styleId: string,
) => {
  try {
    if (localStorage.getItem(sidebarKey) === "false") {
      document.documentElement.setAttribute(sidebarAttribute, "closed");
    }

    const rules: string[] = [];

    let groups: Record<string, unknown> = {};
    try {
      groups = JSON.parse(localStorage.getItem(groupsKey) ?? "{}") ?? {};
    } catch {
      // Not JSON. No groups are hidden.
    }

    Object.keys(groups).forEach((id) => {
      if (groups[id] !== false) return;
      const group = `[data-sidebar-group=${JSON.stringify(id)}]:not([data-active])`;
      rules.push(
        `${group} [data-slot="collapsible-panel"]{display:none}`,
        `${group} [data-slot="sidebar-group-chevron"]{rotate:none}`,
      );
    });

    if (rules.length === 0) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = rules.join("");
    document.head.appendChild(style);
  } catch {
    // Storage is blocked or holds something else. Everything stays open.
  }
};

type NoFlashKeys = {
  /** The localStorage key the sidebar's open state is saved under. */
  sidebarKey: string;
  /** The attribute set to `"closed"` on `<html>` for a closed sidebar. */
  sidebarAttribute: string;
  /** The localStorage key the groups' open state is saved under. */
  groupsKey: string;
};

/** The source of the inline script. `<` is escaped so no key can close the tag. */
export const noFlashScript = ({
  sidebarKey,
  sidebarAttribute,
  groupsKey,
}: NoFlashKeys) => {
  const args = [sidebarKey, sidebarAttribute, groupsKey, STYLE_ID].map((arg) =>
    JSON.stringify(arg).replace(/</g, "\\u003c"),
  );

  return `(${hideClosedBeforePaint.toString()})(${args.join(",")})`;
};
