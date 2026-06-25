import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "セットリスト管理アプリ",
  description:
    "バンドのライブ用セットリストを管理・ドラッグで並び替えできるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-full flex flex-col bg-gray-100">
        <nav className="bg-white shadow-sm px-6 py-4">
          <p className="font-bold text-gray-800">セットリスト管理</p>
        </nav>
        {children}
      </body>
    </html>
  );
}
