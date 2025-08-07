'use client'

import { useEffect } from 'react'
import { initializeTracking } from '@/lib/tracking'

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeTracking()
  }, [])

  return <>{children}</>
}
