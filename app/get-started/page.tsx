import { Metadata } from 'next'
import MortgageApplicationWrapper from '@/components/mortgage-application/mortgage-application-wrapper'
import SEOHead from '@/components/seo-head'

export const metadata: Metadata = {
  title: 'Get Started | HELOC360',
  description: 'Start your mortgage application with our easy-to-use, multi-step form. Get started today with HELOC360.',
  keywords: 'mortgage application, home loan, mortgage form, HELOC application, get started',
  openGraph: {
    title: 'Get Started | HELOC360',
    description: 'Start your mortgage application with our easy-to-use, multi-step form.',
    type: 'website',
  },
}

export default function GetStartedPage() {
  return (
    <>
      <SEOHead
        title="Get Started | HELOC360"
        description="Start your mortgage application with our easy-to-use, multi-step form. Get started today with HELOC360."
        canonical="/get-started"
      />
      <div className="min-h-screen relative overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="absolute inset-0 bg-white opacity-50"></div>
          {/* Animated shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200 opacity-20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-black/5 backdrop-blur-sm rounded-full text-gray-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              Secure Application • 256-bit Encryption
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight" style={{ lineHeight: 1.3 }}>
              Let's Get You
              <span className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Home Financing
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your dream home is just a few steps away. Complete our simple application 
              and get approved in as little as 24 hours.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">No Hidden Fees</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h1a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Fast Approval</span>
              </div>
            </div>
          </div>

                                {/* Form Container */}
                      <div className="max-w-4xl mx-auto">
                        <MortgageApplicationWrapper />
                      </div>

          {/* Bottom Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-gray-700 border border-white/50">
              <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Quick Process</h3>
              <p className="text-gray-600 text-sm">Complete your application in under 10 minutes</p>
            </div>
            
            <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-gray-700 border border-white/50">
              <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your information is encrypted and protected</p>
            </div>
            
            <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-gray-700 border border-white/50">
              <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Decision</h3>
              <p className="text-gray-600 text-sm">Get pre-approved instantly with our smart system</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}