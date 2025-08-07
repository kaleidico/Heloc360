'use client'

import dynamic from 'next/dynamic'

const MortgageApplicationForm = dynamic(() => import('./mortgage-application-form'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ),
})

export default function MortgageApplicationWrapper() {
  return <MortgageApplicationForm />
}
