import Head from "next/head"

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  noindex?: boolean
}

export default function SEOHead({ title, description, canonical, ogImage, noindex = false }: SEOHeadProps) {
  const defaultTitle = "HELOC360 - Your Trusted Partner in Home Equity Lines of Credit"
  const defaultDescription =
    "Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders."

  const pageTitle = title ? `${title} | HELOC360` : defaultTitle
  const pageDescription = description || defaultDescription
  const pageCanonical = canonical || "https://heloc360.com"
  const pageOgImage = ogImage || "/images/og-image.jpg"

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageCanonical} />

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageOgImage} />
      <meta property="og:url" content={pageCanonical} />

      {/* Twitter */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageOgImage} />
    </Head>
  )
}
