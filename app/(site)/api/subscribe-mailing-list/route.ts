import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/email/notify";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { firstName, email, source } = body;

		// Email is the only required field. The footer signup is email-only on
		// purpose: asking for a name on a newsletter box costs conversions, and
		// the homepage form still sends one when it has it.
		if (!email) {
			return NextResponse.json(
				{ error: "Please enter your email address" },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 }
			);
		}

		// Submit to Zapier webhook
		const zapierResponse = await fetch(
			"https://hooks.zapier.com/hooks/catch/5667151/udcymlg/",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: typeof firstName === "string" ? firstName.trim() : "",
					email: email.trim(),
					submittedAt: new Date().toISOString(),
					source:
						typeof source === "string" && source
							? `${source}-mailing-list`
							: "homepage-mailing-list",
				}),
			}
		);

		if (!zapierResponse.ok) {
			throw new Error(`Zapier webhook failed: ${zapierResponse.status}`);
		}

		const zapierData = await zapierResponse.json();

		// Notify the team (additive, best-effort — never throws).
		await sendLeadNotification({
			formName: "Mailing List Signup",
			fields: {
				firstName: typeof firstName === "string" ? firstName.trim() : "",
				email: email.trim(),
				source: typeof source === "string" && source ? source : "homepage",
			},
			subjectHint: email.trim(),
			replyTo: email.trim(),
		});

		return NextResponse.json({
			success: true,
			message: "Successfully subscribed to mailing list",
			zapierResponse: zapierData,
		});
	} catch (error) {
		console.error("Mailing list subscription error:", error);

		return NextResponse.json(
			{
				error: "Failed to subscribe to mailing list",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
