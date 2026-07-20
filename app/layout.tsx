import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pharma.amli.group"),
  applicationName: "AMLI Pharma",
  title: "AMLI Pharma | Beauty, pharmacy & care in one place",
  description:
    "AMLI Pharma is the health & beauty company of AMLI Group. We distribute in Malaysia and are opening TRIE CARE — beauty, pharmacy and telemedicine in one store and one app — in Tashkent, Uzbekistan.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "AMLI Pharma | Beauty, pharmacy & care in one place",
    description:
      "Beauty, a pharmacy and a doctor in one place — one store, one app. Opening first in Tashkent, Uzbekistan.",
    images: [
      {
        url: "/images/pharma-hero-poster.jpg",
        width: 1600,
        height: 900,
        alt: "AMLI Pharma"
      }
    ],
    type: "website"
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml"
      }
    ],
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-MY">
      <body>{children}</body>
    </html>
  );
}
