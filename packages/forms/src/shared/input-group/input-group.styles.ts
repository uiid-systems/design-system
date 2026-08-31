import styles from "./input-group.module.css";

/**
 * The class the input itself needs so its value clears the absolutely
 * positioned actions strip. Lives apart from the components so the module keeps
 * a components-only export surface (fast refresh).
 */
export const inputGroupInputClassName = styles["input-group-input"];
