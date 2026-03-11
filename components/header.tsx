"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import headerNavData from "@/config/header-nav.json"
import type { NavigationItem } from "@/types/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  // Transform navigation data
  const transformNavigationData = (): NavigationItem[] => {
    return headerNavData.filter((item) => item.type !== "cta-button")
  }

  // Get CTA buttons
  const getCTAButtons = (): NavigationItem[] => {
    return headerNavData.filter((item) => item.type === "cta-button")
  }

  const navigationItems = transformNavigationData()
  const ctaButtons = getCTAButtons()

  const handleDropdownKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpenDropdown(openDropdown === index ? null : index)
    } else if (e.key === "Escape") {
      setOpenDropdown(null)
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/heloc360-logo.webp"
              alt="HELOC360 Logo"
              width={180}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group focus-within:block">
                {item.children ? (
                  <>
                    <button
                      className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                      aria-haspopup="true"
                      aria-expanded={openDropdown === index}
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      onKeyDown={(e) => handleDropdownKeyDown(e, index)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border transition-all duration-200 ${
                        openDropdown === index
                          ? "opacity-100 visible"
                          : "opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible"
                      }`}
                    >
                      <div className="p-2">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.url || "#"}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            onBlur={(e) => {
                              // Close dropdown when focus leaves the last child
                              if (childIndex === (item.children?.length ?? 0) - 1) {
                                const relatedTarget = e.relatedTarget as HTMLElement | null
                                if (!relatedTarget || !e.currentTarget.parentElement?.parentElement?.contains(relatedTarget)) {
                                  setOpenDropdown(null)
                                }
                              }
                            }}
                          >
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.url || "#"}
                    className="flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors"
                  >
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          {ctaButtons.map((cta, index) => (
            <Button
              key={index}
              className="hidden lg:flex items-center bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white"
              asChild
            >
              <Link href={cta.url || "#"}>
                <span>{cta.label}</span>
              </Link>
            </Button>
          ))}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="space-y-4">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  {item.children ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700 font-medium">
                        <span>{item.label}</span>
                      </div>
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.url || "#"}
                          className="flex items-center pl-4 text-gray-600 hover:text-[#1b75bc]"
                        >
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link href={item.url || "#"} className="flex items-center text-gray-700 hover:text-[#1b75bc]">
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              {ctaButtons.map((cta, index) => (
                <Button
                  key={index}
                  className="w-full flex items-center justify-center bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white mt-4"
                  asChild
                >
                  <Link href={cta.url || "#"}>
                    <span>{cta.label}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
