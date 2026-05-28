"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import headerNavData from "@/config/header-nav.json"
import type { NavigationItem } from "@/types/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [isCompact, setIsCompact] = useState(false)

  // Compact on scroll past 200px (per spec §11).
  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 200)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const items: NavigationItem[] = (headerNavData as NavigationItem[]).filter(
    (item) => item.type !== "cta-button"
  )
  const ctas: NavigationItem[] = (headerNavData as NavigationItem[]).filter(
    (item) => item.type === "cta-button"
  )

  const handleDropdownKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpenDropdown(openDropdown === index ? null : index)
    } else if (e.key === "Escape") {
      setOpenDropdown(null)
    }
  }

  return (
    <header
      className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-200 ${
        isCompact ? "py-1" : "py-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-200 ${
            isCompact ? "h-12" : "h-16"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="HELOC360 home">
            <Image
              src="/images/heloc360-logo.avif"
              alt="HELOC360"
              width={180}
              height={40}
              className={`w-auto transition-all duration-200 ${
                isCompact ? "h-7" : "h-9"
              }`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary">
            {items.map((item, index) => (
              <div key={index} className="relative">
                {item.children ? (
                  <>
                    <button
                      className="flex items-center text-ink-700 hover:text-brand-blue transition-colors font-medium"
                      aria-expanded={openDropdown === index}
                      onClick={() =>
                        setOpenDropdown(openDropdown === index ? null : index)
                      }
                      onKeyDown={(e) => handleDropdownKeyDown(e, index)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-surface-200 transition-all duration-150 ${
                        openDropdown === index
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                      onMouseLeave={() => setOpenDropdown(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setOpenDropdown(null)
                        }
                      }}
                    >
                      <div className="p-2">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.url || "#"}
                            className="block px-4 py-2 text-ink-700 hover:bg-surface-50 hover:text-brand-blue rounded transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.url || "#"}
                    className="text-ink-700 hover:text-brand-blue transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button (desktop) */}
          {ctas.map((cta, index) => (
            <Button
              key={index}
              className="hidden lg:flex items-center bg-brand-green hover:bg-brand-green-dark text-white font-semibold"
              asChild
            >
              <Link href={cta.url || "#"}>{cta.label} →</Link>
            </Button>
          ))}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-ink-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-surface-200">
            <nav className="space-y-3" aria-label="Mobile primary">
              {items.map((item, index) => (
                <div key={index}>
                  {item.children ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-ink-900">
                        {item.label}
                      </div>
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.url || "#"}
                          className="block pl-4 py-1 text-ink-700 hover:text-brand-blue"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.url || "#"}
                      className="block py-1 text-ink-900 font-medium hover:text-brand-blue"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {ctas.map((cta, index) => (
                <Button
                  key={index}
                  className="w-full flex items-center justify-center bg-brand-green hover:bg-brand-green-dark text-white font-semibold mt-3"
                  asChild
                >
                  <Link
                    href={cta.url || "#"}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cta.label} →
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
