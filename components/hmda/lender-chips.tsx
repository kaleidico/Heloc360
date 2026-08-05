import { cn } from "@/lib/utils";
import { formatLenderType } from "@/lib/hmda/format";
import type { LenderType } from "@/types/hmda";

const TYPE_STYLES: Record<string, string> = {
	bank: "bg-blue-50 text-brand-blue-dark ring-blue-200",
	nonbank: "bg-violet-50 text-violet-700 ring-violet-200",
	credit_union: "bg-emerald-50 text-brand-green ring-emerald-200",
	unknown: "bg-surface-100 text-ink-500 ring-surface-200",
};

export function LenderTypeChip({
	type,
	className,
}: {
	type: LenderType;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
				TYPE_STYLES[type] ?? TYPE_STYLES.unknown,
				className,
			)}
		>
			{formatLenderType(type)}
		</span>
	);
}

/**
 * Renders only when membership is actually required. A null value means the
 * lender type could not be resolved from the filing, so membership is unknown
 * and the chip stays off rather than asserting either way.
 */
export function MembershipChip({
	membershipRequired,
	className,
}: {
	membershipRequired: boolean | null;
	className?: string;
}) {
	if (membershipRequired !== true) return null;
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200",
				className,
			)}
			title="You must be eligible to join before you can borrow"
		>
			Membership required
		</span>
	);
}
