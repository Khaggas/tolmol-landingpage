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

const title = "Tolmol — Compare prices across every Pakistani store";
const description =
  "Tolmol lets Pakistani shoppers search any product once and compare live PKR prices, delivery, ratings and stock across every major store. Join the waitlist for launch alerts and price-drop pings.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Tolmol"
  },
  description,
  applicationName: "Tolmol",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "shopping",
  classification: "Price comparison, online shopping, Pakistan",
  authors: [{ name: "Tolmol", url: siteUrl }],
  creator: "Tolmol",
  publisher: "Tolmol",
  keywords: [
    "price comparison Pakistan",
    "compare prices Pakistan",
    "Pakistan price comparison",
    "online shopping Pakistan",
    "best price Pakistan",
    "cheapest price Pakistan",
    "PKR price tracker",
    "price drop alerts Pakistan",
    "electronics price compare Pakistan",
    "GPU price Pakistan",
    "laptop price Pakistan",
    "mobile price Pakistan",
    "qeemat compare",
    "sasti cheez",
    "tolmol",
    "tolmol.pk",
    "Daraz alternative",
    "PriceOye alternative",
    "Czone",
    "Paklap",
    "Dadu Charger"
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-PK": "/",
      "x-default": "/"
    }
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Tolmol",
    title,
    description:
      "One search across every Pakistani store. Live PKR prices, delivery, ratings and stock — side by side. Join the waitlist for launch and price-drop alerts.",
    locale: "en_PK",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Tolmol — Compare prices across every Pakistani store",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "One search across every Pakistani store. Live PKR prices, no tab-juggling.",
    images: ["/opengraph-image"],
    creator: "@tolmolpk",
    site: "@tolmolpk"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false
  },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": "#030712",
    "theme-color": "#ffffff"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" }
  ],
  colorScheme: "light"
};

const beaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Tolmol",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/icon`,
    width: 512,
    height: 512
  },
  description,
  email: "hello@tolmol.pk",
  areaServed: {
    "@type": "Country",
    name: "Pakistan"
  },
  sameAs: [] as string[]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Tolmol",
  description,
  inLanguage: "en-PK",
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${siteUrl}/#webapp`,
  name: "Tolmol",
  applicationCategory: "ShoppingApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description,
  inLanguage: "en-PK",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "PKR"
  },
  featureList: [
    "Single-search across every Pakistani store",
    "Live PKR price comparison",
    "Delivery, stock and rating side-by-side",
    "Price-drop alerts"
  ],
  publisher: { "@id": `${siteUrl}/#organization` }
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Tolmol?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tolmol is a Pakistan-focused price-comparison service. Search any product once and see live PKR prices, delivery times, ratings and stock from every major Pakistani store side by side."
      }
    },
    {
      "@type": "Question",
      name: "Does Tolmol sell products?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Tolmol is a comparison layer — it does not hold inventory or process payments. Checkout always happens on the retailer's own site."
      }
    },
    {
      "@type": "Question",
      name: "Is Tolmol live yet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tolmol is pre-launch. Join the waitlist to be notified at launch and to receive price-drop alerts for products you're watching."
      }
    },
    {
      "@type": "Question",
      name: "Which stores does Tolmol cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tolmol launches with major Pakistani electronics retailers including Czone, Paklap, Tejar, Dadu Charger, Junaid Tech, eTechPoint, The Binary Store, Authentico, The Brand Store and MasterTech, with more categories on the roadmap."
      }
    },
    {
      "@type": "Question",
      name: "Is Tolmol free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Tolmol is free for shoppers. There is no fee to search, compare or receive price-drop alerts."
      }
    }
  ]
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationJsonLd, websiteJsonLd, webAppJsonLd, faqJsonLd]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <Script
          id="ld-json-graph"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
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
