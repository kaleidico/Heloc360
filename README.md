# HELOC360 Mortgage Application Form

A modern, multi-step mortgage application form built with Next.js, TypeScript, and Tailwind CSS. This form provides a user-friendly interface for collecting mortgage application information with robust validation and security features.

## 🚀 Features

### Multi-Step Form

-   **9 Steps** with clear progress indication
-   **Smooth navigation** between steps
-   **Step validation** before proceeding
-   **Animated progress bar** showing completion status

### Security & Validation

-   **hCaptcha integration** for spam protection (disabled on localhost)
-   **Robust form validation** with Zod schema
-   **Phone number masking** and validation
-   **Currency input masking** for financial fields
-   **Zip code validation** with automatic city/state lookup
-   **Real-time error feedback**

### User Experience

-   **Modern, responsive design** using Tailwind CSS
-   **Accessible form controls** with proper labels
-   **Input masking** for better user experience
-   **Conditional field display** based on selections
-   **Clear error messages** and validation feedback
-   **Confirmation page** after successful submission

### Technical Features

-   **TypeScript** for type safety
-   **React hooks** for state management
-   **Form validation** with react-hook-form and Zod
-   **API integration** with webhook endpoint
-   **Toast notifications** for user feedback
-   **Tracking parameters** capture and persistence

## 📋 Form Steps

### Step 1: Property Location

-   Property zip code (required)
-   Property address (optional)
-   Automatic city/state lookup from zip code

### Step 2: Borrower Type

-   Individual Homeowner (or Homebuyer)
-   Self-Employed
-   Real Estate Investor (US Resident)
-   Real Estate Investor (non-US Resident)
-   Broker
-   Other

### Step 3: Loan Details

-   Mortgage type (Purchase, Refinance, Cash Out)
-   Timeline for purchase

### Step 4: Property Information

-   Property type (Single Family, Condo, Multi-Family, etc.)
-   Occupancy status (Owner Occupied, Non-Owner Occupied)

### Step 5: Financial Information

-   Property value (with currency masking)
-   Down payment (for purchase loans)
-   Loan amount (for refinance/cash out loans)

### Step 6: Loan Position

-   1st mortgage
-   2nd (home-equity)
-   3rd
-   Other
-   I'm not sure

### Step 7: Credit & History

-   Estimated credit score range
-   Military service status (for VA loan eligibility)
-   Bankruptcy/foreclosure history

### Step 8: Additional Information

-   Optional text area for additional details

### Step 9: Contact Information

-   First and last name
-   Email address (with validation)
-   Phone number (with masking)
-   Contact preference (Text, Phone, Email)
-   hCaptcha verification

## 🔧 Installation & Setup

### Prerequisites

-   Node.js 18+
-   npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd heloc360

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# hCaptcha (optional - form works without it in development)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here

# Webhook URL (already configured)
WEBHOOK_URL=https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682

# Contentful (Blog)
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_ACCESS_TOKEN=your_cda_access_token
CONTENTFUL_HOST=cdn.contentful.com
```

## 🎯 Usage

### Accessing the Form

Navigate to `https://ratequote-heloc360.secure-clix.com/` to access the form.

### Testing the Form

1. Start the development server: `npm run dev`
2. Visit `https://ratequote-heloc360.secure-clix.com/`
3. Fill out the form step by step
4. Submit to see the confirmation page

### Testing with Tracking Parameters

Test tracking functionality by adding UTM parameters to the URL:

```
https://ratequote-heloc360.secure-clix.com/?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=test123
```

## 📊 Data Submission

### Webhook Endpoint

Form data is submitted to:

```
https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682
```

### Request Format

The submission data is organized in the following structure:

```json
{
	// Form Fields (Primary Data)
	"zipCode": "12345",
	"propertyAddress": "123 Main St",
	"city": "New York",
	"state": "NY",
	"borrowerType": "Individual Homeowner (or Homebuyer)",
	"mortgageType": "Purchase",
	"timeline": "Buy in 30 days",
	"propertyType": "Single Family Residence",
	"occupancy": "Yes (Owner Occupied)",
	"propertyValue": "$250,000",
	"downPayment": "$12,500",
	"loanAmount": "",
	"loanPosition": "1st (only mortgage)",
	"creditScore": "Excellent: 720+",
	"militaryService": "No",
	"bankruptcy": "No",
	"additionalInfo": "",
	"firstName": "John",
	"lastName": "Doe",
	"email": "john.doe@example.com",
	"phone": "(555) 123-4567",
	"contactPreference": "Phone",
	"hcaptchaToken": "token_here",

	// Tracking Data (UTMs, gclid, fbclid)
	"utmSource": "google",
	"utmMedium": "cpc",
	"utmCampaign": "heloc_campaign",
	"utmTerm": "heloc",
	"utmContent": "banner",
	"gclid": "gclid_value",
	"fbclid": "fbclid_value",

	// Technical Data (IP, browser, referral)
	"userAgent": "Mozilla/5.0...",
	"ipAddress": "192.168.1.1",
	"referral": "https://google.com",

	// Metadata
	"submittedAt": "2025-01-07T12:00:00.000Z",
	"source": "mortgage-application-form"
}
```

## 🎨 Customization

### Styling

The form uses Tailwind CSS and can be customized by modifying the component styles or wrapping it in custom containers.

### Field Options

Modify the form options by editing the arrays in the component:

-   Borrower types
-   Mortgage types
-   Property types
-   Credit score ranges
-   Contact preferences

### Validation Rules

Update validation rules in the Zod schema in `components/mortgage-application/mortgage-application-form.tsx`.

## 🔒 Security Features

### hCaptcha Integration

-   Automatically disabled on localhost (development)
-   Enabled in production environments
-   Configurable site key via environment variables

### Input Validation

-   Client-side validation with Zod
-   Server-side validation recommended
-   XSS protection through input sanitization

### Data Protection

-   No sensitive data stored in localStorage
-   Secure API communication
-   HTTPS required in production

## 📱 Accessibility

-   All form controls have proper labels
-   Error messages are associated with their respective fields
-   Keyboard navigation is supported
-   Screen reader friendly
-   High contrast design
-   Focus indicators for all interactive elements

## 🌐 Browser Support

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

## 📈 Performance

-   Lazy loading of hCaptcha script
-   Optimized re-renders with React hooks
-   Minimal bundle size
-   Efficient validation functions
-   Image optimization with Next.js

## 🧪 Testing

### Manual Testing

1. Test all form steps
2. Verify validation messages
3. Test zip code lookup functionality
4. Verify phone number masking
5. Test currency input formatting
6. Verify tracking parameter capture
7. Test form submission

### Automated Testing

```bash
# Run tests (if configured)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

-   Netlify
-   AWS Amplify
-   DigitalOcean App Platform
-   Railway

## 📝 API Documentation

### Zip Code Lookup

The form automatically looks up city and state information using the zippopotam.us API:

```
GET https://api.zippopotam.us/US/{zipCode}
```

### IP Address Lookup

User's IP address is fetched from:

```
GET https://api.ipify.org?format=json
```

## 🔧 Troubleshooting

### Common Issues

**Form not submitting**

-   Check webhook URL is accessible
-   Verify hCaptcha is completed (in production)
-   Check browser console for errors

**Zip code lookup not working**

-   Verify internet connection
-   Check zippopotam.us API status
-   Ensure zip code is valid US format

**Tracking parameters not captured**

-   Check localStorage is enabled
-   Verify URL parameters are properly formatted
-   Check browser console for errors

### Debug Mode

Enable debug logging by adding to `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

-   Create an issue in the repository
-   Contact the development team
-   Check the documentation

## 🔄 Changelog

### Version 1.0.0

-   Initial release
-   Multi-step form implementation
-   hCaptcha integration
-   Tracking parameter capture
-   Zip code lookup functionality
-   Responsive design
-   Accessibility features

---

**Note**: This form is designed for HELOC360 and includes specific branding and functionality. Modify as needed for other use cases.
