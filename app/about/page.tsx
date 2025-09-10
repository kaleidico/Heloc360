import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CheckCircle,
	Users,
	Target,
	Shield,
	Heart,
	Award,
	TrendingUp,
	Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllTeamMembers } from "@/lib/contentful";

export const metadata: Metadata = {
	title: "About HELOC360 - Your Trusted Home Equity Partner",
	description:
		"Learn about HELOC360's mission to simplify home equity access. Meet our team of experts dedicated to helping homeowners unlock their home's potential.",
	alternates: {
		canonical: "https://heloc360.com/about",
	},
};

const companyStats = [
	{
		number: "10,000+",
		label: "Homeowners Helped",
		icon: Home,
	},
	{
		number: "$500M+",
		label: "In Home Equity Accessed",
		icon: TrendingUp,
	},
	{
		number: "98%",
		label: "Customer Satisfaction",
		icon: Award,
	},
	{
		number: "50+",
		label: "Vetted Lender Partners",
		icon: Users,
	},
];

export default async function AboutPage() {
	// Fetch team members from Contentful
	const teamMembers = await getAllTeamMembers();

	return (
		<div>
			{/* Hero Section */}
			<section className='relative py-20 bg-gradient-to-r from-[#1b75bc] to-[#02c39a] overflow-hidden'>
				<div className='container mx-auto px-4'>
					<div className='grid lg:grid-cols-2 gap-12 items-center'>
						<div className='text-white'>
							<h1 className='text-4xl md:text-5xl font-bold mb-6'>
								Turning Home Equity Into Opportunity
							</h1>
							<p className='text-xl mb-8 opacity-90 leading-relaxed'>
								At HELOC360, we believe every homeowner should
								have access to their home's equity. We're here
								to simplify the process, provide expert
								guidance, and connect you with the right
								lenders.
							</p>
							<div className='flex flex-col sm:flex-row gap-4'>
								<Button
									size='lg'
									className='bg-white text-[#1b75bc] hover:bg-gray-100'
									asChild
								>
									<Link href='https://ratequote-heloc360.secure-clix.com/'>
										Get Started Today
									</Link>
								</Button>
								<Button
									size='lg'
									variant='outline'
									className='border-white text-white hover:bg-white/10 bg-transparent'
									asChild
								>
									<Link href='/heloc-101'>
										Learn About HELOCs
									</Link>
								</Button>
							</div>
						</div>
						<div className='relative'>
							<Image
								src='/images/nbryw-mr6_w.jpg'
								alt='Happy couple taking a selfie together, representing the joy and satisfaction of achieving financial goals with HELOC360'
								width={600}
								height={400}
								className='rounded-lg shadow-2xl'
								priority
								quality={70}
								sizes='(min-width: 1024px) 50vw, 100vw'
								placeholder='blur'
								blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Company Stats */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto px-4'>
					<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{companyStats.map((stat, index) => (
							<div key={index} className='text-center'>
								<div className='w-16 h-16 bg-[#1b75bc]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
									<stat.icon className='w-8 h-8 text-[#1b75bc]' />
								</div>
								<div className='text-3xl font-bold text-[#1b75bc] mb-2'>
									{stat.number}
								</div>
								<div className='text-gray-600'>
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Our Story */}
			<section className='py-16 bg-gray-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<div className='text-center mb-12'>
							<h2 className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4'>
								Our Story
							</h2>
							<p className='text-lg text-gray-600'>
								Founded on the belief that homeownership should
								unlock opportunities, not create barriers.
							</p>
						</div>

						<div className='grid lg:grid-cols-2 gap-12 items-center'>
							<div>
								<h3 className='text-2xl font-semibold text-[#1b75bc] mb-4'>
									Why We Started HELOC360
								</h3>
								<p className='text-gray-700 mb-6 leading-relaxed'>
									After years of working in traditional
									mortgage lending, our founders saw how
									complicated and intimidating the home equity
									process had become. Homeowners with
									significant equity were struggling to access
									it, often getting lost in complex paperwork
									and confusing terms.
								</p>
								<p className='text-gray-700 mb-6 leading-relaxed'>
									We knew there had to be a better way. That's
									why we created HELOC360 - to be the bridge
									between homeowners and the equity they've
									built, making the process transparent,
									educational, and accessible.
								</p>
								<div className='space-y-3'>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span className='text-gray-700'>
											Founded in 2020 by mortgage industry
											veterans
										</span>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span className='text-gray-700'>
											Helped over 10,000 homeowners access
											their equity
										</span>
									</div>
									<div className='flex items-start gap-3'>
										<CheckCircle className='w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0' />
										<span className='text-gray-700'>
											Partnered with 50+ vetted lenders
											nationwide
										</span>
									</div>
								</div>
							</div>
							<div>
								<Image
									src='/images/2h5yw_eaqga.jpg'
									alt='Happy family enjoying a meal together, representing the warmth and satisfaction of achieving financial goals with HELOC360'
									width={600}
									height={400}
									className='rounded-lg shadow-lg'
									sizes='(min-width: 1024px) 50vw, 100vw'
									loading='lazy'
									quality={70}
									placeholder='blur'
									blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Our Values */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto px-4'>
					<div className='max-w-6xl mx-auto'>
						<div className='text-center mb-12'>
							<h2 className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4'>
								Our Values
							</h2>
							<p className='text-lg text-gray-600'>
								The principles that guide everything we do
							</p>
						</div>

						<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
							<Card className='text-center border-t-4 border-t-[#1b75bc]'>
								<CardHeader>
									<div className='w-12 h-12 bg-[#1b75bc]/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
										<Shield className='w-6 h-6 text-[#1b75bc]' />
									</div>
									<CardTitle className='text-xl'>
										Transparency
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										We believe in clear communication,
										honest advice, and no hidden fees.
										You'll always know exactly what to
										expect.
									</p>
								</CardContent>
							</Card>

							<Card className='text-center border-t-4 border-t-[#02c39a]'>
								<CardHeader>
									<div className='w-12 h-12 bg-[#02c39a]/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
										<Heart className='w-6 h-6 text-[#02c39a]' />
									</div>
									<CardTitle className='text-xl'>
										Customer First
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										Your success is our success. Every
										decision we make is guided by what's
										best for our customers and their
										financial goals.
									</p>
								</CardContent>
							</Card>

							<Card className='text-center border-t-4 border-t-purple-500'>
								<CardHeader>
									<div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
										<Target className='w-6 h-6 text-purple-600' />
									</div>
									<CardTitle className='text-xl'>
										Excellence
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										We're committed to providing exceptional
										service, expert guidance, and the best
										possible outcomes for every customer.
									</p>
								</CardContent>
							</Card>

							<Card className='text-center border-t-4 border-t-orange-500'>
								<CardHeader>
									<div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
										<Users className='w-6 h-6 text-orange-600' />
									</div>
									<CardTitle className='text-xl'>
										Education
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-600'>
										We empower homeowners with knowledge,
										providing the education and tools needed
										to make informed financial decisions.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Meet the Team */}
			<section id='team' className='py-16 bg-gray-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-6xl mx-auto'>
						<div className='text-center mb-12'>
							<h2 className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4'>
								Meet Our Team
							</h2>
							<p className='text-lg text-gray-600'>
								The experts dedicated to helping you unlock your
								home's potential
							</p>
						</div>

						{teamMembers.length > 0 ? (
							<div>
								{/* Leadership & Management */}
								<div className='mb-12'>
									<h3 className='text-2xl font-bold text-[#1b75bc] mb-8 text-center'>
										Leadership & Management
									</h3>
									<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
										{teamMembers
											.filter(
												(member) =>
													member.title
														?.toLowerCase()
														.includes("ceo") ||
													member.title
														?.toLowerCase()
														.includes("founder") ||
													member.title
														?.toLowerCase()
														.includes(
															"content studio director"
														) ||
													member.title
														?.toLowerCase()
														.includes(
															"senior account manager"
														)
											)
											.sort((a, b) => {
												const order = [
													"ceo",
													"founder",
													"content studio director",
													"senior account manager",
												];
												const aIndex = order.findIndex(
													(role) =>
														a.title
															?.toLowerCase()
															.includes(role)
												);
												const bIndex = order.findIndex(
													(role) =>
														b.title
															?.toLowerCase()
															.includes(role)
												);
												return aIndex - bIndex;
											})
											.map((member) => (
												<Link
													key={member.id}
													href={`/meet-our-team/${member.slug}`}
												>
													<Card className='text-center hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col'>
														<CardHeader className='flex-shrink-0'>
															<div className='relative w-32 h-32 mx-auto mb-4'>
																<Image
																	src={
																		member.image ||
																		"/placeholder.svg"
																	}
																	alt={`${
																		member.name
																	} - ${
																		member.title ||
																		"Team Member"
																	}`}
																	fill
																	className='rounded-full object-cover group-hover:scale-105 transition-transform duration-200'
																	sizes='128px'
																	loading='lazy'
																	quality={70}
																/>
															</div>
															<CardTitle className='text-xl text-[#1b75bc] group-hover:text-[#02c39a] transition-colors h-14 flex items-center justify-center'>
																{member.name}
															</CardTitle>
															<p className='text-[#02c39a] font-medium h-6 flex items-center justify-center'>
																{member.title}
															</p>
														</CardHeader>
														<CardContent className='flex-1 flex flex-col justify-between pt-0'>
															<p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4'>
																{member.bio}
															</p>
															<div className='inline-flex items-center text-[#1b75bc] group-hover:text-[#02c39a] transition-colors text-sm font-medium justify-center'>
																<Users className='w-4 h-4 mr-2' />
																Learn More
															</div>
														</CardContent>
													</Card>
												</Link>
											))}
									</div>
								</div>

								{/* Contributors */}
								{teamMembers.filter(
									(member) =>
										!member.title
											?.toLowerCase()
											.includes("ceo") &&
										!member.title
											?.toLowerCase()
											.includes("founder") &&
										!member.title
											?.toLowerCase()
											.includes(
												"content studio director"
											) &&
										!member.title
											?.toLowerCase()
											.includes("senior account manager")
								).length > 0 && (
									<div>
										<h3 className='text-2xl font-bold text-[#1b75bc] mb-8 text-center'>
											Contributors
										</h3>
										<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
											{teamMembers
												.filter(
													(member) =>
														!member.title
															?.toLowerCase()
															.includes("ceo") &&
														!member.title
															?.toLowerCase()
															.includes(
																"founder"
															) &&
														!member.title
															?.toLowerCase()
															.includes(
																"content studio director"
															) &&
														!member.title
															?.toLowerCase()
															.includes(
																"senior account manager"
															)
												)
												.map((member) => (
													<Link
														key={member.id}
														href={`/meet-our-team/${member.slug}`}
													>
														<Card className='text-center hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col'>
															<CardHeader className='flex-shrink-0'>
																<div className='relative w-32 h-32 mx-auto mb-4'>
																	<Image
																		src={
																			member.image ||
																			"/placeholder.svg"
																		}
																		alt={`${
																			member.name
																		} - ${
																			member.title ||
																			"Team Member"
																		}`}
																		fill
																		className='rounded-full object-cover group-hover:scale-105 transition-transform duration-200'
																		sizes='128px'
																		loading='lazy'
																		quality={
																			70
																		}
																	/>
																</div>
																<CardTitle className='text-xl text-[#1b75bc] group-hover:text-[#02c39a] transition-colors h-14 flex items-center justify-center'>
																	{
																		member.name
																	}
																</CardTitle>
																<p className='text-[#02c39a] font-medium h-6 flex items-center justify-center'>
																	{
																		member.title
																	}
																</p>
															</CardHeader>
															<CardContent className='flex-1 flex flex-col justify-between pt-0'>
																<p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4'>
																	{member.bio}
																</p>
																<div className='inline-flex items-center text-[#1b75bc] group-hover:text-[#02c39a] transition-colors text-sm font-medium justify-center'>
																	<Users className='w-4 h-4 mr-2' />
																	Learn More
																</div>
															</CardContent>
														</Card>
													</Link>
												))}
										</div>
									</div>
								)}
							</div>
						) : (
							<div className='text-center py-12'>
								<div className='text-gray-500 mb-4'>
									<Users className='w-16 h-16 mx-auto mb-4 text-gray-300' />
								</div>
								<h3 className='text-xl font-semibold text-gray-900 mb-2'>
									Team information coming soon
								</h3>
								<p className='text-gray-600 mb-6'>
									We're currently setting up our team
									profiles. Check back soon to meet our
									experts.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Our Mission */}
			<section className='py-16 bg-white'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto text-center'>
						<h2 className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-6'>
							Our Mission
						</h2>
						<p className='text-xl text-gray-700 mb-8 leading-relaxed'>
							To democratize access to home equity by providing
							homeowners with the education, tools, and
							connections they need to make informed financial
							decisions and achieve their goals.
						</p>
						<div className='bg-gradient-to-r from-[#1b75bc]/10 to-[#02c39a]/10 p-8 rounded-lg'>
							<h3 className='text-2xl font-semibold text-[#1b75bc] mb-4'>
								What This Means for You
							</h3>
							<div className='grid md:grid-cols-3 gap-6 text-left'>
								<div>
									<h4 className='font-semibold text-gray-900 mb-2'>
										Expert Guidance
									</h4>
									<p className='text-gray-600 text-sm'>
										Our team of mortgage professionals
										provides personalized advice tailored to
										your unique situation.
									</p>
								</div>
								<div>
									<h4 className='font-semibold text-gray-900 mb-2'>
										Vetted Partners
									</h4>
									<p className='text-gray-600 text-sm'>
										We work only with reputable, licensed
										lenders who meet our strict standards
										for service and rates.
									</p>
								</div>
								<div>
									<h4 className='font-semibold text-gray-900 mb-2'>
										No Hidden Costs
									</h4>
									<p className='text-gray-600 text-sm'>
										Our service is completely free to
										homeowners. We're compensated by our
										lender partners, not you.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Awards & Recognition */}
			<section className='py-16 bg-gray-50'>
				<div className='container mx-auto px-4'>
					<div className='max-w-4xl mx-auto'>
						<div className='text-center mb-12'>
							<h2 className='text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4'>
								Awards & Recognition
							</h2>
							<p className='text-lg text-gray-600'>
								Recognized for excellence in customer service
								and innovation
							</p>
						</div>

						<div className='grid md:grid-cols-3 gap-8'>
							<Card className='text-center'>
								<CardHeader>
									<div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Award className='w-8 h-8 text-yellow-600' />
									</div>
									<CardTitle className='text-lg'>
										Best Customer Service
									</CardTitle>
									<p className='text-gray-600'>
										FinTech Awards 2023
									</p>
								</CardHeader>
							</Card>

							<Card className='text-center'>
								<CardHeader>
									<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<TrendingUp className='w-8 h-8 text-blue-600' />
									</div>
									<CardTitle className='text-lg'>
										Fastest Growing
									</CardTitle>
									<p className='text-gray-600'>
										Mortgage Tech 2023
									</p>
								</CardHeader>
							</Card>

							<Card className='text-center'>
								<CardHeader>
									<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
										<Shield className='w-8 h-8 text-green-600' />
									</div>
									<CardTitle className='text-lg'>
										Top Rated Platform
									</CardTitle>
									<p className='text-gray-600'>
										Consumer Choice 2023
									</p>
								</CardHeader>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-16 bg-gradient-to-r from-[#1b75bc] to-[#02c39a]'>
				<div className='container mx-auto px-4'>
					<div className='max-w-3xl mx-auto text-center text-white'>
						<h2 className='text-3xl font-bold mb-4'>
							Ready to Work With Us?
						</h2>
						<p className='text-xl mb-8 opacity-90'>
							Join thousands of homeowners who have successfully
							accessed their home equity with HELOC360's help.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button
								size='lg'
								className='bg-white text-[#1b75bc] hover:bg-gray-100'
								asChild
							>
								<Link href='https://ratequote-heloc360.secure-clix.com/'>
									Get Pre-Qualified
								</Link>
							</Button>
							<Button
								size='lg'
								variant='outline'
								className='border-white text-white hover:bg-white/10 bg-transparent'
								asChild
							>
								<Link href='/contact'>Contact Our Team</Link>
							</Button>
						</div>
						<p className='text-sm mt-4 opacity-80'>
							Free consultation • No obligation • Expert guidance
							every step of the way
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
