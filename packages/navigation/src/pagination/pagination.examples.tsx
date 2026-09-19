"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Pagination } from "./pagination";

export const Compact = () => <Pagination totalPages={31} />;

export const Numbered = () => (
  <Pagination totalPages={31} defaultPage={6} spread={1} />
);

/** Hash hrefs so following a link doesn't reload the page. */
export const Links = () => (
  <Stack gap={4}>
    <Pagination
      totalPages={31}
      defaultPage={6}
      renderLink={(page) => <a href={`#page-${page}`} />}
    />
    <Pagination
      totalPages={31}
      defaultPage={6}
      spread={1}
      renderLink={(page) => <a href={`#page-${page}`} />}
    />
  </Stack>
);

export const Controlled = () => {
  const [page, setPage] = useState(1);

  return (
    <Stack gap={3}>
      <Pagination totalPages={31} page={page} onPageChange={setPage} />
      <Text size={-1} shade="muted">
        Page in parent state: {page}
      </Text>
    </Stack>
  );
};
