import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { firstName, email } = body;

		// Validate required fields
		if (!firstName || !email) {
			return NextResponse.json(
				{ error: "First name and email are required" },
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
					firstName: firstName.trim(),
					email: email.trim(),
					submittedAt: new Date().toISOString(),
					source: "homepage-mailing-list",
				}),
			}
		);

		if (!zapierResponse.ok) {
			throw new Error(`Zapier webhook failed: ${zapierResponse.status}`);
		}

		const zapierData = await zapierResponse.json();

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
