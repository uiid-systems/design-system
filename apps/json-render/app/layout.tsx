import type { Metadata } from "next";

import { AppShell } from "@/components";

import "./globals.css";

export const metadata: Metadata = {
  title: "uiid + json-render",
  description: "Test AI-generated UI with UIID components and json-render",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
