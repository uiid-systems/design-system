/**
 * How the sidebar and its groups stay closed across a reload without
 * flashing open.
 *
 * The pages are static HTML, so the server always renders the sidebar and
 * every group open. The saved state lives in localStorage, which React only
 * reads after it hydrates. Left alone, anything the reader had closed would
 * paint open, then slide shut.
 *
 * The fix has three steps:
 *
 * 1. The root layout puts `noFlashScript()` in an inline `<script>` in
 *    `<head>`, so it runs before the first paint. It reads the saved state
 *    and writes a small `<style>` that hides whatever was left closed, and
 *    points a closed group's chevron the right way.
 * 2. The first paint is therefore already right. React then hydrates, loads
 *    the saved state and closes those parts for real, out of sight.
 * 3. The `<style>` has done its job. `clearNoFlash` removes it the first time
 *    the reader opens or closes anything, and from then on the parts' own
 *    transitions are all there is.
 *
 * The selectors below are the contract with the parts: `SidebarContainer`
 * carries `data-shell-sidebar`, and each `SidebarGroup` carries
 * `data-shell-group` with its id, plus `data-active` when it holds the
 * current page. An active group is never hidden, because it opens on load
 * whatever was saved.
 */

const STYLE_ID = "shell-no-flash";

/** Remove the `<style>` the inline script wrote. Safe to call more than once. */
export const clearNoFlash = () => {
  document.getElementById(STYLE_ID)?.remove();
};

/**
 * Runs as a plain inline script, outside React and outside this module, so it
 * can only use its arguments. The store saves both values as JSON: the
 * sidebar as `true` or `false`, the groups as `{ [id]: boolean }`.
 */
const hideClosedBeforePaint = (
  sidebarKey: string,
  groupsKey: string,
  styleId: string,
) => {
  try {
    const rules: string[] = [];

    if (localStorage.getItem(sidebarKey) === "false") {
      rules.push("[data-shell-sidebar]{display:none}");
    }

    const groups = JSON.parse(localStorage.getItem(groupsKey) ?? "{}");
    Object.keys(groups).forEach((id) => {
      if (groups[id] !== false) return;
      const group = `[data-shell-group=${JSON.stringify(id)}]:not([data-active])`;
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
  /** The localStorage key the groups' open state is saved under. */
  groupsKey: string;
};

/** The source of the inline script. */
export const noFlashScript = ({ sidebarKey, groupsKey }: NoFlashKeys) => {
  const args = [sidebarKey, groupsKey, STYLE_ID].map((arg) =>
    JSON.stringify(arg),
  );

  return `(${hideClosedBeforePaint.toString()})(${args.join(",")})`;
};
