import { Stack, Table, Text } from "@uiid/design-system";

import { TokenVisual } from "./TokenVisual";

// A type alias rather than an interface: Table's items must be indexable.
export type TokenRow = {
  name: string;
  value: string | number;
  tokenName: string;
  type: string;
};

interface TokenTableProps {
  tokens: TokenRow[];
}

const COLUMNS = ["name", "value", "tokenName", "visual"];

const HEADERS: Record<string, string> = {
  name: "Name",
  value: "Value",
  tokenName: "Token",
  visual: "Visual",
};

const formatCell = (value: unknown, column: string, token: TokenRow) => {
  switch (column) {
    case "name":
      return <Text weight="medium">{token.name}</Text>;
    case "value":
      return (
        <Text family="mono" size={-1}>
          {String(token.value)}
        </Text>
      );
    case "tokenName":
      return (
        <Text family="mono" size={-1} emphasis="muted">
          {token.tokenName}
        </Text>
      );
    case "visual":
      return <TokenVisual token={token} />;
    default:
      return String(value ?? "");
  }
};

export const TokenTable = ({ tokens }: TokenTableProps) => {
  return (
    <Stack mb={12}>
      <Table
        items={tokens}
        columns={COLUMNS}
        formatHeader={(column) => HEADERS[String(column)]}
        formatCell={formatCell}
        striped
        bordered
      />
    </Stack>
  );
};
