"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

export default function MailingListForm() {
	const [firstName, setFirstName] = useState("");
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const { toast } = useToast();

	// Ensure component is mounted before showing client-side state
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!firstName.trim() || !email.trim()) {
			toast({
				title: "Please fill in all fields",
				description: "Both first name and email are required.",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/subscribe-mailing-list", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: firstName.trim(),
					email: email.trim(),
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setIsSuccess(true);
				toast({
					title: "🎉 Welcome to HELOC360!",
					description:
						"Thank you for subscribing! You'll receive our latest HELOC tips, market updates, and success stories.",
					duration: 5000,
				});
				setFirstName("");
				setEmail("");
			} else {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to submit");
			}
		} catch (error) {
			console.error("Mailing list submission error:", error);
			toast({
				title: "Submission failed",
				description:
					"There was an error submitting your information. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show success message only after component is mounted
	if (isMounted && isSuccess) {
		return (
			<div className='text-center space-y-4 py-8'>
				<div className='flex justify-center'>
					<CheckCircle className='h-16 w-16 text-[#02c39a]' />
				</div>
				<div className='space-y-2'>
					<h3 className='text-2xl font-bold text-white'>
						Welcome to HELOC360!
					</h3>
					<p className='text-white/80 text-lg'>
						Thank you for subscribing! You'll receive our latest
						HELOC tips, market updates, and success stories.
					</p>
				</div>
				<Button
					variant='outline'
					className='bg-transparent border-white/30 text-white hover:bg-white/10'
					onClick={() => setIsSuccess(false)}
				>
					Subscribe Another Email
				</Button>
			</div>
		);
	}

	// Show loading state during hydration
	if (!isMounted) {
		return (
			<form
				role='form'
				aria-label='Mailing List Subscription Form'
				onSubmit={handleSubmit}
			>
				<div className='grid sm:grid-cols-2 gap-4'>
					<Input
						placeholder='First Name'
						className='bg-white/20 border-white/30 text-white placeholder:text-white/70'
						required
						aria-label='First Name'
					/>
					<Input
						type='email'
						placeholder='Email Address'
						className='bg-white/20 border-white/30 text-white placeholder:text-white/70'
						required
						aria-label='Email Address'
					/>
				</div>
				<Button
					size='lg'
					className='w-full bg-[#02c39a] hover:bg-[#00a896] text-white mt-4'
					type='submit'
					aria-label='Subscribe to mailing list'
				>
					Get Started
				</Button>
			</form>
		);
	}

	return (
		<form
			role='form'
			aria-label='Mailing List Subscription Form'
			onSubmit={handleSubmit}
		>
			<div className='grid sm:grid-cols-2 gap-4'>
				<Input
					placeholder='First Name'
					className='bg-white/20 border-white/30 text-white placeholder:text-white/70'
					required
					aria-label='First Name'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					disabled={isSubmitting}
				/>
				<Input
					type='email'
					placeholder='Email Address'
					className='bg-white/20 border-white/30 text-white placeholder:text-white/70'
					required
					aria-label='Email Address'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isSubmitting}
				/>
			</div>
			<Button
				size='lg'
				className='w-full bg-[#02c39a] hover:bg-[#00a896] text-white mt-4'
				type='submit'
				aria-label='Subscribe to mailing list'
				disabled={isSubmitting}
			>
				{isSubmitting ? "Subscribing..." : "Get Started"}
			</Button>
		</form>
	);
}
