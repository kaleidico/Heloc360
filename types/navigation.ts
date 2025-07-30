export interface NavigationItem {
  label: string
  url: string | null
  type: "text" | "cta-button"
  icon: string | null
  children?: NavigationItem[]
}

export interface FooterNavigationItem {
  label: string
  url: string
  type: "text" | "tel" | "email"
  icon: string | null
}

export interface FooterNavigation {
  companyInfo: {
    tagline: string
    callToAction: string
    description: string
    legalDisclaimer: string
  }
  socialMedia: FooterNavigationItem[]
  learnMore: FooterNavigationItem[]
  tools: FooterNavigationItem[]
  aboutUs: FooterNavigationItem[]
  bottomFooterRow: FooterNavigationItem[]
}
