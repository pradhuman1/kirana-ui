"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import UserDataLoader from "./components/UserDataLoader";
import ProtectedLayout from "./components/ProtectedLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Pass Dukaan",
  description: "Pass Dukaan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full max-h:vh-screen overflow-y-hidden:sm`}
      >
        <UserProvider>
          <UserDataLoader />
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </UserProvider>
      </body>
    </html>
  );
}
