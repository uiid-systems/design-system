import { TokenVisual } from "./TokenVisual";

export interface TokenRow {
  name: string;
  value: string;
  tokenName: string;
  type: string;
}

interface TokenTableProps {
  tokens: TokenRow[];
}

export const TokenTable = ({ tokens }: TokenTableProps) => {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.875rem",
        fontFamily: "system-ui, sans-serif",
        marginBottom: "3rem",
      }}
    >
      <thead>
        <tr style={{ borderBottom: "2px solid #e5e5e5" }}>
          <th
            style={{
              textAlign: "left",
              padding: "0.75rem 1rem",
              fontWeight: "600",
              color: "#666",
            }}
          >
            Name
          </th>
          <th
            style={{
              textAlign: "left",
              padding: "0.75rem 1rem",
              fontWeight: "600",
              color: "#666",
            }}
          >
            Value
          </th>
          <th
            style={{
              textAlign: "left",
              padding: "0.75rem 1rem",
              fontWeight: "600",
              color: "#666",
            }}
          >
            Token
          </th>
          <th
            style={{
              textAlign: "left",
              padding: "0.75rem 1rem",
              fontWeight: "600",
              color: "#666",
              width: "150px",
            }}
          >
            Visual
          </th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, idx) => (
          <tr
            key={idx}
            style={{
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
            }}
          >
            <td
              style={{
                padding: "0.5rem 1rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              {token.name}
            </td>
            <td
              style={{
                padding: "0.5rem 1rem",
                fontFamily: "monospace",
                color: "#0066cc",
                fontSize: "0.8125rem",
              }}
            >
              {token.value}
            </td>
            <td
              style={{
                padding: "0.5rem 1rem",
                fontFamily: "monospace",
                color: "#666",
                fontSize: "0.8125rem",
              }}
            >
              {token.tokenName}
            </td>
            <td style={{ padding: "0.5rem 1rem" }}>
              <TokenVisual token={token} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
