import type { Metadata } from "next";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AppShell } from "@/components";

import "./globals.css";

export const metadata: Metadata = {
  title: "uiid blocks",
  description: "AI-powered UI composition with UIID components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <NuqsAdapter>
            <AppShell>{children}</AppShell>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
