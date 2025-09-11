"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	CheckCircle,
	AlertCircle,
	Calculator,
	BookOpen,
	HelpCircle,
} from "lucide-react";
import Link from "next/link";

// Note: Since this is a client component, metadata would need to be handled differently
// In a real app, you'd want to make this a server component or use generateMetadata

const contactReasons = [
	{ value: "heloc-inquiry", label: "HELOC Inquiry" },
	{ value: "rate-information", label: "Rate Information" },
	{ value: "application-status", label: "Application Status" },
	{ value: "technical-support", label: "Technical Support" },
	{ value: "partnership", label: "Partnership Inquiry" },
	{ value: "media-press", label: "Media & Press" },
	{ value: "other", label: "Other" },
];

const contactMethods = [
	{
		icon: Phone,
		title: "Phone Support",
		description: "Speak directly with our HELOC experts",
		contact: "(313) 264-0470",
		hours: "Mon-Fri: 8AM-8PM EST",
		action: "tel:3132640470",
		actionText: "Call Now",
	},
	{
		icon: Mail,
		title: "Email Support",
		description: "Get detailed answers to your questions",
		contact: "help@heloc360.com",
		hours: "Response within 24 hours",
		action: "mailto:help@heloc360.com",
		actionText: "Send Email",
	},
];

const quickLinks = [
	{
		icon: BookOpen,
		title: "HELOC 101 Guide",
		description: "Learn the basics before you contact us",
		link: "/heloc-101",
	},
	{
		icon: Calculator,
		title: "HELOC Calculators",
		description: "Estimate your potential savings",
		link: "/calculators/debt-consolidation",
	},
	{
		icon: HelpCircle,
		title: "Frequently Asked Questions",
		description: "Find quick answers to common questions",
		link: "/heloc-101#faq",
	},
];

export default function ContactPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		reason: "",
		message: "",
		consent: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setSubmitStatus("success");
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				reason: "",
				message: "",
				consent: false,
			});
		} catch (error) {
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormValid =
		formData.firstName &&
		formData.lastName &&
		formData.email &&
		formData.reason &&
		formData.message &&
		formData.consent;

	return (
		<>
			{/* Hero Section */}
			<section className='bg-gradient-to-r from-[#1b75bc] to-[#02c39a] py-16'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto text-center text-white'>
						<h1 className='text-4xl md:text-5xl font-bold mb-6'>
							Contact Our HELOC Experts
						</h1>
						<p className='text-xl mb-8 opacity-90'>
							Ready to unlock your home's equity? Our team is here
							to guide you through every step of the process.
						</p>
						<div className='flex justify-center'>
							<Button
								size='lg'
								className='bg-white text-[#1b75bc] hover:bg-gray-100'
								asChild
							>
								<a href='tel:3132640470'>
									<Phone className='w-5 h-5 mr-2' />
									Call (313) 264-0470
								</a>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Methods */}
			<section className='py-16 bg-gray-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-6xl mx-auto'>
						<div className='text-center mb-12'>
							<h2 className='text-3xl font-bold text-[#1b75bc] mb-4'>
								Get in Touch
							</h2>
							<p className='text-lg text-gray-600'>
								Choose the contact method that works best for
								you
							</p>
						</div>

						<div className='grid md:grid-cols-3 gap-8'>
							{contactMethods.map((method, index) => (
								<Card
									key={index}
									className='text-center hover:shadow-lg transition-shadow'
								>
									<CardHeader>
										<div className='w-16 h-16 bg-[#1b75bc]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
											<method.icon className='w-8 h-8 text-[#1b75bc]' />
										</div>
										<CardTitle className='text-xl text-[#1b75bc]'>
											{method.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className='text-gray-600 mb-4'>
											{method.description}
										</p>
										<div className='space-y-2 mb-6'>
											<p className='font-semibold text-gray-900'>
												{method.contact}
											</p>
											<div className='flex items-center justify-center gap-1 text-sm text-gray-500'>
												<Clock className='w-4 h-4' />
												<span>{method.hours}</span>
											</div>
										</div>
										<Button
											className='w-full bg-[#1b75bc] hover:bg-[#1b75bc]/90'
											asChild
										>
											<a href={method.action}>
												{method.actionText}
											</a>
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<div className='grid lg:grid-cols-2 gap-12'>
							{/* Form */}
							<div>
								<h2 className='text-3xl font-bold text-[#1b75bc] mb-6'>
									Send Us a Message
								</h2>
								<p className='text-gray-600 mb-8'>
									Fill out the form below and we'll get back
									to you within 24 hours. For urgent matters,
									please call us directly.
								</p>

								{submitStatus === "success" && (
									<div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
										<div>
											<h3 className='font-semibold text-green-800'>
												Message Sent Successfully!
											</h3>
											<p className='text-green-700 text-sm'>
												Thank you for contacting us.
												We'll review your message and
												get back to you within 24 hours.
											</p>
										</div>
									</div>
								)}

								{submitStatus === "error" && (
									<div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
										<AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
										<div>
											<h3 className='font-semibold text-red-800'>
												Error Sending Message
											</h3>
											<p className='text-red-700 text-sm'>
												There was an error sending your
												message. Please try again or
												contact us directly.
											</p>
										</div>
									</div>
								)}

								<form
									onSubmit={handleSubmit}
									className='space-y-6'
								>
									{/* Name Fields */}
									<div className='grid sm:grid-cols-2 gap-4'>
										<div>
											<label
												htmlFor='firstName'
												className='block text-sm font-medium text-gray-700 mb-2'
											>
												First Name *
											</label>
											<Input
												id='firstName'
												type='text'
												value={formData.firstName}
												onChange={(e) =>
													handleInputChange(
														"firstName",
														e.target.value
													)
												}
												required
												className='w-full'
											/>
										</div>
										<div>
											<label
												htmlFor='lastName'
												className='block text-sm font-medium text-gray-700 mb-2'
											>
												Last Name *
											</label>
											<Input
												id='lastName'
												type='text'
												value={formData.lastName}
												onChange={(e) =>
													handleInputChange(
														"lastName",
														e.target.value
													)
												}
												required
												className='w-full'
											/>
										</div>
									</div>

									{/* Contact Fields */}
									<div className='grid sm:grid-cols-2 gap-4'>
										<div>
											<label
												htmlFor='email'
												className='block text-sm font-medium text-gray-700 mb-2'
											>
												Email Address *
											</label>
											<Input
												id='email'
												type='email'
												value={formData.email}
												onChange={(e) =>
													handleInputChange(
														"email",
														e.target.value
													)
												}
												required
												className='w-full'
											/>
										</div>
										<div>
											<label
												htmlFor='phone'
												className='block text-sm font-medium text-gray-700 mb-2'
											>
												Phone Number
											</label>
											<Input
												id='phone'
												type='tel'
												value={formData.phone}
												onChange={(e) =>
													handleInputChange(
														"phone",
														e.target.value
													)
												}
												className='w-full'
											/>
										</div>
									</div>

									{/* Reason for Contact */}
									<div>
										<label
											htmlFor='reason'
											className='block text-sm font-medium text-gray-700 mb-2'
										>
											Reason for Contact *
										</label>
										<Select
											value={formData.reason}
											onValueChange={(value) =>
												handleInputChange(
													"reason",
													value
												)
											}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select a reason' />
											</SelectTrigger>
											<SelectContent>
												{contactReasons.map(
													(reason) => (
														<SelectItem
															key={reason.value}
															value={reason.value}
														>
															{reason.label}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>

									{/* Message */}
									<div>
										<label
											htmlFor='message'
											className='block text-sm font-medium text-gray-700 mb-2'
										>
											Message *
										</label>
										<Textarea
											id='message'
											value={formData.message}
											onChange={(e) =>
												handleInputChange(
													"message",
													e.target.value
												)
											}
											rows={5}
											required
											className='w-full'
											placeholder='Please provide details about your inquiry...'
										/>
									</div>

									{/* Consent Checkbox */}
									<div className='flex items-start gap-3'>
										<Checkbox
											id='consent'
											checked={formData.consent}
											onCheckedChange={(checked) =>
												handleInputChange(
													"consent",
													checked as boolean
												)
											}
											className='mt-1'
										/>
										<label
											htmlFor='consent'
											className='text-sm text-gray-700 leading-relaxed'
										>
											I agree to be contacted by HELOC360
											regarding my inquiry. I understand
											that I may receive calls, texts, or
											emails, and I can opt out at any
											time. View our{" "}
											<Link
												href='/privacy'
												className='text-[#1b75bc] hover:text-[#02c39a] underline'
											>
												Privacy Policy
											</Link>{" "}
											and{" "}
											<Link
												href='/communication-consent'
												className='text-[#1b75bc] hover:text-[#02c39a] underline'
											>
												Communication Consent
											</Link>
											. *
										</label>
									</div>

									{/* Submit Button */}
									<Button
										type='submit'
										size='lg'
										className='w-full bg-[#1b75bc] hover:bg-[#1b75bc]/90'
										disabled={!isFormValid || isSubmitting}
									>
										{isSubmitting
											? "Sending Message..."
											: "Send Message"}
									</Button>
								</form>
							</div>

							{/* Sidebar */}
							<div className='space-y-8'>
								{/* Office Information */}
								<Card>
									<CardHeader>
										<CardTitle className='text-xl text-[#1b75bc] flex items-center gap-2'>
											<MapPin className='w-5 h-5' />
											Office Information
										</CardTitle>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div>
											<h4 className='font-semibold text-gray-900 mb-1'>
												Mailing Address
											</h4>
											<p className='text-gray-600 text-sm'>
												My Perfect Leads, LLC
												<br />
												1121 Annapolis RD #218
												<br />
												Odenton, MD 21113
											</p>
										</div>
										{/* REMOVE START */}
										{/* REMOVE END */}
									</CardContent>
								</Card>

								{/* Quick Links */}
								<Card>
									<CardHeader>
										<CardTitle className='text-xl text-[#1b75bc]'>
											Before You Contact Us
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className='text-gray-600 text-sm mb-4'>
											You might find the answer to your
											question in these helpful resources:
										</p>
										<div className='space-y-3'>
											{quickLinks.map((link, index) => (
												<Link
													key={index}
													href={link.link}
													className='flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#1b75bc] hover:shadow-sm transition-all group'
												>
													<div className='w-8 h-8 bg-[#1b75bc]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1b75bc]/20 transition-colors'>
														<link.icon className='w-4 h-4 text-[#1b75bc]' />
													</div>
													<div>
														<h4 className='font-medium text-gray-900 group-hover:text-[#1b75bc] text-sm'>
															{link.title}
														</h4>
														<p className='text-xs text-gray-600'>
															{link.description}
														</p>
													</div>
												</Link>
											))}
										</div>
									</CardContent>
								</Card>

								{/* Emergency Contact */}
								<Card className='bg-yellow-50 border-yellow-200'>
									<CardContent className='pt-6'>
										<div className='flex items-start gap-3'>
											<AlertCircle className='w-5 h-5 text-yellow-600 mt-1 flex-shrink-0' />
											<div>
												<h4 className='font-semibold text-yellow-800 mb-2'>
													Urgent Matters
												</h4>
												<p className='text-yellow-700 text-sm mb-3'>
													For time-sensitive issues
													related to your loan
													application or closing,
													please call us directly
													rather than using this form.
												</p>
												<Button
													size='sm'
													className='bg-yellow-600 hover:bg-yellow-700 text-white'
													asChild
												>
													<a href='tel:3132640470'>
														<Phone className='w-4 h-4 mr-2' />
														Call Now
													</a>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-16 bg-gradient-to-r from-[#1b75bc] to-[#02c39a]'>
				<div className='container mx-auto px-4'>
					<div className='max-w-3xl mx-auto text-center text-white'>
						<h2 className='text-3xl font-bold mb-4'>
							Ready to Get Started?
						</h2>
						<p className='text-xl mb-8 opacity-90'>
							Don't wait to unlock your home's potential. Get
							pre-qualified today and see what options are
							available to you.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button
								size='lg'
								className='bg-white text-[#1b75bc] hover:bg-gray-100'
								asChild
							>
								<Link href='https://get-started.heloc360.com/'>
									Get Pre-Qualified Now
								</Link>
							</Button>
							<Button
								size='lg'
								variant='outline'
								className='border-white text-white hover:bg-white/10 bg-transparent'
								asChild
							>
								<Link href='/heloc-101'>
									Learn More About HELOCs
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
