import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Home, Users, Shield, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HomeFAQ from "@/components/home-faq";
import MailingListForm from "@/components/mailing-list-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home Equity Line of Credit Services - HELOC360",
	description:
		"Turn your home's value into opportunities that work for you. Get pre-qualified for a HELOC with vetted lenders. Expert guidance, simplified process, free & confidential.",
	alternates: {
		canonical: "https://heloc360.com",
	},
};

export default function HomePage() {
	return (
		<>
			{/* Hero Section */}
			<section className='relative min-h-[600px] flex items-center justify-center overflow-hidden'>
				<div className='absolute inset-0 z-0'>
					<Image
						src='/images/optimized/home-hero.webp'
						alt='Beautiful suburban neighborhood home with stone exterior and well-maintained landscaping'
						fill
						className='object-cover'
						priority
						sizes='100vw'
						placeholder='blur'
						blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
					/>
					<div className='absolute inset-0 bg-black/50' />
				</div>

				<div className='relative z-10 container mx-auto px-4 text-center text-white'>
					<h1 className='text-4xl md:text-6xl font-bold mb-6 leading-tight'>
						Turn Your Home's Value Into
						<br />
						Opportunities That Work for You
					</h1>
					<p className='text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed'>
						Welcome to HELOC360—your trusted partner in turning home
						equity into opportunity. Whether it's funding a major
						renovation, consolidating debt, or creating financial
						flexibility, we make it easier to achieve your goals.
					</p>
					<Button
						size='lg'
						className='bg-[#02c39a] hover:bg-[#00a896] text-white px-8 py-3 text-lg rounded-lg'
						aria-label='Get pre-qualified for a HELOC - Free and confidential'
						asChild
					>
						<Link href='https://ratequote-heloc360.secure-clix.com/'>
							Get Pre-Qualified
						</Link>
					</Button>
					<p className='text-sm mt-4 opacity-90'>
						At HELOC360, we simplify the process, empower you with
						knowledge, and connect you with lenders tailored to meet
						your unique needs. Your home has the potential to open
						doors—let us show you how.
					</p>
				</div>
			</section>

			{/* What is HELOC360 Section */}
			<section
				className='py-16 bg-gray-50'
				aria-labelledby='what-is-heloc360'
			>
				<div className='container mx-auto px-4'>
					<div className='grid lg:grid-cols-2 gap-12 items-center'>
						<div>
							<h2
								id='what-is-heloc360'
								className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-6'
							>
								What is HELOC360?
							</h2>
							<p className='text-lg text-gray-700 mb-6 leading-relaxed'>
								HELOC360 is more than a matching service—it's
								your guide to making smart financial choices.
								Specializing in Home Equity Lines of Credit, we
								help homeowners access the funds they need to
								achieve their goals while providing resources
								and personalized lender matches.
							</p>
							<ul className='space-y-4' role='list'>
								<li className='flex items-start gap-3'>
									<CheckCircle
										className='w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0'
										aria-hidden='true'
									/>
									<p className='text-gray-700'>
										Expert guidance through the entire HELOC
										process
									</p>
								</li>
								<li className='flex items-start gap-3'>
									<CheckCircle
										className='w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0'
										aria-hidden='true'
									/>
									<p className='text-gray-700'>
										Personalized matches with vetted lenders
									</p>
								</li>
								<li className='flex items-start gap-3'>
									<CheckCircle
										className='w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0'
										aria-hidden='true'
									/>
									<p className='text-gray-700'>
										Educational resources and tools to make
										informed decisions
									</p>
								</li>
							</ul>
						</div>
						<div className='relative'>
							<Image
								src='/images/optimized/home-what-is-a-heloc360.webp'
								alt='Classic Victorian home with wraparound porch representing established homeownership and built equity'
								width={600}
								height={400}
								className='rounded-lg shadow-lg'
								sizes='(max-width: 768px) 100vw, 50vw'
								placeholder='blur'
								blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Our Process Section */}
			<section className='py-16 bg-white' aria-labelledby='our-process'>
				<div className='container mx-auto px-4'>
					<div className='text-center mb-12'>
						<h2
							id='our-process'
							className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4'
						>
							Our Process
						</h2>
						<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
							We've simplified the HELOC process into three easy
							steps to help you unlock your home's potential.
						</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8' role='list'>
						<Card
							className='text-center border-2 border-[#1b75bc]/20 hover:border-[#1b75bc]/20 transition-colors'
							role='listitem'
						>
							<CardHeader>
								<div className='w-16 h-16 bg-[#1b75bc]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
									<span
										className='text-2xl font-bold text-[#1b75bc]'
										aria-label='Step 1'
									>
										1
									</span>
								</div>
								<CardTitle className='text-xl text-[#1b75bc]'>
									Explore Resources
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600'>
									Learn about HELOCs through our comprehensive
									guides, calculators, and educational content
									to understand if it's right for you.
								</p>
							</CardContent>
						</Card>

						<Card
							className='text-center border-2 border-[#1b75bc]/20 hover:border-[#1b75bc]/20 transition-colors'
							role='listitem'
						>
							<CardHeader>
								<div className='w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
									<span
										className='text-2xl font-bold text-[#02c39a]'
										aria-label='Step 2'
									>
										2
									</span>
								</div>
								<CardTitle className='text-xl text-[#1b75bc]'>
									Share Your Needs
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600'>
									Tell us about your financial goals and
									situation through our simple
									pre-qualification form. It's quick, secure,
									and confidential.
								</p>
							</CardContent>
						</Card>

						<Card
							className='text-center border-2 border-[#1b75bc]/20 hover:border-[#1b75bc]/20 transition-colors'
							role='listitem'
						>
							<CardHeader>
								<div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<span
										className='text-2xl font-bold text-teal-600'
										aria-label='Step 3'
									>
										3
									</span>
								</div>
								<CardTitle className='text-xl text-[#1b75bc]'>
									Get Connected
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600'>
									We'll match you with vetted lenders who
									specialize in your situation and can offer
									competitive rates and terms.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Why Choose HELOC360 Section */}
			<section
				className='py-16 bg-blue-50'
				aria-labelledby='why-choose-heloc360'
			>
				<div className='container mx-auto px-4'>
					<div className='text-center mb-12'>
						<h2
							id='why-choose-heloc360'
							className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4'
						>
							Why Choose HELOC360?
						</h2>
						<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
							We're committed to making your HELOC journey as
							smooth and successful as possible.
						</p>
					</div>

					<div
						className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'
						role='list'
					>
						<div className='text-center' role='listitem'>
							<div className='w-16 h-16 bg-[#1b75bc]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Home
									className='w-8 h-8 text-[#1b75bc]'
									aria-hidden='true'
								/>
							</div>
							<h3 className='text-xl font-semibold text-[#1b75bc] mb-3'>
								Tailored Solutions
							</h3>
							<p className='text-gray-600'>
								Every homeowner's situation is unique. We
								provide personalized recommendations based on
								your specific needs.
							</p>
						</div>

						<div className='text-center' role='listitem'>
							<div className='w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Users
									className='w-8 h-8 text-[#02c39a]'
									aria-hidden='true'
								/>
							</div>
							<h3 className='text-xl font-semibold text-[#1b75bc] mb-3'>
								Vetted Lenders
							</h3>
							<p className='text-gray-600'>
								We work only with reputable, licensed lenders
								who have proven track records of excellent
								service.
							</p>
						</div>

						<div className='text-center' role='listitem'>
							<div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Clock
									className='w-8 h-8 text-teal-600'
									aria-hidden='true'
								/>
							</div>
							<h3 className='text-xl font-semibold text-[#1b75bc] mb-3'>
								Simplified Process
							</h3>
							<p className='text-gray-600'>
								We've streamlined the traditionally complex
								HELOC process to save you time and reduce
								stress.
							</p>
						</div>

						<div className='text-center' role='listitem'>
							<div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Shield
									className='w-8 h-8 text-purple-600'
									aria-hidden='true'
								/>
							</div>
							<h3 className='text-xl font-semibold text-[#1b75bc] mb-3'>
								Free & Confidential
							</h3>
							<p className='text-gray-600'>
								Our service is completely free to use, and we
								protect your personal information with
								bank-level security.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits of HELOCs Section */}
			<section
				className='py-16 bg-white'
				aria-labelledby='benefits-of-helocs'
			>
				<div className='container mx-auto px-4'>
					<div className='grid lg:grid-cols-2 gap-12 items-center'>
						<div>
							<h2
								id='benefits-of-helocs'
								className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-6'
							>
								Benefits of HELOCs
							</h2>
							<p className='text-lg text-gray-700 mb-8'>
								A Home Equity Line of Credit can be a powerful
								financial tool when used wisely. Here are some
								common ways homeowners leverage their equity:
							</p>

							<div
								className='grid sm:grid-cols-2 gap-6'
								role='list'
							>
								<div
									className='flex items-start gap-3'
									role='listitem'
								>
									<div className='w-8 h-8 bg-[#1b75bc]/10 rounded-full flex items-center justify-center flex-shrink-0'>
										<Home
											className='w-4 h-4 text-[#1b75bc]'
											aria-hidden='true'
										/>
									</div>
									<div>
										<h4 className='font-semibold text-gray-900 mb-1'>
											Home Improvements
										</h4>
										<p className='text-sm text-gray-600'>
											Renovations that increase your
											home's value
										</p>
									</div>
								</div>

								<div
									className='flex items-start gap-3'
									role='listitem'
								>
									<div className='w-8 h-8 bg-[#02c39a]/10 rounded-full flex items-center justify-center flex-shrink-0'>
										<CheckCircle
											className='w-4 h-4 text-[#02c39a]'
											aria-hidden='true'
										/>
									</div>
									<div>
										<h4 className='font-semibold text-gray-900 mb-1'>
											Debt Consolidation
										</h4>
										<p className='text-sm text-gray-600'>
											Combine high-interest debts into one
											lower payment
										</p>
									</div>
								</div>

								<div
									className='flex items-start gap-3'
									role='listitem'
								>
									<div className='w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
										<Shield
											className='w-4 h-4 text-teal-600'
											aria-hidden='true'
										/>
									</div>
									<div>
										<h4 className='font-semibold text-gray-900 mb-1'>
											Emergency Fund
										</h4>
										<p className='text-sm text-gray-600'>
											Access to funds when unexpected
											expenses arise
										</p>
									</div>
								</div>

								<div
									className='flex items-start gap-3'
									role='listitem'
								>
									<div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
										<Users
											className='w-4 h-4 text-purple-600'
											aria-hidden='true'
										/>
									</div>
									<div>
										<h4 className='font-semibold text-gray-900 mb-1'>
											Education Costs
										</h4>
										<p className='text-sm text-gray-600'>
											Fund college tuition or other
											educational expenses
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='relative'>
							<Image
								src='/placeholder.svg?height=400&width=600'
								alt='Family planning their finances and discussing home equity options'
								width={600}
								height={400}
								className='rounded-lg shadow-lg'
								sizes='(max-width: 768px) 100vw, 50vw'
							/>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<HomeFAQ />

			{/* Lead Capture Section */}
			<section
				className='py-16 bg-gradient-to-r from-[#1b75bc] to-teal-600'
				aria-labelledby='get-started'
			>
				<div className='container mx-auto px-4'>
					<div className='max-w-2xl mx-auto text-center text-white'>
						<h2
							id='get-started'
							className='text-3xl md:text-4xl font-bold mb-4'
						>
							Ready to Unlock Your Home's Potential?
						</h2>
						<p className='text-lg mb-8 opacity-90'>
							Get started with a free, no-obligation
							pre-qualification. It takes just a few minutes and
							won't affect your credit score.
						</p>

						<Card className='bg-white/10 backdrop-blur border-white/20'>
							<CardHeader>
								<CardTitle className='text-white'>
									Stay Connected with HELOC360
								</CardTitle>
								<CardDescription className='text-white/80'>
									Get the latest HELOC tips, market updates,
									and success stories delivered to your inbox.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<MailingListForm />
								<p className='text-xs text-white/70'>
									By submitting this form, you agree to our{" "}
									<a
										href='/terms'
										className='underline hover:no-underline'
									>
										Terms of Service
									</a>{" "}
									and{" "}
									<a
										href='/privacy'
										className='underline hover:no-underline'
									>
										Privacy Policy
									</a>
									. We'll never share your information with
									third parties.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</>
	);
}
