import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pharma.amli.group"),
  applicationName: "AMLI Pharma",
  title: "AMLI Pharma | Beauty, pharmacy & care in one place",
  description:
    "AMLI Pharma brings beauty and care together through TRIE CARE. Our first store opened in Tashkent, Uzbekistan, on 12 October 2026.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "AMLI Pharma | Beauty, pharmacy & care in one place",
    description:
      "TRIE CARE opened in Tashkent on 12 October 2026, bringing beauty and pharmacy together. The app and telemedicine platform are in development.",
    images: [
      {
        url: "/images/triecare-tashkent-store.webp",
        width: 1600,
        height: 1067,
        alt: "The TRIE CARE store in Tashkent, Uzbekistan"
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
