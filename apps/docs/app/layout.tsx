import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Group, Stack } from "@uiid/layout";

import { DocsHeader } from "@/components/docs-header-server";
import { ThemeStyle } from "@/components/theme-style";
import { Sidebar } from "@/components/sidebar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "uiid docs",
  description:
    "Documentation for UIID - A modern, modular component library built with TypeScript, Vite, React, and CSS Modules.",
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
        <ThemeStyle />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Group fullwidth>
          <Sidebar />
          <Stack className="flex-1">
            <DocsHeader />
            <Stack br={1} maxw={960}>
              {children}
            </Stack>
          </Stack>
        </Group>
      </body>
    </html>
  );
}
