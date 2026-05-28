// Single source of truth for the advisor-call SLA copy.
// Spec §7: "A HELOC360 advisor will call you in [X hours]." — pulled from
// config so we can change it without redeploying any component.

export const SLA_HOURS: number = 2

export function slaCopy(): string {
  return `A HELOC360 advisor will call you within ${SLA_HOURS} hour${SLA_HOURS === 1 ? "" : "s"}.`
}
