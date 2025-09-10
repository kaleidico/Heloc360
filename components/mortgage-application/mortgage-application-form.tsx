"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import HCaptcha from "@/components/ui/hcaptcha";
import {
	getMergedTrackingData,
	updateTrackingWithIp,
	initializeTracking,
} from "@/lib/tracking";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	MapPin,
	User,
	FileText,
	Home,
	DollarSign,
	CreditCard,
	Shield,
	MessageSquare,
	UserCheck,
} from "lucide-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

// Form schema with all required fields
const formSchema = z.object({
	zipCode: z
		.string()
		.min(5, "Zip code must be at least 5 digits")
		.max(10, "Zip code must be 10 digits or less"),
	propertyAddress: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	borrowerType: z.enum([
		"Individual Homeowner (or Homebuyer)",
		"Self-Employed",
		"Real Estate Investor (US Resident)",
		"Real Estate Investor (non-US Resident)",
		"Broker",
		"Other",
	]),
	mortgageType: z.enum(["Purchase", "Refinance", "Cash Out"]),
	timeline: z.string().min(1, "Please select a timeline"),
	propertyType: z.enum([
		"Single Family Residence",
		"Condo",
		"Townhouse",
		"Multi-Family (2-4 units)",
		"Multi-Family (5+ units)",
		"Commercial",
		"Land",
		"Other",
	]),
	occupancy: z.enum(["Yes (Owner Occupied)", "No (Non-Owner Occupied)"]),
	propertyValue: z.string().min(1, "Property value is required"),
	downPayment: z.string().optional(),
	loanAmount: z.string().optional(),
	loanPosition: z.enum([
		"1st (only mortgage)",
		"2nd (home-equity)",
		"3rd",
		"Other",
		"I'm not sure",
	]),
	creditScore: z.enum([
		"Excellent: 720+",
		"Good: 680-719",
		"Fair: 620-679",
		"Poor: Below 620",
		"I'm not sure",
	]),
	militaryService: z.enum(["Yes", "No"]),
	bankruptcy: z.enum(["Yes", "No"]),
	additionalInfo: z.string().optional(),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Please enter a valid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	contactPreference: z.enum(["Text", "Phone", "Email"]),
	hcaptchaToken: z.string().optional(),
	userAgent: z.string().optional(),
	ipAddress: z.string().optional(),
	referral: z.string().optional(),
	utmSource: z.string().optional(),
	utmMedium: z.string().optional(),
	utmCampaign: z.string().optional(),
	utmTerm: z.string().optional(),
	utmContent: z.string().optional(),
	gclid: z.string().optional(),
	fbclid: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LocationData {
	city: string;
	state: string;
}

const stepIcons = [
	<MapPin key='location' className='w-5 h-5' />,
	<User key='borrower' className='w-5 h-5' />,
	<FileText key='loan' className='w-5 h-5' />,
	<Home key='property' className='w-5 h-5' />,
	<DollarSign key='financial' className='w-5 h-5' />,
	<CreditCard key='position' className='w-5 h-5' />,
	<Shield key='credit' className='w-5 h-5' />,
	<MessageSquare key='additional' className='w-5 h-5' />,
	<UserCheck key='contact' className='w-5 h-5' />,
];

const stepTitles = [
	"Property Location",
	"Borrower Type",
	"Loan Details",
	"Property Information",
	"Financial Information",
	"Loan Position",
	"Credit & History",
	"Additional Information",
	"Contact Information",
];

export default function MortgageApplicationForm() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hcaptchaToken, setHcaptchaToken] = useState("");
	const [locationData, setLocationData] = useState<LocationData | null>(null);
	const [mapQuery, setMapQuery] = useState<string | null>(null);
	const [address, setAddress] = useState<any>(null);
	const router = useRouter();
	const { toast } = useToast();

	const totalSteps = 9;

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		trigger,
	} = form;
	const watchedValues = watch();

	// Get fields for current step
	const getFieldsForStep = (step: number): (keyof FormData)[] => {
		switch (step) {
			case 1:
				return ["zipCode", "propertyAddress"];
			case 2:
				return ["borrowerType"];
			case 3:
				return ["mortgageType", "timeline"];
			case 4:
				return ["propertyType", "occupancy"];
			case 5:
				return ["propertyValue", "downPayment", "loanAmount"];
			case 6:
				return ["loanPosition"];
			case 7:
				return ["creditScore", "militaryService", "bankruptcy"];
			case 8:
				return ["additionalInfo"];
			case 9:
				return [
					"firstName",
					"lastName",
					"email",
					"phone",
					"contactPreference",
				];
			default:
				return [];
		}
	};

	// Validate current step before proceeding
	const validateCurrentStep = async () => {
		const fieldsToValidate = getFieldsForStep(currentStep);
		const result = await trigger(fieldsToValidate);
		return result;
	};

	// Navigate to next step
	const nextStep = async () => {
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
		}
	};

	// Navigate to previous step
	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	// Zip code lookup function
	const lookupZipCode = async (zipCode: string) => {
		if (zipCode.length >= 5) {
			try {
				const response = await fetch(
					`https://api.zippopotam.us/US/${zipCode}`
				);
				if (response.ok) {
					const data = await response.json();
					if (data.places && data.places.length > 0) {
						const city = data.places[0]["place name"];
						const state = data.places[0]["state abbreviation"];
						setLocationData({ city, state });
						setValue("city", city);
						setValue("state", state);
					} else {
						if (process.env.NODE_ENV !== "production") {
							console.log(
								"No location data found for zip code:",
								zipCode
							);
						}
						setLocationData(null);
						setValue("city", "");
						setValue("state", "");
					}
				} else {
					if (process.env.NODE_ENV !== "production") {
						console.log(
							"Zip code lookup failed with status:",
							response.status
						);
					}
					setLocationData(null);
					setValue("city", "");
					setValue("state", "");
				}
			} catch (error) {
				if (process.env.NODE_ENV !== "production") {
					console.log("Zip code lookup failed:", error);
				}
				setLocationData(null);
				setValue("city", "");
				setValue("state", "");
			}
		}
	};

	// Phone number formatting
	const formatPhoneNumber = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 3) return numbers;
		if (numbers.length <= 6)
			return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
		return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
			6,
			10
		)}`;
	};

	// Currency formatting
	const formatCurrency = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers === "") return "";
		const num = parseInt(numbers, 10);
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(num);
	};

	// Handle zip code change
	const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 10);
		setValue("zipCode", value);
		if (value.length >= 5) {
			lookupZipCode(value);
		} else {
			setLocationData(null);
			setValue("city", "");
			setValue("state", "");
		}
	};

	// Handle phone number change
	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const formatted = formatPhoneNumber(value);
		setValue("phone", formatted);
	};

	// Handle currency input changes
	const handleCurrencyChange =
		(field: "propertyValue" | "downPayment" | "loanAmount") =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			const formatted = formatCurrency(value);
			setValue(field, formatted);
		};

	// Update map query when address changes
	useEffect(() => {
		// Use the selected address from GooglePlacesAutocomplete
		const selectedAddress = address?.value?.description;
		if (selectedAddress && locationData) {
			const fullAddress = `${selectedAddress}, ${locationData.city}, ${locationData.state}`;
			setMapQuery(fullAddress);
			setValue("propertyAddress", selectedAddress); // Update react-hook-form state
		} else {
			setMapQuery(null);
			setValue("propertyAddress", ""); // Clear react-hook-form state
		}
	}, [address, locationData, setValue]); // Depend on 'address' state

	// Get tracking data using utility
	const getTrackingData = () => {
		return getMergedTrackingData();
	};

	// Get IP address using utility
	const getIpAddress = async () => {
		await updateTrackingWithIp();
		const trackingData = getMergedTrackingData();
		return trackingData.ipAddress || "";
	};

	// Form submission
	const onSubmit = async (data: FormData) => {
		if (process.env.NODE_ENV !== "development" && !hcaptchaToken) {
			toast({
				title: "Security verification required",
				description: "Please complete the security verification",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Get tracking data
			const trackingData = getTrackingData();
			const ipAddress = await getIpAddress();

			// Organize submission data: form fields first, then tracking, then technical data
			const submissionData = {
				// Form fields (primary data)
				...data,
				hcaptchaToken,

				// Tracking data (UTMs, gclid, fbclid)
				...trackingData,

				// Technical data (IP, browser, referral)
				userAgent: navigator.userAgent,
				ipAddress,

				// Metadata
				submittedAt: new Date().toISOString(),
				source: "mortgage-application-form",
			};

			if (process.env.NODE_ENV !== "production") {
				console.log("Submitting data:", submissionData);
			}

			// Use server-side proxy to submit to webhook (bypasses CORS issues)
			if (process.env.NODE_ENV !== "production") {
				console.log("Submitting via server-side proxy...");
			}

			const response = await fetch("/api/submit-mortgage", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submissionData),
			});

			if (process.env.NODE_ENV !== "production") {
				console.log("Proxy response status:", response.status);
			}

			if (response.ok) {
				const responseData = await response.json();
				if (process.env.NODE_ENV !== "production") {
					console.log("Proxy response data:", responseData);
				}
				router.push("https://ratequote-heloc360.secure-clix.com/");
			} else {
				const errorData = await response.json();
				console.error("Proxy error:", errorData);
				throw new Error(errorData.message || "Submission failed");
			}
		} catch (error) {
			console.error("Submission error:", error);

			// More specific error messages
			let errorMessage =
				"There was an error submitting your application. Please try again.";

			if (
				error instanceof TypeError &&
				error.message.includes("Failed to fetch")
			) {
				errorMessage =
					"Unable to connect to the server. Please check your internet connection and try again.";
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			toast({
				title: "Submission failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Initialize tracking data on component mount
	useEffect(() => {
		initializeTracking();
	}, []);

	return (
		<div className='max-w-2xl mx-auto'>
			{/* Modern Progress Indicator */}
			<div className='mb-12'>
				{/* Step Pills */}
				<div className='flex items-center justify-center space-x-2 mb-8'>
					{[...Array(totalSteps)].map((_, index) => (
						<div
							key={index}
							className={`transition-all duration-300 ${
								index + 1 === currentStep
									? "w-12 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
									: index + 1 < currentStep
									? "w-8 h-2 bg-blue-400 rounded-full"
									: "w-8 h-2 bg-gray-300 rounded-full"
							}`}
						/>
					))}
				</div>

				{/* Step Info */}
				<div className='text-center'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl text-xl font-bold shadow-lg mb-4'>
						{currentStep}
					</div>
					<h3 className='text-2xl font-bold text-gray-900 mb-2'>
						{stepTitles[currentStep - 1]}
					</h3>
					<p className='text-sm text-gray-500'>
						Step {currentStep} of {totalSteps} •{" "}
						{Math.round((currentStep / totalSteps) * 100)}% Complete
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
				{/* Step 1: Property Location */}
				{currentStep === 1 && (
					<div className='space-y-8'>
						<div className='relative'>
							<div className='absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-2xl'></div>
							<div className='relative'>
								<p className='text-gray-600 text-lg'>
									Let's start with finding your dream property
									location.
								</p>
							</div>
						</div>

						<div className='space-y-8'>
							<div>
								<Label
									htmlFor='zipCode'
									className='text-base font-semibold text-gray-800 mb-3 block'
								>
									Property Zip Code *
								</Label>
								{/* LastPass dummy field */}
								<input
									type='text'
									tabIndex={-1}
									autoComplete='off'
									readOnly
									className='hidden'
								/>
								<Input
									id='zipCode'
									{...register("zipCode")}
									onChange={handleZipCodeChange}
									placeholder='Enter zip code'
									autoComplete='off'
									className={`h-14 text-lg px-4 border-2 rounded-xl transition-all duration-200 ${
										errors.zipCode
											? "border-red-300 focus:border-red-500 focus:ring-red-200"
											: "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
									}`}
								/>
								{errors.zipCode && (
									<p className='text-sm text-red-500 mt-3 flex items-center'>
										<span className='w-1 h-1 bg-red-500 rounded-full mr-2'></span>
										{errors.zipCode.message}
									</p>
								)}
								{locationData && (
									<div className='mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl'>
										<p className='text-sm text-green-800 flex items-center font-medium'>
											<MapPin className='w-4 h-4 mr-2 text-green-600' />
											<strong>Location:</strong>{" "}
											{locationData.city},{" "}
											{locationData.state}
										</p>
									</div>
								)}
							</div>

							<div>
								<Label
									htmlFor='propertyAddress'
									className='text-base font-semibold text-gray-800 mb-3 block'
								>
									Property Address
								</Label>
								<GooglePlacesAutocomplete
									apiKey={
										process.env
											.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
									}
									selectProps={{
										value: address,
										onChange: setAddress,
										placeholder: "Enter property address",
										styles: {
											input: (provided) => ({
												...provided,
												height: "3.5rem",
												padding: "0 1rem",
												borderRadius: "0.75rem",
												borderWidth: "2px",
												borderColor: "#e5e7eb",
											}),
											option: (provided, state) => ({
												...provided,
												backgroundColor: state.isFocused
													? "#f3f4f6"
													: "#ffffff",
												padding: "0.75rem 1rem",
											}),
										},
									}}
								/>
							</div>
						</div>

						{mapQuery && (
							<div className='mt-8'>
								<Label className='text-base font-semibold text-gray-800 mb-3 block'>
									Location Preview
								</Label>
								<div className='overflow-hidden rounded-2xl border-2 border-gray-200 shadow-sm'>
									<iframe
										width='100%'
										height='300'
										style={{ border: 0 }}
										loading='lazy'
										allowFullScreen
										src={`https://www.google.com/maps/embed/v1/place?key=${
											process.env
												.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
										}&q=${encodeURIComponent(mapQuery)}`}
									></iframe>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Step 2: Borrower Type */}
				{currentStep === 2 && (
					<div className='space-y-8'>
						<div className='relative'>
							<div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl'></div>
							<div className='relative'>
								<p className='text-gray-600 text-lg'>
									Tell us a bit about yourself so we can find
									the best loan options for you.
								</p>
							</div>
						</div>

						<RadioGroup
							value={watchedValues.borrowerType}
							onValueChange={(value) =>
								setValue("borrowerType", value as any)
							}
							className='space-y-4'
						>
							{[
								"Individual Homeowner (or Homebuyer)",
								"Self-Employed",
								"Real Estate Investor (US Resident)",
								"Real Estate Investor (non-US Resident)",
								"Broker",
								"Other",
							].map((type) => (
								<div key={type} className='relative'>
									<RadioGroupItem
										value={type}
										id={type}
										className='sr-only'
									/>
									<Label
										htmlFor={type}
										className={`flex items-center p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer group ${
											watchedValues.borrowerType === type
												? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md"
												: "border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm"
										}`}
									>
										<div
											className={`flex items-center justify-center w-6 h-6 border-2 rounded-full mr-4 transition-all duration-200 ${
												watchedValues.borrowerType ===
												type
													? "border-blue-500 bg-blue-500 shadow-sm"
													: "border-gray-300 group-hover:border-blue-400"
											}`}
										>
											<div
												className={`w-3 h-3 bg-white rounded-full transition-all duration-200 ${
													watchedValues.borrowerType ===
													type
														? "opacity-100 scale-100"
														: "opacity-0 scale-75"
												}`}
											/>
										</div>
										<span className='text-base font-medium text-gray-800'>
											{type}
										</span>
									</Label>
								</div>
							))}
						</RadioGroup>
					</div>
				)}

				{/* Step 3: Loan Details */}
				{currentStep === 3 && (
					<div className='space-y-6'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
								<FileText className='w-6 h-6 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>
								Loan Details
							</h2>
							<p className='text-gray-600 max-w-md mx-auto'>
								Tell us about your loan requirements.
							</p>
						</div>

						<div className='space-y-6'>
							<div>
								<Label className='text-sm font-medium text-gray-700 mb-3 block'>
									Mortgage Type
								</Label>
								<RadioGroup
									value={watchedValues.mortgageType}
									onValueChange={(value) =>
										setValue("mortgageType", value as any)
									}
									className='space-y-3'
								>
									{["Purchase", "Refinance", "Cash Out"].map(
										(type) => (
											<div
												key={type}
												className='relative'
											>
												<RadioGroupItem
													value={type}
													id={type}
													className='sr-only'
												/>
												<Label
													htmlFor={type}
													className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
														watchedValues.mortgageType ===
														type
															? "border-blue-500 bg-blue-50"
															: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
													}`}
												>
													<div
														className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
															watchedValues.mortgageType ===
															type
																? "border-blue-500 bg-blue-500"
																: "border-gray-300 group-hover:border-blue-400"
														}`}
													>
														<div
															className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
																watchedValues.mortgageType ===
																type
																	? "opacity-100"
																	: "opacity-0"
															}`}
														/>
													</div>
													<span className='text-sm font-medium text-gray-700'>
														{type}
													</span>
												</Label>
											</div>
										)
									)}
								</RadioGroup>
							</div>

							<div>
								<Label
									htmlFor='timeline'
									className='text-sm font-medium text-gray-700 mb-2 block'
								>
									Timeline for Purchase
								</Label>
								<select
									id='timeline'
									{...register("timeline")}
									className='w-full h-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
								>
									<option value=''>Select timeline</option>
									<option value='Buy in 30 days'>
										Buy in 30 days
									</option>
									<option value='Buy in 60 days'>
										Buy in 60 days
									</option>
									<option value='Buy in 90 days'>
										Buy in 90 days
									</option>
									<option value='Buy in 6 months'>
										Buy in 6 months
									</option>
									<option value='Buy in 12 months'>
										Buy in 12 months
									</option>
									<option value='Just exploring options'>
										Just exploring options
									</option>
								</select>
								{errors.timeline && (
									<p className='text-sm text-red-500 mt-2'>
										{errors.timeline.message}
									</p>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Step 4: Property Information */}
				{currentStep === 4 && (
					<div className='space-y-6'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
								<Home className='w-6 h-6 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>
								Property Information
							</h2>
							<p className='text-gray-600 max-w-md mx-auto'>
								Tell us about the property.
							</p>
						</div>

						<div className='space-y-6'>
							<div>
								<Label className='text-sm font-medium text-gray-700 mb-3 block'>
									Property Type
								</Label>
								<RadioGroup
									value={watchedValues.propertyType}
									onValueChange={(value) =>
										setValue("propertyType", value as any)
									}
									className='space-y-3'
								>
									{[
										"Single Family Residence",
										"Condo",
										"Townhouse",
										"Multi-Family (2-4 units)",
										"Multi-Family (5+ units)",
										"Commercial",
										"Land",
										"Other",
									].map((type) => (
										<div key={type} className='relative'>
											<RadioGroupItem
												value={type}
												id={type}
												className='sr-only'
											/>
											<Label
												htmlFor={type}
												className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
													watchedValues.propertyType ===
													type
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
												}`}
											>
												<div
													className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
														watchedValues.propertyType ===
														type
															? "border-blue-500 bg-blue-500"
															: "border-gray-300 group-hover:border-blue-400"
													}`}
												>
													<div
														className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
															watchedValues.propertyType ===
															type
																? "opacity-100"
																: "opacity-0"
														}`}
													/>
												</div>
												<span className='text-sm font-medium text-gray-700'>
													{type}
												</span>
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div>
								<Label className='text-sm font-medium text-gray-700 mb-3 block'>
									Occupancy Status
								</Label>
								<RadioGroup
									value={watchedValues.occupancy}
									onValueChange={(value) =>
										setValue("occupancy", value as any)
									}
									className='space-y-3'
								>
									{[
										"Yes (Owner Occupied)",
										"No (Non-Owner Occupied)",
									].map((status) => (
										<div key={status} className='relative'>
											<RadioGroupItem
												value={status}
												id={status}
												className='sr-only'
											/>
											<Label
												htmlFor={status}
												className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
													watchedValues.occupancy ===
													status
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
												}`}
											>
												<div
													className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
														watchedValues.occupancy ===
														status
															? "border-blue-500 bg-blue-500"
															: "border-gray-300 group-hover:border-blue-400"
													}`}
												>
													<div
														className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
															watchedValues.occupancy ===
															status
																? "opacity-100"
																: "opacity-0"
														}`}
													/>
												</div>
												<span className='text-sm font-medium text-gray-700'>
													{status}
												</span>
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>
						</div>
					</div>
				)}

				{/* Step 5: Financial Information */}
				{currentStep === 5 && (
					<div className='space-y-6'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
								<DollarSign className='w-6 h-6 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>
								Financial Information
							</h2>
							<p className='text-gray-600 max-w-md mx-auto'>
								Tell us about the financial details.
							</p>
						</div>

						<div className='space-y-6'>
							<div>
								<Label
									htmlFor='propertyValue'
									className='text-sm font-medium text-gray-700 mb-2 block'
								>
									Property Value *
								</Label>
								<Input
									id='propertyValue'
									value={watchedValues.propertyValue || ""}
									onChange={handleCurrencyChange(
										"propertyValue"
									)}
									placeholder='$250,000'
									autoComplete='off'
									className={`h-12 ${
										errors.propertyValue
											? "border-red-500 focus:border-red-500 focus:ring-red-500"
											: "focus:border-blue-500 focus:ring-blue-500"
									}`}
								/>
								{errors.propertyValue && (
									<p className='text-sm text-red-500 mt-2'>
										{errors.propertyValue.message}
									</p>
								)}
							</div>

							{watchedValues.mortgageType === "Purchase" && (
								<div>
									<Label
										htmlFor='downPayment'
										className='text-sm font-medium text-gray-700 mb-2 block'
									>
										Down Payment
									</Label>
									<Input
										id='downPayment'
										value={watchedValues.downPayment || ""}
										onChange={handleCurrencyChange(
											"downPayment"
										)}
										placeholder='$50,000'
										autoComplete='off'
										className='h-12 focus:border-blue-500 focus:ring-blue-500'
									/>
								</div>
							)}

							{(watchedValues.mortgageType === "Refinance" ||
								watchedValues.mortgageType === "Cash Out") && (
								<div>
									<Label
										htmlFor='loanAmount'
										className='text-sm font-medium text-gray-700 mb-2 block'
									>
										Loan Amount
									</Label>
									<Input
										id='loanAmount'
										value={watchedValues.loanAmount || ""}
										onChange={handleCurrencyChange(
											"loanAmount"
										)}
										placeholder='$200,000'
										autoComplete='off'
										className='h-12 focus:border-blue-500 focus:ring-blue-500'
									/>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Step 6: Loan Position */}
				{currentStep === 6 && (
					<div className='space-y-6'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
								<CreditCard className='w-6 h-6 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>
								Loan Position
							</h2>
							<p className='text-gray-600 max-w-md mx-auto'>
								What position will this loan be in?
							</p>
						</div>

						<RadioGroup
							value={watchedValues.loanPosition}
							onValueChange={(value) =>
								setValue("loanPosition", value as any)
							}
							className='space-y-3'
						>
							{[
								"1st (only mortgage)",
								"2nd (home-equity)",
								"3rd",
								"Other",
								"I'm not sure",
							].map((position) => (
								<div key={position} className='relative'>
									<RadioGroupItem
										value={position}
										id={position}
										className='sr-only'
									/>
									<Label
										htmlFor={position}
										className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
											watchedValues.loanPosition ===
											position
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
										}`}
									>
										<div
											className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
												watchedValues.loanPosition ===
												position
													? "border-blue-500 bg-blue-500"
													: "border-gray-300 group-hover:border-blue-400"
											}`}
										>
											<div
												className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
													watchedValues.loanPosition ===
													position
														? "opacity-100"
														: "opacity-0"
												}`}
											/>
										</div>
										<span className='text-sm font-medium text-gray-700'>
											{position}
										</span>
									</Label>
								</div>
							))}
						</RadioGroup>
					</div>
				)}

				{/* Step 7: Credit & History */}
				{currentStep === 7 && (
					<div className='space-y-6'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
								<Shield className='w-6 h-6 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>
								Credit & History
							</h2>
							<p className='text-gray-600 max-w-md mx-auto'>
								Tell us about your credit and history.
							</p>
						</div>

						<div className='space-y-6'>
							<div>
								<Label className='text-sm font-medium text-gray-700 mb-3 block'>
									Estimated Credit Score
								</Label>
								<RadioGroup
									value={watchedValues.creditScore}
									onValueChange={(value) =>
										setValue("creditScore", value as any)
									}
									className='space-y-3'
								>
									{[
										"Excellent: 720+",
										"Good: 680-719",
										"Fair: 620-679",
										"Poor: Below 620",
										"I'm not sure",
									].map((score) => (
										<div key={score} className='relative'>
											<RadioGroupItem
												value={score}
												id={score}
												className='sr-only'
											/>
											<Label
												htmlFor={score}
												className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
													watchedValues.creditScore ===
													score
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
												}`}
											>
												<div
													className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
														watchedValues.creditScore ===
														score
															? "border-blue-500 bg-blue-500"
															: "border-gray-300 group-hover:border-blue-400"
													}`}
												>
													<div
														className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
															watchedValues.creditScore ===
															score
																? "opacity-100"
																: "opacity-0"
														}`}
													/>
												</div>
												<span className='text-sm font-medium text-gray-700'>
													{score}
												</span>
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div>
								<Label className='text-sm font-medium text-gray-700 mb-3 block'>
									Military Service (for VA loan eligibility)
								</Label>
								<RadioGroup
									value={watchedValues.militaryService}
									onValueChange={(value) =>
										setValue(
											"militaryService",
											value as any
										)
									}
									className='space-y-3'
								>
									{["Yes", "No"].map((service) => (
										<div key={service} className='relative'>
											<RadioGroupItem
												value={service}
												id={service}
												className='sr-only'
											/>
											<Label
												htmlFor={service}
												className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
													watchedValues.militaryService ===
													service
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
												}`}
											>
												<div
													className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
														watchedValues.militaryService ===
														service
															? "border-blue-500 bg-blue-500"
															: "border-gray-300 group-hover:border-blue-400"
													}`}
												>
													<div
														className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
															watchedValues.militaryService ===
															service
																? "opacity-100"
																: "opacity-0"
														}`}
													/>
												</div>
												<span className='text-sm font-medium text-gray-700'>
													{service}
												</span>
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div>
								<Label className='text-sm font-medium text-gray-700 mb-3 block'>
									Bankruptcy/Foreclosure History
								</Label>
								<RadioGroup
									value={watchedValues.bankruptcy}
									onValueChange={(value) =>
										setValue("bankruptcy", value as any)
									}
									className='space-y-3'
								>
									{["Yes", "No"].map((history) => (
										<div key={history} className='relative'>
											<RadioGroupItem
												value={history}
												id={`bankruptcy-${history}`}
												className='sr-only'
											/>
											<Label
												htmlFor={`bankruptcy-${history}`}
												className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
													watchedValues.bankruptcy ===
													history
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
												}`}
											>
												<div
													className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
														watchedValues.bankruptcy ===
														history
															? "border-blue-500 bg-blue-500"
															: "border-gray-300 group-hover:border-blue-400"
													}`}
												>
													<div
														className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
															watchedValues.bankruptcy ===
															history
																? "opacity-100"
																: "opacity-0"
														}`}
													/>
												</div>
												<span className='text-sm font-medium text-gray-700'>
													{history}
												</span>
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>
						</div>
					</div>
				)}

				{/* Step 8: Additional Information */}
				{currentStep === 8 && (
					<div className='space-y-6'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
								<MessageSquare className='w-6 h-6 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>
								Additional Information
							</h2>
							<p className='text-gray-600 max-w-md mx-auto'>
								Any additional details you'd like to share?
							</p>
						</div>

						<div>
							<Label
								htmlFor='additionalInfo'
								className='text-sm font-medium text-gray-700 mb-2 block'
							>
								Additional Information (Optional)
							</Label>
							<Textarea
								id='additionalInfo'
								{...register("additionalInfo")}
								placeholder='Tell us anything else that might be relevant to your application...'
								rows={4}
								autoComplete='off'
								className='focus:border-blue-500 focus:ring-blue-500'
							/>
						</div>
					</div>
				)}

				{/* Step 9: Contact Information */}
				{currentStep === 9 && (
					<div className='space-y-6'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4'>
								<UserCheck className='w-6 h-6 text-blue-600' />
							</div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>
								Contact Information
							</h2>
							<p className='text-gray-600 max-w-md mx-auto'>
								Finally, let's get your contact details.
							</p>
						</div>

						<div className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<Label
										htmlFor='firstName'
										className='text-sm font-medium text-gray-700 mb-2 block'
									>
										First Name *
									</Label>
									<Input
										id='firstName'
										{...register("firstName")}
										placeholder='John'
										autoComplete='given-name'
										className={`h-12 ${
											errors.firstName
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "focus:border-blue-500 focus:ring-blue-500"
										}`}
									/>
									{errors.firstName && (
										<p className='text-sm text-red-500 mt-2'>
											{errors.firstName.message}
										</p>
									)}
								</div>

								<div>
									<Label
										htmlFor='lastName'
										className='text-sm font-medium text-gray-700 mb-2 block'
									>
										Last Name *
									</Label>
									<Input
										id='lastName'
										{...register("lastName")}
										placeholder='Doe'
										autoComplete='family-name'
										className={`h-12 ${
											errors.lastName
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "focus:border-blue-500 focus:ring-blue-500"
										}`}
									/>
									{errors.lastName && (
										<p className='text-sm text-red-500 mt-2'>
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<Label
									htmlFor='email'
									className='text-sm font-medium text-gray-700 mb-2 block'
								>
									Email Address *
								</Label>
								<Input
									id='email'
									type='email'
									{...register("email")}
									placeholder='john.doe@example.com'
									autoComplete='email'
									className={`h-12 ${
										errors.email
											? "border-red-500 focus:border-red-500 focus:ring-red-500"
											: "focus:border-blue-500 focus:ring-blue-500"
									}`}
								/>
								{errors.email && (
									<p className='text-sm text-red-500 mt-2'>
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<Label
									htmlFor='phone'
									className='text-sm font-medium text-gray-700 mb-2 block'
								>
									Phone Number *
								</Label>
								<Input
									id='phone'
									value={watchedValues.phone || ""}
									onChange={handlePhoneChange}
									placeholder='(555) 123-4567'
									autoComplete='tel'
									className={`h-12 ${
										errors.phone
											? "border-red-500 focus:border-red-500 focus:ring-red-500"
											: "focus:border-blue-500 focus:ring-blue-500"
									}`}
								/>
								{errors.phone && (
									<p className='text-sm text-red-500 mt-2'>
										{errors.phone.message}
									</p>
								)}
							</div>

							<div>
								<Label className='text-sm font-medium text-gray-700 mb-3 block'>
									Preferred Contact Method
								</Label>
								<RadioGroup
									value={watchedValues.contactPreference}
									onValueChange={(value) =>
										setValue(
											"contactPreference",
											value as any
										)
									}
									className='space-y-3'
								>
									{["Text", "Phone", "Email"].map(
										(method) => (
											<div
												key={method}
												className='relative'
											>
												<RadioGroupItem
													value={method}
													id={method}
													className='sr-only'
												/>
												<Label
													htmlFor={method}
													className={`flex items-center p-4 border rounded-lg transition-all cursor-pointer group ${
														watchedValues.contactPreference ===
														method
															? "border-blue-500 bg-blue-50"
															: "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
													}`}
												>
													<div
														className={`flex items-center justify-center w-5 h-5 border-2 rounded-full mr-3 transition-colors ${
															watchedValues.contactPreference ===
															method
																? "border-blue-500 bg-blue-500"
																: "border-gray-300 group-hover:border-blue-400"
														}`}
													>
														<div
															className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
																watchedValues.contactPreference ===
																method
																	? "opacity-100"
																	: "opacity-0"
															}`}
														/>
													</div>
													<span className='text-sm font-medium text-gray-700'>
														{method}
													</span>
												</Label>
											</div>
										)
									)}
								</RadioGroup>
							</div>

							{/* Hidden fields for city and state */}
							<input type='hidden' {...register("city")} />
							<input type='hidden' {...register("state")} />

							{/* hCaptcha */}
							{process.env.NODE_ENV !== "development" && (
								<div className='mt-6'>
									<HCaptcha
										onVerify={setHcaptchaToken}
										onExpire={() => setHcaptchaToken("")}
									/>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Navigation Buttons */}
				<div className='flex justify-between pt-12'>
					<Button
						type='button'
						variant='outline'
						onClick={prevStep}
						disabled={currentStep === 1}
						className='flex items-center space-x-3 px-8 py-4 h-14 text-base font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200'
					>
						<ArrowLeft className='w-5 h-5' />
						<span>Previous</span>
					</Button>

					{currentStep < totalSteps ? (
						<Button
							type='button'
							onClick={nextStep}
							className='flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 h-14 text-base font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
						>
							<span>Next</span>
							<ArrowRight className='w-5 h-5' />
						</Button>
					) : (
						<Button
							type='submit'
							disabled={isSubmitting}
							className='flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 h-14 text-base font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
						>
							{isSubmitting ? (
								<>
									<div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
									<span>Submitting...</span>
								</>
							) : (
								<>
									<Check className='w-5 h-5' />
									<span>Submit Application</span>
								</>
							)}
						</Button>
					)}
				</div>
			</form>
		</div>
	);
}
