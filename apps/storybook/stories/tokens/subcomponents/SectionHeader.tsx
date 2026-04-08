interface SectionHeaderProps {
  children: React.ReactNode;
}

export const SectionHeader = ({ children }: SectionHeaderProps) => {
  return (
    <h2
      style={{
        margin: "1rem",
        color: "var(--shade-foreground)",
        fontSize: "1.5rem",
        fontWeight: "600",
      }}
    >
      {children}
    </h2>
  );
};
