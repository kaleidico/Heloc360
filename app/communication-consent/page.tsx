import Link from "next/link"
import { Phone, MessageSquare, Shield, CheckCircle, AlertCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Communication Consent - HELOC360",
  description:
    "Understand how HELOC360 communicates with you, including phone calls and text messages. Learn about your consent options and communication preferences.",
  alternates: {
    canonical: "https://heloc360.com/communication-consent",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CommunicationConsentPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1b75bc] to-[#02c39a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Communication Consent</h1>
            <p className="text-lg opacity-90">Understanding how we communicate with you and your consent preferences</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Main Consent Statement */}
            <div className="bg-blue-50 border-l-4 border-l-[#1b75bc] p-8 rounded-lg mb-12">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-[#1b75bc] mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-[#1b75bc] mb-4">Your Communication Consent</h2>
                  <p className="text-lg leading-relaxed text-gray-700">
                    By submitting your contact information you agree to our{" "}
                    <Link href="/terms" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors underline">
                      Terms of Use
                    </Link>{" "}
                    and our{" "}
                    <Link href="/privacy" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors underline">
                      Security and Privacy Policy
                    </Link>
                    . You also expressly consent to having us, our affiliates, and our partners contact you about your
                    inquiry by text message or phone (including automatic telephone dialing system or an artificial or
                    prerecorded voice) to the residential or cellular telephone number you have provided, even if that
                    telephone number is on a corporate, state, or national Do Not Call Registry. You do not have to
                    agree to receive such calls or messages as a condition of getting any services from HELOC360 or its
                    affiliates.
                  </p>
                </div>
              </div>
            </div>

            {/* What This Means */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">What This Means for You</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Phone className="w-6 h-6 text-[#1b75bc] mt-1 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-[#1b75bc]">Phone Communications</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">We may call you to discuss your HELOC inquiry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">Calls may be made using automated dialing systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">Some calls may use prerecorded messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">We can call even if you're on Do Not Call lists</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-[#1b75bc]">Text Messages</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">We may send text messages about your inquiry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">Messages may include updates and information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">Standard message and data rates may apply</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                      <span className="text-sm">You can opt out at any time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-green-50 border-l-4 border-l-[#02c39a] p-6 rounded-lg mb-12">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-[#02c39a] mb-2">Your Choice</h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>
                      You do not have to agree to receive calls or messages as a condition of getting services from
                      HELOC360.
                    </strong>{" "}
                    This consent is optional, but it helps us provide you with timely updates and personalized
                    assistance with your home equity needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Communication Types */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">Types of Communications You May Receive</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">Initial Contact</h3>
                  <p className="text-gray-700 mb-3">
                    After you submit an inquiry, we or our partners may contact you to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Confirm your inquiry and gather additional information</li>
                    <li>Explain our services and how we can help</li>
                    <li>Schedule a consultation or discussion</li>
                    <li>Answer any questions you may have</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">Follow-up Communications</h3>
                  <p className="text-gray-700 mb-3">During the process, you may receive communications about:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Updates on your application or inquiry status</li>
                    <li>Requests for additional documentation</li>
                    <li>Lender matches and recommendations</li>
                    <li>Important deadlines or time-sensitive information</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">Educational Content</h3>
                  <p className="text-gray-700 mb-3">We may also share helpful information such as:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>HELOC tips and best practices</li>
                    <li>Market updates and rate information</li>
                    <li>Educational resources and guides</li>
                    <li>Relevant financial planning content</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Opt-Out Information */}
            <div className="bg-yellow-50 border-l-4 border-l-yellow-400 p-6 rounded-lg mb-12">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">How to Opt Out</h3>
                  <p className="text-yellow-700 mb-4">
                    You can stop receiving communications from us at any time using these methods:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-yellow-800">Text Messages:</h4>
                      <p className="text-yellow-700 text-sm">Reply "STOP" to any text message to unsubscribe</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800">Phone Calls:</h4>
                      <p className="text-yellow-700 text-sm">
                        Ask to be removed from our calling list during any call, or contact us directly
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800">Email:</h4>
                      <p className="text-yellow-700 text-sm">
                        Contact us at{" "}
                        <a href="mailto:help@heloc360.com" className="text-yellow-800 hover:text-yellow-900 underline">
                          help@heloc360.com
                        </a>{" "}
                        to update your preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Who May Contact You */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">Who May Contact You</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-[#1b75bc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-[#1b75bc]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-2">HELOC360 Team</h3>
                  <p className="text-gray-600 text-sm">
                    Our customer service and loan specialists may contact you directly about your inquiry.
                  </p>
                </div>

                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-[#02c39a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-[#02c39a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-2">Partner Lenders</h3>
                  <p className="text-gray-600 text-sm">
                    Vetted lenders in our network may contact you with loan options and offers.
                  </p>
                </div>

                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1b75bc] mb-2">Service Providers</h3>
                  <p className="text-gray-600 text-sm">
                    Third-party services that help process your application may contact you as needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#02c39a]/10 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Questions About Communication Consent?</h3>
              <p className="text-lg leading-relaxed mb-6">
                If you have questions about our communication practices, want to update your preferences, or need to opt
                out of communications, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:help@heloc360.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white font-medium rounded-lg transition-colors"
                >
                  Email Support Team
                </a>
                <a
                  href="tel:3132640470"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[#1b75bc] text-[#1b75bc] hover:bg-[#1b75bc] hover:text-white font-medium rounded-lg transition-colors"
                >
                  Call (313) 264-0470
                </a>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This communication consent policy is effective as of the date of your use of our website. We may update
                this policy from time to time, and we will post any changes on this page.
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
