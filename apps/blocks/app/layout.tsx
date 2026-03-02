import type { Metadata } from "next";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AppShell } from "@/components";

import "./globals.css";

export const metadata: Metadata = {
  title: "uiid blocks",
  description: "Create, browse, save and reuse UIID blocks with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("uiid-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
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
