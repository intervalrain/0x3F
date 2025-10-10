import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../App.css";
import AuthProvider from "@/components/AuthProvider";
import ThemeRegistry from "@/components/ThemeRegistry";
import { LayoutProvider } from "@/contexts/LayoutContext";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "0x3F LeetCode 刷題追蹤器",
  description: "LeetCode Problem Tracker - Track your progress through 0x3F algorithm problems",
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          <AuthProvider>
            <LayoutProvider>
              <AppShell>
                {children}
              </AppShell>
            </LayoutProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
