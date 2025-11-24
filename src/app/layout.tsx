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
  title: "0x3F NeedCode 溺扣 - 演算法刷題筆記",
  description: "沉溺於 Code 的演算法學習筆記與 LeetCode 刷題追蹤器，系統化學習資料結構與演算法",
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  keywords: ["LeetCode", "演算法", "資料結構", "刷題", "NeedCode", "溺扣", "0x3F", "程式設計", "面試準備"],
  openGraph: {
    title: "0x3F NeedCode 溺扣",
    description: "沉溺於 Code 的演算法學習筆記與 LeetCode 刷題追蹤器",
    type: "website",
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
