import type { Metadata } from "next";

import { FindAMatch } from "@/components/tables";

export const metadata: Metadata = {
  title: "Find a match",
};

export default function FindMatchPage() {
  return <FindAMatch />;
}
