import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CheckCircle,
	AlertTriangle,
	Calculator,
	TrendingUp,
	Home,
	DollarSign,
	Clock,
	Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FAQ from "@/components/ui/faq";
import type { Metadata } from "next";
import type { FAQItem } from "@/components/ui/faq";

export const metadata: Metadata = {
	title: "HELOC 101: Complete Guide to Home Equity Lines of Credit",
	description:
		"Learn everything about HELOCs - how they work, benefits, risks, qualification requirements, and whether a Home Equity Line of Credit is right for you.",
	alternates: {
		canonical: "https://heloc360.com/heloc-101",
	},
};

const heloc101FAQs: FAQItem[] = [
	{
		question:
			"What's the difference between a HELOC and a home equity loan?",
		answer: "A HELOC is a revolving line of credit that works like a credit card, allowing you to borrow and repay repeatedly during the draw period. A home equity loan gives you a lump sum upfront with fixed monthly payments.",
	},
	{
		question: "How much can I borrow with a HELOC?",
		answer: "Most lenders allow you to borrow up to 80-85% of your home's value minus what you owe on your mortgage. The exact amount depends on your credit score, income, and debt-to-income ratio.",
	},
	{
		question: "What are typical HELOC interest rates?",
		answer: "HELOC rates are typically variable and tied to the prime rate. They're usually lower than credit cards but higher than first mortgages. Rates can change monthly based on market conditions.",
	},
	{
		question: "Can I pay off my HELOC early?",
		answer: "Yes, you can pay off your HELOC early without prepayment penalties from most lenders. Paying early can save you significant interest costs over time.",
	},
	{
		question: "What happens if I can't make my HELOC payments?",
		answer: "Since your home secures the HELOC, failing to make payments could result in foreclosure. It's important to have a repayment plan and only borrow what you can afford to repay.",
	},
	{
		question: "Are HELOC interest payments tax deductible?",
		answer: "HELOC interest may be tax deductible if you use the funds to buy, build, or substantially improve your home. Consult with a tax professional for your specific situation.",
	},
];

export default function HELOC101Page() {
	return (
		<>
			{/* Hero Section */}
			<section className='bg-gradient-to-r from-[#1b75bc] to-[#02c39a] py-16'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto text-center text-white'>
						<h1 className='text-4xl md:text-5xl font-bold mb-6'>
							HELOC 101: Your Complete Guide to Home Equity Lines
							of Credit
						</h1>
						<p className='text-xl mb-8 opacity-90'>
							Everything you need to know about HELOCs - from
							basics to advanced strategies. Make informed
							decisions about accessing your home's equity.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button
								size='lg'
								className='bg-white text-[#1b75bc] hover:bg-gray-100'
							>
								Get Pre-Qualified
							</Button>
							<Button
								size='lg'
								variant='outline'
								className='border-white text-white hover:bg-white/10 bg-transparent'
							>
								Use Our Calculator
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Table of Contents */}
			<section className='py-12 bg-gray-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-2xl font-bold text-[#1b75bc] mb-6 text-center'>
							What You'll Learn
						</h2>
						<div className='grid md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<a
									href='#what-is-heloc'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									What is a HELOC?
								</a>
								<a
									href='#how-helocs-work'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									How HELOCs Work
								</a>
								<a
									href='#benefits'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									Benefits of HELOCs
								</a>
								<a
									href='#risks'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									Risks to Consider
								</a>
							</div>
							<div className='space-y-2'>
								<a
									href='#qualification'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									Qualification Requirements
								</a>
								<a
									href='#uses'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									Common Uses for HELOCs
								</a>
								<a
									href='#alternatives'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									HELOC Alternatives
								</a>
								<a
									href='#getting-started'
									className='flex items-center text-gray-700 hover:text-[#1b75bc] transition-colors'
								>
									<CheckCircle className='w-4 h-4 mr-2 text-[#02c39a]' />
									Getting Started
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* What is a HELOC */}
			<section id='what-is-heloc' className='py-16 bg-white'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-3xl font-bold text-[#1b75bc] mb-8'>
							What is a HELOC?
						</h2>
						<div className='grid lg:grid-cols-2 gap-12 items-center mb-12'>
							<div>
								<p className='text-lg text-gray-700 mb-6 leading-relaxed'>
									A Home Equity Line of Credit (HELOC) is a
									revolving credit line that uses your home's
									equity as collateral. Think of it as a
									credit card secured by your home - you can
									borrow, repay, and borrow again up to your
									credit limit.
								</p>
								<div className='bg-blue-50 p-6 rounded-lg'>
									<h3 className='font-semibold text-[#1b75bc] mb-3'>
										Key Features:
									</h3>
									<ul className='space-y-2'>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-5 h-5 text-[#02c39a] mt-0.5 flex-shrink-0' />
											<span className='text-gray-700'>
												Revolving credit line (borrow as
												needed)
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-5 h-5 text-[#02c39a] mt-0.5 flex-shrink-0' />
											<span className='text-gray-700'>
												Variable interest rates
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-5 h-5 text-[#02c39a] mt-0.5 flex-shrink-0' />
											<span className='text-gray-700'>
												Interest-only payments during
												draw period
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-5 h-5 text-[#02c39a] mt-0.5 flex-shrink-0' />
											<span className='text-gray-700'>
												Your home serves as collateral
											</span>
										</li>
									</ul>
								</div>
							</div>
							<div>
								<Image
									src='/images/sygvwxiqnki.jpg'
									alt='Happy people taking a selfie together, representing the joy and satisfaction of achieving financial goals with HELOC'
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
				</div>
			</section>

			{/* How HELOCs Work */}
			<section id='how-helocs-work' className='py-16 bg-gray-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-3xl font-bold text-[#1b75bc] mb-8'>
							How HELOCs Work
						</h2>
						<div className='grid md:grid-cols-2 gap-8 mb-12'>
							<Card>
								<CardHeader>
									<div className='w-12 h-12 bg-[#1b75bc]/10 rounded-lg flex items-center justify-center mb-4'>
										<TrendingUp className='w-6 h-6 text-[#1b75bc]' />
									</div>
									<CardTitle className='text-xl'>
										Draw Period (Usually 10 Years)
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className='space-y-3'>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0' />
											<span className='text-gray-700'>
												Access funds as needed up to
												your credit limit
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0' />
											<span className='text-gray-700'>
												Make interest-only payments on
												amount borrowed
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0' />
											<span className='text-gray-700'>
												Repay and re-borrow as needed
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className='w-12 h-12 bg-[#02c39a]/10 rounded-lg flex items-center justify-center mb-4'>
										<DollarSign className='w-6 h-6 text-[#02c39a]' />
									</div>
									<CardTitle className='text-xl'>
										Repayment Period (Usually 20 Years)
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className='space-y-3'>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0' />
											<span className='text-gray-700'>
												No longer able to borrow from
												the line
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0' />
											<span className='text-gray-700'>
												Make principal and interest
												payments
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<CheckCircle className='w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0' />
											<span className='text-gray-700'>
												Payments typically higher than
												draw period
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>
						</div>

						<div className='bg-white p-8 rounded-lg shadow-sm'>
							<h3 className='text-xl font-semibold text-[#1b75bc] mb-4'>
								HELOC Credit Limit Calculation
							</h3>
							<p className='text-gray-700 mb-4'>
								Your HELOC credit limit is typically calculated
								as:
							</p>
							<div className='bg-blue-50 p-6 rounded-lg text-center'>
								<p className='text-lg font-semibold text-[#1b75bc]'>
									(Home Value × 80-85%) - Existing Mortgage
									Balance = Available Credit
								</p>
							</div>
							<p className='text-sm text-gray-600 mt-4'>
								*Actual credit limit depends on your
								creditworthiness, income, and lender
								requirements.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section id='benefits' className='py-16 bg-white'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-3xl font-bold text-[#1b75bc] mb-8'>
							Benefits of HELOCs
						</h2>
						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
							<Card className='border-l-4 border-l-[#02c39a]'>
								<CardHeader>
									<div className='w-10 h-10 bg-[#02c39a]/10 rounded-lg flex items-center justify-center mb-2'>
										<TrendingUp className='w-5 h-5 text-[#02c39a]' />
									</div>
									<CardTitle className='text-lg'>
										Lower Interest Rates
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										HELOCs typically offer lower interest
										rates than credit cards or personal
										loans because your home secures the
										debt.
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-[#1b75bc]'>
								<CardHeader>
									<div className='w-10 h-10 bg-[#1b75bc]/10 rounded-lg flex items-center justify-center mb-2'>
										<Clock className='w-5 h-5 text-[#1b75bc]' />
									</div>
									<CardTitle className='text-lg'>
										Flexible Access
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										Borrow only what you need, when you need
										it. Pay interest only on the amount you
										actually use.
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-purple-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2'>
										<DollarSign className='w-5 h-5 text-purple-600' />
									</div>
									<CardTitle className='text-lg'>
										Potential Tax Benefits
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										Interest may be tax-deductible if used
										for home improvements (consult your tax
										advisor).
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-teal-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-2'>
										<Home className='w-5 h-5 text-teal-600' />
									</div>
									<CardTitle className='text-lg'>
										Large Credit Limits
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										Access significant amounts of money
										based on your home's equity - often much
										more than unsecured loans.
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-orange-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2'>
										<Calculator className='w-5 h-5 text-orange-600' />
									</div>
									<CardTitle className='text-lg'>
										Interest-Only Payments
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										During the draw period, you can make
										interest-only payments, keeping monthly
										costs lower.
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-green-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2'>
										<Shield className='w-5 h-5 text-green-600' />
									</div>
									<CardTitle className='text-lg'>
										No Prepayment Penalties
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										Most HELOCs allow you to pay off the
										balance early without penalties, saving
										on interest costs.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Risks */}
			<section id='risks' className='py-16 bg-red-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-3xl font-bold text-[#1b75bc] mb-8'>
							Risks to Consider
						</h2>
						<div className='grid md:grid-cols-2 gap-8'>
							<Card className='border-l-4 border-l-red-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-2'>
										<AlertTriangle className='w-5 h-5 text-red-600' />
									</div>
									<CardTitle className='text-lg text-red-700'>
										Your Home is at Risk
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700'>
										Since your home secures the HELOC, you
										could lose it if you can't make
										payments. Only borrow what you can
										afford to repay.
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-orange-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2'>
										<TrendingUp className='w-5 h-5 text-orange-600' />
									</div>
									<CardTitle className='text-lg text-orange-700'>
										Variable Interest Rates
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700'>
										HELOC rates can increase over time,
										making your payments higher. Budget for
										potential rate increases.
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-yellow-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2'>
										<Clock className='w-5 h-5 text-yellow-600' />
									</div>
									<CardTitle className='text-lg text-yellow-700'>
										Payment Shock
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700'>
										When the draw period ends, payments can
										increase significantly as you begin
										paying principal and interest.
									</p>
								</CardContent>
							</Card>

							<Card className='border-l-4 border-l-purple-500'>
								<CardHeader>
									<div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2'>
										<Home className='w-5 h-5 text-purple-600' />
									</div>
									<CardTitle className='text-lg text-purple-700'>
										Reduced Home Equity
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-700'>
										Using your HELOC reduces your home
										equity, which could limit future
										borrowing options or affect your net
										worth.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Common Uses */}
			<section id='uses' className='py-16 bg-white'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-3xl font-bold text-[#1b75bc] mb-8'>
							Common Uses for HELOCs
						</h2>
						<div className='grid md:grid-cols-2 gap-8'>
							<div>
								<h3 className='text-xl font-semibold text-[#1b75bc] mb-4'>
									Smart Uses
								</h3>
								<div className='space-y-4'>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Home Improvements
											</h4>
											<p className='text-gray-600 text-sm'>
												Renovations that increase your
												home's value, like kitchen
												remodels or additions.
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Debt Consolidation
											</h4>
											<p className='text-gray-600 text-sm'>
												Pay off high-interest credit
												cards or other debts with lower
												HELOC rates.
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Education Expenses
											</h4>
											<p className='text-gray-600 text-sm'>
												Fund college tuition or other
												educational investments for you
												or your family.
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Emergency Fund
											</h4>
											<p className='text-gray-600 text-sm'>
												Keep as a backup for unexpected
												major expenses (use sparingly).
											</p>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h3 className='text-xl font-semibold text-red-600 mb-4'>
									Uses to Avoid
								</h3>
								<div className='space-y-4'>
									<div className='flex items-start gap-3'>
										<AlertTriangle className='w-5 h-5 text-red-500 mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Vacations or Luxury Items
											</h4>
											<p className='text-gray-600 text-sm'>
												Don't risk your home for
												discretionary spending that
												doesn't build wealth.
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<AlertTriangle className='w-5 h-5 text-red-500 mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Daily Living Expenses
											</h4>
											<p className='text-gray-600 text-sm'>
												Using a HELOC for regular bills
												indicates a budget problem that
												needs addressing.
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<AlertTriangle className='w-5 h-5 text-red-500 mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Risky Investments
											</h4>
											<p className='text-gray-600 text-sm'>
												Don't gamble with your home
												equity on speculative
												investments.
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<AlertTriangle className='w-5 h-5 text-red-500 mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold text-gray-900'>
												Business Ventures (High Risk)
											</h4>
											<p className='text-gray-600 text-sm'>
												Only use for business if you
												have a solid plan and can afford
												to lose the money.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Qualification Requirements */}
			<section id='qualification' className='py-16 bg-gray-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<h2 className='text-3xl font-bold text-[#1b75bc] mb-8'>
							HELOC Qualification Requirements
						</h2>
						<div className='grid md:grid-cols-2 gap-8'>
							<Card>
								<CardHeader>
									<CardTitle className='text-xl text-[#1b75bc]'>
										Typical Requirements
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold'>
												Credit Score: 680+
											</h4>
											<p className='text-gray-600 text-sm'>
												Higher scores get better rates
												and terms
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold'>
												Home Equity: 15-20%+
											</h4>
											<p className='text-gray-600 text-sm'>
												Most lenders want you to keep
												15-20% equity
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold'>
												Debt-to-Income: Under 43%
											</h4>
											<p className='text-gray-600 text-sm'>
												Including the new HELOC payment
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<div>
											<h4 className='font-semibold'>
												Stable Income
											</h4>
											<p className='text-gray-600 text-sm'>
												Proof of consistent employment
												or income
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className='text-xl text-[#1b75bc]'>
										Required Documentation
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span>
											Recent pay stubs or tax returns
										</span>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span>Bank statements</span>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span>Property tax records</span>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span>
											Homeowners insurance information
										</span>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span>Current mortgage statement</span>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span>
											Home appraisal (arranged by lender)
										</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<FAQ
				title='HELOC 101 FAQ'
				subtitle='Get answers to the most common questions about Home Equity Lines of Credit'
				items={heloc101FAQs}
				className='bg-white'
				showContactCTA={true}
				contactCTAText='Need personalized HELOC guidance?'
				contactCTALink='/contact'
			/>

			{/* CTA Section */}
			<section className='py-16 bg-gradient-to-r from-[#1b75bc] to-[#02c39a]'>
				<div className='container mx-auto px-4'>
					<div className='max-w-3xl mx-auto text-center text-white'>
						<h2 className='text-3xl font-bold mb-4'>
							Ready to Explore Your HELOC Options?
						</h2>
						<p className='text-xl mb-8 opacity-90'>
							Now that you understand HELOCs, let's help you find
							the right lender and terms for your situation.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button
								size='lg'
								className='bg-white text-[#1b75bc] hover:bg-gray-100'
							>
								Get Pre-Qualified Now
							</Button>
							<Button
								size='lg'
								variant='outline'
								className='border-white text-white hover:bg-white/10 bg-transparent'
								asChild
							>
								<Link href='/calculators/home-equity-estimator'>
									Calculate Your Equity
								</Link>
							</Button>
						</div>
						<p className='text-sm mt-4 opacity-80'>
							Free consultation • No obligation • Won't affect
							your credit score
						</p>
					</div>
				</div>
			</section>
		</>
	);
}
