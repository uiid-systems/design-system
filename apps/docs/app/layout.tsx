import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import { Group, Stack } from "@uiid/layout";
import { List } from "@uiid/lists";
import { Text } from "@uiid/typography";

import { DocsHeader } from "@/components";
import { generateDocsNav } from "@/lib/generate-nav";

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
  const navItems = generateDocsNav();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Stack fullwidth br={1} mx="auto" className="bg-(--shade-background) max-w-7xl">
          <Group fullwidth>
            <Stack br={1} ax="stretch" className="min-w-3xs">
              <Stack ax="stretch" className="sticky top-0">
                <Group px={4} py={8}>
                  <Text size={3} weight="bold">uiid docs</Text>
                </Group>
                <List items={navItems} LinkComponent={Link} pb={12} />
              </Stack>
            </Stack>
            <Stack className="flex-1">
              <DocsHeader />
              {children}
            </Stack>
          </Group>
        </Stack>
      </body>
    </html>
  );
}
