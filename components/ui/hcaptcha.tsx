'use client'

import { useEffect, useRef } from 'react'

interface HCaptchaProps {
  onVerify: (token: string) => void
  onExpire: () => void
  sitekey?: string
}

declare global {
  interface Window {
    hcaptcha: {
      render: (container: string | HTMLElement, options: any) => string
      reset: (widgetId: string) => void
      getResponse: (widgetId: string) => string
      onReady: (callback: () => void) => void
    }
  }
}

export default function HCaptcha({
  onVerify,
  onExpire,
  sitekey = "10000000-ffff-ffff-ffff-000000000001" // Default test key
}: HCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Load hCaptcha script if not already loaded
    if (!window.hcaptcha) {
      const script = document.createElement('script')
      script.src = 'https://js.hcaptcha.com/1/api.js'
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = () => {
        if (containerRef.current && window.hcaptcha) {
          widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
            sitekey: sitekey,
            theme: 'light',
            size: 'normal',
            callback: (token: string) => {
              onVerify(token)
            },
            'expired-callback': () => {
              onExpire()
            },
            'error-callback': () => {
              onExpire()
            }
          })
        }
      }
    } else {
      // Script already loaded, render immediately
      if (containerRef.current) {
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: sitekey,
          theme: 'light',
          size: 'normal',
          callback: (token: string) => {
            onVerify(token)
          },
          'expired-callback': () => {
            onExpire()
          },
          'error-callback': () => {
            onExpire()
          }
        })
      }
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.hcaptcha) {
        window.hcaptcha.reset(widgetIdRef.current)
      }
    }
  }, [sitekey, onVerify, onExpire])

  return (
    <div className="mt-4">
      <div ref={containerRef} className="flex justify-center" />
      <p className="text-xs text-gray-500 mt-2 text-center">
        This site is protected by hCaptcha and its{' '}
        <a
          href="https://www.hcaptcha.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="https://www.hcaptcha.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </div>
  )
}
