// Zod schema for the 2-step / 5-question pre-qual form.
// Spec §7: 5 user-facing fields (zip, home value, mortgage balance, name,
// email, phone+best-time) plus URL-inferred use case + silent UTM context.
// Spec §8: borrower type, employment, income range, credit range, DTI
// are NOT asked; loan officer collects on the first call.

import { z } from "zod"
import { USE_CASES } from "./use-case"

export const BEST_TIME_OPTIONS = ["Mornings", "Afternoons", "Evenings", "Anytime"] as const
export type BestTime = (typeof BEST_TIME_OPTIONS)[number]

// Step 1 — "Tell us about your home".
// homeValue / mortgageBalance arrive as currency-masked strings ("$425,000")
// and are coerced to numbers via parseCurrency before persistence.
export const Step1Schema = z.object({
  zipCode: z
    .string()
    .min(5, "ZIP code must be at least 5 digits")
    .max(10, "ZIP code must be 10 digits or less"),
  city: z.string().optional(),
  state: z.string().optional(),
  homeValue: z
    .number({ invalid_type_error: "Enter your home's estimated value" })
    .int()
    .positive("Enter your home's estimated value"),
  mortgageBalance: z
    .number({ invalid_type_error: "Enter your current mortgage balance" })
    .int()
    .nonnegative("Mortgage balance cannot be negative"),
})

// Step 2 — "How should we reach you?"
export const Step2Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),
  bestTime: z.enum(BEST_TIME_OPTIONS),
})

// Hidden context fields populated by the form host (not user-visible).
export const ContextSchema = z.object({
  useCase: z.enum(USE_CASES),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  referral: z.string().optional(),
})

// The wire shape posted to /api/submit-prequal.
export const PreQualSubmissionSchema = Step1Schema.merge(Step2Schema)
  .merge(ContextSchema)
  .extend({
    hcaptchaToken: z.string().optional(),
    formType: z.literal("pre-qual-v1"),
  })

export type PreQualSubmission = z.infer<typeof PreQualSubmissionSchema>
export type Step1Values = z.infer<typeof Step1Schema>
export type Step2Values = z.infer<typeof Step2Schema>
export type ContextValues = z.infer<typeof ContextSchema>
