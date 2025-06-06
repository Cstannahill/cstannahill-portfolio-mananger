import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/components.css";
import "@/styles/utilities.css";
import AuthProvider from "@/providers/AuthProvider";
import { SiteNavBar } from "@/components/nav/SiteNavBar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ctan.dev's Portfolio Manager",
  icons: {
    icon: "/icon.png",
  },
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SiteNavBar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
