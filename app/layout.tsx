import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1b75bc" },
    { media: "(prefers-color-scheme: dark)", color: "#02c39a" },
  ],
}

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
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "finance",
    generator: 'v0.dev'
}

// Structured Data for SEO
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1b75bc] text-white px-4 py-2 rounded-md z-50 focus:z-50"
        >
          Skip to main content
        </a>

        {/* Scroll to top on route change */}
        <ScrollToTop />

        <Header />

        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        <Footer />

        {/* Google Analytics - Replace with your GA4 ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
