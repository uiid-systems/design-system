import styles from "./table-container.module.css";

export const TableContainer = ({
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="table-container"
      className={styles["table-container"]}
      {...props}
    >
      {children}
    </div>
  );
};
TableContainer.displayName = "TableContainer";
