import type { Metadata } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Yeşil Nesil The Garden",
  description:
    "Polonezköy Hayal Ormanları'nda dört farklı kır düğünü bahçesi.",
  icons: {
    icon: "/yesil-nesil-logo.png",
    shortcut: "/yesil-nesil-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${jost.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
