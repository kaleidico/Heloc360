import Link from "next/link"
import { Shield, Heart, CheckCircle, ExternalLink } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Affiliate Disclosure - HELOC360",
  description:
    "Learn about HELOC360's affiliate relationships and how we maintain transparency in our recommendations. We only recommend products and services we believe provide value.",
  alternates: {
    canonical: "https://heloc360.com/affiliate-disclosure",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1b75bc] to-[#02c39a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transparency Matters Explore Affiliate Disclosures in Detail
            </h1>
            <p className="text-lg opacity-90">
              We believe in complete transparency about our affiliate relationships and recommendations
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="prose prose-lg prose-gray mb-12">
              <p className="text-lg leading-relaxed mb-6">
                heloc360.com is a real estate research and education website provided by{" "}
                <a
                  href="https://myperfectleads.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#1b75bc] hover:text-[#02c39a] transition-colors inline-flex items-center gap-1"
                >
                  My Perfect Leads, LLC
                  <ExternalLink className="w-4 h-4" />
                </a>
                . heloc360.com is not a mortgage lender.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                I'm passionate about teaching and guiding people to a better personal finance situation. To do this, I
                create an enormous amount of content, which takes time, resources, and money.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                In order to finance these products and services for you, I use affiliate marketing and link to products
                and services. If you click on, subscribe, to purchase on these links then I am paid a commission.
              </p>

              <p className="text-lg leading-relaxed mb-8">
                I diligently review and attempt to only select and recommend products and services that I think are of
                high quality and value to you, my reader.
              </p>
            </div>

            {/* Our Commitment */}
            <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#02c39a]/10 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6 flex items-center gap-3">
                <Heart className="w-6 h-6" />
                Our Commitment to You
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quality First</h3>
                    <p className="text-gray-700 text-sm">
                      We only recommend products and services that we genuinely believe will benefit our readers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Honest Reviews</h3>
                    <p className="text-gray-700 text-sm">
                      Our reviews and recommendations are based on thorough research and honest evaluation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Clear Disclosure</h3>
                    <p className="text-gray-700 text-sm">
                      We clearly identify affiliate links and relationships throughout our content.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Your Best Interest</h3>
                    <p className="text-gray-700 text-sm">
                      Our primary goal is to help you make informed financial decisions, not to earn commissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How Affiliate Marketing Works */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">How Affiliate Marketing Works</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-l-[#1b75bc] pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What Are Affiliate Links?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Affiliate links are special URLs that track when someone clicks from our website to a partner's
                    website. If you make a purchase or sign up for a service through these links, we may receive a
                    commission at no additional cost to you.
                  </p>
                </div>

                <div className="border-l-4 border-l-[#02c39a] pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Extra Cost to You</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you use our affiliate links, you pay the same price you would pay if you went directly to the
                    company's website. The commission comes from the company's marketing budget, not from your pocket.
                  </p>
                </div>

                <div className="border-l-4 border-l-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Supporting Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    These commissions help us maintain our website, create valuable content, and continue providing free
                    educational resources about home equity and financial planning.
                  </p>
                </div>
              </div>
            </div>

            {/* Types of Partnerships */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">Types of Partnerships</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">Lender Partnerships</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    We partner with reputable lenders who offer competitive HELOC products. When you're matched with a
                    lender through our service, we may receive compensation.
                  </p>
                  <p className="text-xs text-gray-600">
                    This compensation never influences our recommendations or the lenders we choose to work with.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">Educational Resources</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    We may recommend books, courses, or tools that help with financial planning and home equity
                    management.
                  </p>
                  <p className="text-xs text-gray-600">
                    These recommendations are based on quality and relevance to our readers' needs.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">Financial Tools</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    We may affiliate with companies that provide useful financial calculators, budgeting apps, or
                    investment platforms.
                  </p>
                  <p className="text-xs text-gray-600">
                    We only recommend tools that we believe genuinely help with financial management.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">Professional Services</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    We may recommend financial advisors, tax professionals, or real estate services that complement our
                    educational content.
                  </p>
                  <p className="text-xs text-gray-600">
                    These professionals are vetted for their expertise and commitment to client service.
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Independence */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6" />
                Editorial Independence
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Our editorial content is created independently of our affiliate relationships. We maintain strict
                  editorial standards and never allow affiliate partnerships to influence our educational content,
                  reviews, or recommendations.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  When we write about financial products or services, our primary consideration is always what's best
                  for our readers, not what generates the highest commission.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We regularly review our affiliate partnerships to ensure they continue to align with our values and
                  provide genuine value to our audience.
                </p>
              </div>
            </div>

            {/* FTC Compliance */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">FTC Compliance</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In accordance with Federal Trade Commission (FTC) guidelines, we disclose that we may receive
                compensation when you click on certain links or make purchases through our website.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                This disclosure is made in the interest of full transparency and in compliance with FTC regulations
                regarding endorsements and testimonials in advertising.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are committed to honest and transparent communication with our readers about all aspects of our
                business model.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#02c39a]/10 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
                Questions About Our Affiliate Relationships?
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                If you have any questions about our affiliate relationships, how we select partners, or our editorial
                policies, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:compliance@heloc360.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white font-medium rounded-lg transition-colors"
                >
                  Contact Our Team
                </a>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[#1b75bc] text-[#1b75bc] hover:bg-[#1b75bc] hover:text-white font-medium rounded-lg transition-colors"
                >
                  View Privacy Policy
                </Link>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This affiliate disclosure is effective as of the date of your use of our website. We may update this
                disclosure from time to time, and we will post any changes on this page.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <Link href="/" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                  Return to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
