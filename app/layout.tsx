import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tolmol.pk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tolmol — Compare prices across every store",
    template: "%s · Tolmol"
  },
  description:
    "Search any product once, compare live prices across Pakistani stores, and get pinged on price drops. Join the waitlist.",
  applicationName: "Tolmol",
  keywords: [
    "price comparison",
    "Pakistan",
    "PKR",
    "online shopping",
    "Tolmol"
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Tolmol",
    title: "Tolmol — Compare prices across every store",
    description:
      "One search across every store. Live prices, real deliveries, no tab-juggling.",
    locale: "en_PK"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tolmol — Compare prices across every store",
    description:
      "One search across every store. Live prices, real deliveries, no tab-juggling."
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light"
};

const beaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jakarta.variable}>
        {children}
        {beaconToken ? (
          <Script
            strategy="afterInteractive"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: beaconToken })}
          />
        ) : null}
      </body>
    </html>
  );
}
