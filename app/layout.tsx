import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pharma.amli.group"),
  applicationName: "AMLI Pharma",
  title: "AMLI Pharma | Beauty, pharmacy & care in one place",
  description:
    "AMLI Pharma brings beauty and care together through TRIECARE. Visit our Tashkent store at Bunyodkor 7G, open daily 08:00-23:00.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "AMLI Pharma | Beauty, pharmacy & care in one place",
    description:
      "TRIECARE opened in Tashkent on 12 October 2026, bringing beauty and pharmacy together. Telemedicine is in development.",
    images: [
      {
        url: "/images/triecare-tashkent-store.webp",
        width: 1600,
        height: 1067,
        alt: "The TRIECARE store in Tashkent, Uzbekistan"
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
