import type React from "react"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import dynamic from "next/dynamic"
import TrackingProvider from "@/components/tracking-provider"

const ScrollToTop = dynamic(() => import("@/components/scroll-to-top"), {
  loading: () => null,
})

const StickyCta = dynamic(() => import("@/components/sticky-cta"), {
  loading: () => null,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://heloc360.com"),
  title: {
    default: "HELOC360 - Your Trusted Partner in Home Equity Lines of Credit",
    template: "%s | HELOC360",
  },
  description:
    "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders. Expert guidance, simplified process, free & confidential.",
  keywords: [
    "HELOC",
    "Home Equity Line of Credit",
    "Home Equity",
    "Debt Consolidation",
    "Home Improvement Loans",
    "Second Mortgage",
    "Home Equity Lenders",
    "HELOC Calculator",
    "Home Equity Calculator",
  ],
  authors: [{ name: "HELOC360 Team" }],
  creator: "HELOC360",
  publisher: "My Perfect Leads, LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://heloc360.com",
    siteName: "HELOC360",
    title: "HELOC360 - Your Trusted Partner in Home Equity Lines of Credit",
    description:
      "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HELOC360 - Home Equity Line of Credit Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HELOC360 - Your Trusted Partner in Home Equity Lines of Credit",
    description:
      "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders.",
    images: ["/images/twitter-image.jpg"],
    creator: "@heloc360",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#1b75bc" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://heloc360.com",
  },
  verification: {
    google: "KONfGE1Ipq2IMzNtKuAAeIWG-8Nr7FqnIwcwEySOkg0",
    yandex: "",
    yahoo: "",
  },
  category: "finance",
  generator: 'v0.dev'
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "HELOC360",
  description:
    "Your trusted partner in turning home equity into opportunity. We help homeowners access Home Equity Lines of Credit through vetted lenders.",
  url: "https://heloc360.com",
  logo: "https://heloc360.com/images/heloc360-logo.webp",
  image: "https://heloc360.com/images/og-image.jpg",
  telephone: "+1-800-HELOC360",
  email: "info@heloc360.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  sameAs: ["https://facebook.com/heloc360", "https://twitter.com/heloc360", "https://linkedin.com/company/heloc360"],
  serviceType: "Home Equity Line of Credit Services",
  areaServed: "United States",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "HELOC Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "HELOC Pre-Qualification",
          description: "Free pre-qualification for Home Equity Lines of Credit",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lender Matching",
          description: "Connect with vetted HELOC lenders",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "HELOC Education",
          description: "Educational resources and calculators for HELOCs",
        },
      },
    ],
  },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-blue text-white px-4 py-2 rounded-md z-50 focus:z-50"
      >
        Skip to main content
      </a>

      <ScrollToTop />
      <Header />

      <main id="main-content" className="min-h-screen">
        <TrackingProvider>{children}</TrackingProvider>
      </main>

      <Footer />
      <StickyCta />
    </>
  )
}
