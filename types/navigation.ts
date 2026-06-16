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

export interface FooterCompanyInfo {
  tagline: string
  callToAction: string
  description: string
  address: string
  legalDisclaimer: string
}

export interface FooterMailingList {
  heading: string
  subheading: string
  ctaLabel: string
}

export interface FooterNavigation {
  companyInfo: FooterCompanyInfo
  mailingList: FooterMailingList
  socialMedia: FooterNavigationItem[]
  useCases: FooterNavigationItem[]
  calculators: FooterNavigationItem[]
  resources: FooterNavigationItem[]
  company: FooterNavigationItem[]
  legal: FooterNavigationItem[]
}
