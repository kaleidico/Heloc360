import Link from "next/link";
import {
	BookOpen,
	Calculator,
	CircleEqual,
	Info,
	Users,
	Notebook,
} from "lucide-react";
import footerNavData from "@/config/footer-nav.json";
import type { FooterNavigation } from "@/types/navigation";

// Icon mapping
const iconMap = {
	BookOpen,
	Calculator,
	CircleEqual,
	Info,
	Users,
	Notebook,
};

export default function Footer() {
	const footerData: FooterNavigation = footerNavData;

	// Get icon component
	const getIcon = (iconName: string | null) => {
		if (!iconName) return null;
		const IconComponent = iconMap[iconName as keyof typeof iconMap];
		return IconComponent ? <IconComponent className='w-5 h-5' /> : null;
	};

	return (
		<footer className='bg-gray-900 text-white'>
			{/* Main Footer */}
			<div className='bg-[#02c39a] py-12'>
				<div className='container mx-auto px-4'>
					<div className='grid md:grid-cols-3 gap-8'>
						{/* Learn More */}
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								Learn More
							</h3>
							<ul className='space-y-2'>
								{footerData.learnMore.map((item, index) => (
									<li key={index}>
										<Link
											href={item.url}
											className='flex items-center hover:text-white/80 transition-colors'
										>
											{getIcon(item.icon)}
											<span
												className={
													item.icon ? "ml-2" : ""
												}
											>
												{item.label}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Tools */}
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								Tools
							</h3>
							<ul className='space-y-2'>
								{footerData.tools.map((item, index) => (
									<li key={index}>
										<Link
											href={item.url}
											className='flex items-center hover:text-white/80 transition-colors'
										>
											{getIcon(item.icon)}
											<span
												className={
													item.icon ? "ml-2" : ""
												}
											>
												{item.label}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* About Us */}
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								About Us
							</h3>
							<ul className='space-y-2'>
								{footerData.aboutUs.map((item, index) => (
									<li key={index}>
										<Link
											href={item.url}
											className='flex items-center hover:text-white/80 transition-colors'
										>
											{getIcon(item.icon)}
											<span
												className={
													item.icon ? "ml-2" : ""
												}
											>
												{item.label}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Company Info & Legal Section */}
			<div className='bg-gray-800 py-8'>
				<div className='container mx-auto px-4'>
					<div className='grid md:grid-cols-2 gap-8'>
						{/* Company Info */}
						<div>
							<h3 className='text-xl font-bold text-white mb-4'>
								{footerData.companyInfo.callToAction}
							</h3>
							<p className='text-gray-300 text-sm leading-relaxed'>
								{footerData.companyInfo.description}
							</p>
						</div>

						{/* Legal Disclaimer */}
						<div>
							<p className='text-gray-400 text-xs leading-relaxed'>
								{footerData.companyInfo.legalDisclaimer}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Footer */}
			<div className='bg-gray-900 py-6'>
				<div className='container mx-auto px-4'>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<p className='text-sm text-gray-400 mb-4 md:mb-0'>
							© {new Date().getFullYear()} HELOC360. All rights
							reserved.
						</p>
						<div className='flex flex-wrap gap-6 text-sm'>
							{footerData.bottomFooterRow.map((item, index) => (
								<Link
									key={index}
									href={item.url}
									className='text-gray-400 hover:text-white/80 transition-colors'
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
