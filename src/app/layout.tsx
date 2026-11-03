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
  metadataBase: new URL("https://sakuin.co.id"),
  applicationName: "sakuin.co.id",
  title: {
    default: "Virtual Debit Card & Saldo Terpadu Indonesia | sakuin.co.id",
    template: "%s | sakuin.co.id",
  },
  description:
    "Platform Satu Saldo Terpadu untuk Virtual Debit Card berproteksi 3D Secure, konversi kurs Wise tanpa markup, bayar instan QRIS, dan PPOB 24/7.",
  openGraph: {
    siteName: "sakuin.co.id",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

import { AppProviders } from "@/shared/application/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
