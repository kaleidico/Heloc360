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
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove?: (widgetId: string) => void
      getResponse: (widgetId: string) => string
      onReady: (callback: () => void) => void
    }
  }
}

const SCRIPT_SRC = 'https://js.hcaptcha.com/1/api.js'

export default function HCaptcha({
  onVerify,
  onExpire,
  sitekey = "10000000-ffff-ffff-ffff-000000000001" // Default test key
}: HCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  // Hold the latest callbacks in refs so the render effect can stay stable
  // (sitekey-only deps) without callback identity churn re-mounting the widget.
  const onVerifyRef = useRef(onVerify)
  const onExpireRef = useRef(onExpire)
  onVerifyRef.current = onVerify
  onExpireRef.current = onExpire

  useEffect(() => {
    let cancelled = false

    const renderWidget = () => {
      if (cancelled) return
      if (!containerRef.current || !window.hcaptcha) return
      // StrictMode double-mounts effects in dev. If our previous mount already
      // rendered a widget into this container, don't render a second one —
      // hCaptcha throws "Only one captcha is permitted per parent container."
      if (containerRef.current.childElementCount > 0) return
      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey,
        theme: 'light',
        size: 'normal',
        callback: (token: string) => onVerifyRef.current(token),
        'expired-callback': () => onExpireRef.current(),
        'error-callback': () => onExpireRef.current(),
      })
    }

    if (window.hcaptcha) {
      renderWidget()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (existing) {
        existing.addEventListener('load', renderWidget)
      } else {
        const script = document.createElement('script')
        script.src = SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onload = renderWidget
        document.head.appendChild(script)
      }
    }

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.hcaptcha) {
        // `remove()` fully detaches the widget; `reset()` only clears state and
        // leaves DOM that the next mount would clash with. Some hCaptcha
        // builds expose only `reset()` — clear the container DOM as a fallback.
        if (window.hcaptcha.remove) {
          window.hcaptcha.remove(widgetIdRef.current)
        } else {
          window.hcaptcha.reset(widgetIdRef.current)
        }
        widgetIdRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [sitekey])

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
