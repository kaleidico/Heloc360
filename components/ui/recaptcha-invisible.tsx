'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface InvisibleRecaptchaHandle {
  // Triggers the invisible challenge and resolves with a one-time response token
  // to send to the server. Resolves "" when no sitekey is configured (the server
  // skips verification when RECAPTCHA_SECRET_KEY is unset), so the form still works.
  execute: () => Promise<string>
}

interface InvisibleRecaptchaProps {
  sitekey?: string
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => number
      execute: (widgetId: number) => void
      reset: (widgetId: number) => void
    }
  }
}

const SCRIPT_SRC = 'https://www.google.com/recaptcha/api.js?render=explicit'

// Google reCAPTCHA v2 (Invisible). No checkbox — the challenge runs on submit when
// the form calls execute(). Hand-rolled (no dependency) to match the codebase style.
export const InvisibleRecaptcha = forwardRef<InvisibleRecaptchaHandle, InvisibleRecaptchaProps>(
  function InvisibleRecaptcha({ sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<number | null>(null)
    const resolverRef = useRef<{
      resolve: (token: string) => void
      reject: (err: unknown) => void
    } | null>(null)

    useImperativeHandle(ref, () => ({
      execute: () =>
        new Promise<string>((resolve, reject) => {
          if (!sitekey) {
            resolve('') // not configured — let the submission proceed
            return
          }
          if (widgetIdRef.current === null || !window.grecaptcha) {
            reject(new Error('reCAPTCHA not ready'))
            return
          }
          // Safety net: if Google never fires callback/error-callback (e.g. an
          // unregistered domain, or a network stall), don't leave the form stuck
          // in "Sending…" forever — reject so the caller can show an error.
          const timer = setTimeout(() => {
            resolverRef.current = null
            reject(new Error('reCAPTCHA timed out'))
          }, 15000)
          resolverRef.current = {
            resolve: (token) => {
              clearTimeout(timer)
              resolve(token)
            },
            reject: (err) => {
              clearTimeout(timer)
              reject(err)
            },
          }
          window.grecaptcha.execute(widgetIdRef.current)
        }),
    }))

    useEffect(() => {
      if (!sitekey) return
      let cancelled = false

      const renderWidget = () => {
        if (cancelled || !containerRef.current || !window.grecaptcha?.render) return
        // StrictMode double-mounts effects in dev; render only once.
        if (widgetIdRef.current !== null || containerRef.current.childElementCount > 0) return
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey,
          size: 'invisible',
          badge: 'bottomright',
          callback: (token: string) => {
            resolverRef.current?.resolve(token)
            resolverRef.current = null
            if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current)
          },
          'expired-callback': () => {
            resolverRef.current?.reject(new Error('reCAPTCHA expired'))
            resolverRef.current = null
          },
          'error-callback': () => {
            resolverRef.current?.reject(new Error('reCAPTCHA error'))
            resolverRef.current = null
          },
        })
      }

      const waitForApi = () => {
        if (cancelled) return
        if (window.grecaptcha?.render) renderWidget()
        else setTimeout(waitForApi, 150)
      }

      if (window.grecaptcha?.render) {
        renderWidget()
      } else {
        if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
          const script = document.createElement('script')
          script.src = SCRIPT_SRC
          script.async = true
          script.defer = true
          document.head.appendChild(script)
        }
        waitForApi()
      }

      return () => {
        cancelled = true
      }
    }, [sitekey])

    return <div ref={containerRef} />
  },
)
