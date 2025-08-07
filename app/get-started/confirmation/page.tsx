import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Phone, Mail, Clock } from 'lucide-react'
import SEOHead from '@/components/seo-head'

export const metadata: Metadata = {
  title: 'Application Submitted | HELOC360',
  description: 'Your mortgage application has been successfully submitted. We\'ll be in touch soon.',
}

export default function ConfirmationPage() {
  return (
    <>
      <SEOHead
        title="Application Submitted | HELOC360"
        description="Your mortgage application has been successfully submitted. We\'ll be in touch soon."
        canonical="/get-started/confirmation"
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h1>
              <p className="text-lg text-gray-600">
                Thank you for submitting your mortgage application. We've received your information
                and will review it shortly.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What happens next?
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Review Process</h3>
                    <p className="text-sm text-gray-600">Our team will review your application within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone Call</h3>
                    <p className="text-sm text-gray-600">We'll call you to discuss your options and next steps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email Confirmation</h3>
                    <p className="text-sm text-gray-600">You'll receive a confirmation email with your application details</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Return to Homepage
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Have questions? Call us at{' '}
                <a
                  href="tel:+1-800-HELOC-360"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  1-800-HELOC-360
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
