"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Phone, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import HCaptcha from "@/components/ui/hcaptcha"
import { getMergedTrackingData } from "@/lib/tracking"
import {
  PreQualSubmissionSchema,
  type PreQualSubmission,
  type Step1Values,
  type BestTime,
} from "@/lib/pre-qual/schema"
import { formatCurrency, parseCurrency, formatPhoneNumber, normalizeZip } from "@/lib/pre-qual/masks"
import { lookupZip } from "@/lib/pre-qual/zip-lookup"
import { EquityReadout } from "./equity-readout"
import { BestTimeChips } from "./best-time-chips"
import { slaCopy } from "@/lib/pre-qual/sla"
import type { UseCase } from "@/lib/pre-qual/use-case"

const STORAGE_KEY = "prequal:state"

interface PersistedState {
  zipCode?: string
  city?: string
  state?: string
  homeValueDisplay?: string
  mortgageBalanceDisplay?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  bestTime?: BestTime
  step1Valid?: boolean
}

interface PreQualFormProps {
  useCase: UseCase
  hcaptchaSiteKey?: string
}

export function PreQualForm({ useCase, hcaptchaSiteKey }: PreQualFormProps) {
  const [step1Valid, setStep1Valid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [hcaptchaToken, setHcaptchaToken] = useState("")
  const [zipLookupPending, setZipLookupPending] = useState(false)

  // Display strings for the currency-masked inputs (React Hook Form holds the
  // numeric values; these track what the user actually sees in the input).
  const [homeValueDisplay, setHomeValueDisplay] = useState("")
  const [mortgageBalanceDisplay, setMortgageBalanceDisplay] = useState("")

  const {
    register,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm<PreQualSubmission>({
    resolver: zodResolver(PreQualSubmissionSchema),
    defaultValues: {
      zipCode: "",
      city: "",
      state: "",
      homeValue: 0,
      mortgageBalance: 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bestTime: undefined,
      useCase,
      formType: "pre-qual-v1",
    },
    mode: "onTouched",
  })

  // Rehydrate persisted state on mount.
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as PersistedState
      if (saved.zipCode) setValue("zipCode", saved.zipCode)
      if (saved.city) setValue("city", saved.city)
      if (saved.state) setValue("state", saved.state)
      if (saved.homeValueDisplay) {
        setHomeValueDisplay(saved.homeValueDisplay)
        setValue("homeValue", parseCurrency(saved.homeValueDisplay))
      }
      if (saved.mortgageBalanceDisplay) {
        setMortgageBalanceDisplay(saved.mortgageBalanceDisplay)
        setValue("mortgageBalance", parseCurrency(saved.mortgageBalanceDisplay))
      }
      if (saved.firstName) setValue("firstName", saved.firstName)
      if (saved.lastName) setValue("lastName", saved.lastName)
      if (saved.email) setValue("email", saved.email)
      if (saved.phone) setValue("phone", saved.phone)
      if (saved.bestTime) setValue("bestTime", saved.bestTime)
      if (saved.step1Valid) setStep1Valid(true)
    } catch {
      // Corrupted storage — start fresh.
    }
  }, [setValue])

  // Persist on any tracked-field change.
  const tracked = watch([
    "zipCode",
    "city",
    "state",
    "firstName",
    "lastName",
    "email",
    "phone",
    "bestTime",
  ])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (submitted) return
    const state: PersistedState = {
      zipCode: getValues("zipCode"),
      city: getValues("city") ?? undefined,
      state: getValues("state") ?? undefined,
      homeValueDisplay,
      mortgageBalanceDisplay,
      firstName: getValues("firstName"),
      lastName: getValues("lastName"),
      email: getValues("email"),
      phone: getValues("phone"),
      bestTime: getValues("bestTime"),
      step1Valid,
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Quota exceeded or private mode — silently drop.
    }
  }, [tracked, homeValueDisplay, mortgageBalanceDisplay, step1Valid, submitted, getValues])

  const onZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeZip(e.target.value)
    setValue("zipCode", normalized)
    if (normalized.length >= 5) {
      setZipLookupPending(true)
      const loc = await lookupZip(normalized)
      setZipLookupPending(false)
      if (loc) {
        setValue("city", loc.city)
        setValue("state", loc.state)
      } else {
        setValue("city", "")
        setValue("state", "")
      }
    } else {
      setValue("city", "")
      setValue("state", "")
    }
  }

  const onCurrencyChange = (
    setter: (v: string) => void,
    field: "homeValue" | "mortgageBalance",
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setter(formatted)
    setValue(field, parseCurrency(formatted))
  }

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("phone", formatPhoneNumber(e.target.value))
  }

  const onContinue = async () => {
    const ok = await trigger(["zipCode", "homeValue", "mortgageBalance"])
    if (ok) setStep1Valid(true)
  }

  const onSubmitInner = async (data: PreQualSubmission) => {
    setSubmitError(null)
    setSubmitting(true)
    const tracking = (() => {
      try {
        return getMergedTrackingData()
      } catch {
        return {}
      }
    })()
    const payload: PreQualSubmission = {
      ...data,
      useCase,
      formType: "pre-qual-v1",
      hcaptchaToken: hcaptchaToken || undefined,
      ...tracking,
    }
    try {
      const response = await fetch("/api/submit-prequal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok || json?.success !== true) {
        setSubmitError(json?.message || "Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      setSubmitted(true)
      setSubmitting(false)
    } catch {
      setSubmitError("Network error. Please try again.")
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-brand-green/30 bg-brand-green/10 p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-2">
          You're in.
        </p>
        <p className="text-2xl font-bold text-ink-900 mb-3">{slaCopy()}</p>
        <p className="text-sm text-ink-700">
          We'll walk you through the trade-offs before any commitment. No credit pull yet.
        </p>
      </div>
    )
  }

  const homeValueNumber = parseCurrency(homeValueDisplay)
  const mortgageBalanceNumber = parseCurrency(mortgageBalanceDisplay)

  return (
    <form onSubmit={handleSubmit(onSubmitInner)} className="space-y-6" noValidate>
      {/* Hidden context fields — written by React Hook Form via defaultValues. */}
      <input type="hidden" {...register("useCase")} />
      <input type="hidden" {...register("formType")} />

      {/* Step 1 — home */}
      <section aria-labelledby="step1-heading" className="space-y-4">
        <div>
          <h2 id="step1-heading" className="text-display-sm text-ink-900">
            Tell us about your home
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            Three quick questions. We'll show you a rough borrowing estimate before asking
            anything else.
          </p>
        </div>

        <div>
          <Label htmlFor="zipCode" className="text-ink-900">
            Property ZIP
          </Label>
          <Input
            id="zipCode"
            inputMode="numeric"
            autoComplete="postal-code"
            value={watch("zipCode") || ""}
            onChange={onZipChange}
            aria-invalid={errors.zipCode ? "true" : "false"}
            aria-describedby={errors.zipCode ? "zipCode-error" : "zipCode-help"}
            className="mt-1"
          />
          <p id="zipCode-help" className="text-xs text-ink-500 mt-1">
            {zipLookupPending
              ? "Looking up city and state…"
              : watch("city") && watch("state")
                ? `${watch("city")}, ${watch("state")}`
                : "We'll auto-fill city and state."}
          </p>
          {errors.zipCode && (
            <p id="zipCode-error" className="text-sm text-red-600 mt-1">
              {errors.zipCode.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="homeValue" className="text-ink-900">
            Home value (rough estimate)
          </Label>
          <Input
            id="homeValue"
            inputMode="numeric"
            value={homeValueDisplay}
            onChange={onCurrencyChange(setHomeValueDisplay, "homeValue")}
            placeholder="$425,000"
            aria-invalid={errors.homeValue ? "true" : "false"}
            aria-describedby={errors.homeValue ? "homeValue-error" : "homeValue-help"}
            className="mt-1"
          />
          <p id="homeValue-help" className="text-xs text-ink-500 mt-1">
            Your best guess from Zillow or your last appraisal is fine — we'll firm this up later.
          </p>
          {errors.homeValue && (
            <p id="homeValue-error" className="text-sm text-red-600 mt-1">
              {errors.homeValue.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="mortgageBalance" className="text-ink-900">
            Mortgage balance
          </Label>
          <Input
            id="mortgageBalance"
            inputMode="numeric"
            value={mortgageBalanceDisplay}
            onChange={onCurrencyChange(setMortgageBalanceDisplay, "mortgageBalance")}
            placeholder="$210,000"
            aria-invalid={errors.mortgageBalance ? "true" : "false"}
            aria-describedby={errors.mortgageBalance ? "mortgageBalance-error" : "mortgageBalance-help"}
            className="mt-1"
          />
          <p id="mortgageBalance-help" className="text-xs text-ink-500 mt-1">
            From your most recent statement — round to the nearest thousand.
          </p>
          {errors.mortgageBalance && (
            <p id="mortgageBalance-error" className="text-sm text-red-600 mt-1">
              {errors.mortgageBalance.message}
            </p>
          )}
        </div>

        {!step1Valid && (
          <Button
            type="button"
            onClick={onContinue}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3"
          >
            See how much you can unlock →
          </Button>
        )}
      </section>

      {/* Readout — visible once Step 1 validates */}
      {step1Valid && homeValueNumber > 0 && (
        <EquityReadout homeValue={homeValueNumber} mortgageBalance={mortgageBalanceNumber} />
      )}

      {/* Step 2 — contact (revealed after Step 1 validates) */}
      {step1Valid && (
        <section aria-labelledby="step2-heading" className="space-y-4 pt-2">
          <div>
            <h2 id="step2-heading" className="text-display-sm text-ink-900">
              How should we reach you?
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              A licensed advisor — not a sales rep — will call to walk you through the trade-offs.
              No credit pull.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-ink-900">First name</Label>
              <Input
                id="firstName"
                autoComplete="given-name"
                {...register("firstName")}
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                className="mt-1"
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-sm text-red-600 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-ink-900">Last name</Label>
              <Input
                id="lastName"
                autoComplete="family-name"
                {...register("lastName")}
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                className="mt-1"
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-sm text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-ink-900">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="mt-1"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-ink-900">Phone</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={watch("phone") || ""}
              onChange={onPhoneChange}
              placeholder="(313) 555-0199"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className="mt-1"
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <BestTimeChips
            value={watch("bestTime")}
            onChange={(v) => setValue("bestTime", v, { shouldValidate: true })}
            error={errors.bestTime?.message}
          />

          <HCaptcha
            onVerify={setHcaptchaToken}
            onExpire={() => setHcaptchaToken("")}
            sitekey={hcaptchaSiteKey}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Talk to an advisor
              </>
            )}
          </Button>

          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}

          <p className="text-xs text-ink-500 leading-relaxed">
            No credit pull. We share your info only after you approve a specific lender.
          </p>
        </section>
      )}
    </form>
  )
}
