import type { Metadata } from "next"
import NotFoundClient from "./not-found-client"

export const metadata: Metadata = {
  title: "Page Not Found - HELOC360",
  description:
    "The page you're looking for doesn't exist. Browse our HELOC resources or contact us for help.",
  openGraph: {
    title: "Page Not Found - HELOC360",
    description:
      "The page you're looking for doesn't exist. Browse our HELOC resources or contact us for help.",
    siteName: "HELOC360",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Not Found - HELOC360",
    description:
      "The page you're looking for doesn't exist. Browse our HELOC resources or contact us for help.",
  },
}

export default function NotFound() {
  return <NotFoundClient />
}
