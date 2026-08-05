import Link from "next/link";
import { Database } from "lucide-react";

import { cn } from "@/lib/utils";
import { DATA_VINTAGE } from "@/lib/hmda/data";

/**
 * The provenance line. Every page that renders an HMDA-derived number carries
 * one of these (PDR section 3.4), so a reader never has to guess which filing
 * year they are looking at. The vintage itself lives in a single constant.
 */
export default function DataStamp({
	className,
	withMethodologyLink = true,
}: {
	className?: string;
	withMethodologyLink?: boolean;
}) {
	return (
		<p
			className={cn(
				"flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500",
				className,
			)}
		>
			<Database className="h-4 w-4 shrink-0" aria-hidden="true" />
			<span>
				Source: <span className="font-medium text-ink-700">{DATA_VINTAGE}</span>
			</span>
			{withMethodologyLink && (
				<Link
					href="/methodology"
					className="font-medium text-brand-blue underline underline-offset-2 hover:text-brand-blue-dark"
				>
					How we built this
				</Link>
			)}
		</p>
	);
}
