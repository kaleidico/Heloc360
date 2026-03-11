import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
	title: "Contact HELOC360 - Get Help with Your Home Equity Line of Credit",
	description:
		"Reach out to HELOC360 for personalized guidance on home equity lines of credit. Our team helps you understand your options and find the right HELOC solution.",
	alternates: {
		canonical: "https://heloc360.com/contact",
	},
	openGraph: {
		title: "Contact HELOC360 - Get Help with Your Home Equity Line of Credit",
		description:
			"Reach out to HELOC360 for personalized guidance on home equity lines of credit. Our team helps you understand your options and find the right HELOC solution.",
		url: "https://heloc360.com/contact",
		siteName: "HELOC360",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact HELOC360 - Get Help with Your Home Equity Line of Credit",
		description:
			"Reach out to HELOC360 for personalized guidance on home equity lines of credit. Our team helps you understand your options and find the right HELOC solution.",
	},
};

export default function ContactPage() {
	return <ContactForm />;
}
