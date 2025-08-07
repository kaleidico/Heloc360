# Mortgage Application Form

## Overview

The Mortgage Application Form is a modern, multi-step form built with Next.js, TypeScript, and Tailwind CSS. It provides a user-friendly interface for collecting mortgage application information with robust validation and security features.

## Features

### 🎯 Multi-Step Form
- **9 Steps** with clear progress indication
- **Smooth navigation** between steps
- **Step validation** before proceeding
- **Progress bar** showing completion status

### 🔒 Security & Validation
- **hCaptcha integration** for spam protection
- **Robust email validation** with DNS checking
- **Phone number masking** and validation
- **Currency input masking** for financial fields
- **Zip code validation** for US addresses
- **Real-time error feedback**

### 📱 User Experience
- **Modern, responsive design** using Tailwind CSS
- **Accessible form controls** with proper labels
- **Input masking** for better user experience
- **Conditional field display** based on selections
- **Clear error messages** and validation feedback

### 🚀 Technical Features
- **TypeScript** for type safety
- **React hooks** for state management
- **Form validation** with custom validation functions
- **API integration** with webhook endpoint
- **Toast notifications** for user feedback

## Form Steps

### Step 1: Property Location
- Property zip code (required)
- Property address (optional)

### Step 2: Borrower Type
- Individual Homeowner (or Homebuyer)
- Self-Employed
- Real Estate Investor (US Resident)
- Real Estate Investor (non-US Resident)
- Broker
- Other

### Step 3: Loan Details
- Mortgage type (Purchase, Refinance, Cash Out)
- Timeline for purchase

### Step 4: Property Information
- Property type (Single Family, Condo, Multi-Family, etc.)
- Occupancy status (Owner Occupied, Non-Owner Occupied)

### Step 5: Financial Information
- Property value (with currency masking)
- Down payment (for purchase loans)
- Loan amount (for refinance/cash out loans)

### Step 6: Loan Position
- 1st mortgage
- 2nd (home-equity)
- 3rd
- Other
- I'm not sure

### Step 7: Credit & History
- Estimated credit score range
- Military service status (for VA loan eligibility)
- Bankruptcy/foreclosure history

### Step 8: Additional Information
- Optional text area for additional details

### Step 9: Contact Information
- First and last name
- Email address (with DNS validation)
- Phone number (with masking)
- Contact preference (Text, Phone, Email)
- hCaptcha verification

## Validation Rules

### Email Validation
- Format validation using regex
- DNS checking for domain validity
- Fallback to format-only validation if DNS check fails

### Phone Validation
- Accepts 10-digit US numbers
- Accepts 11-digit numbers with country code
- Automatic formatting: (555) 123-4567

### Zip Code Validation
- 5-digit US zip codes
- ZIP+4 format (9 digits)

### Currency Validation
- Numeric values only
- Positive amounts required
- Automatic formatting with currency symbols

## API Integration

The form submits data to:
```
https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682
```

### Request Format
```json
{
  "zipCode": "12345",
  "propertyAddress": "123 Main St",
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
  "submittedAt": "2025-01-07T12:00:00.000Z",
  "source": "mortgage-application-form"
}
```

## Configuration

### hCaptcha Setup
1. Sign up for hCaptcha at https://www.hcaptcha.com/
2. Get your site key
3. Replace the placeholder site key in the form:
   ```tsx
   sitekey="10000000-ffff-ffff-ffff-000000000001" // Replace with your actual key
   ```

### Environment Variables
Add the following to your `.env.local`:
```env
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
```

## File Structure

```
src/
├── app/
│   └── mortgage-application/
│       ├── page.tsx                    # Main form page
│       └── confirmation/
│           └── page.tsx                # Confirmation page
├── components/
│   ├── mortgage-application/
│   │   └── mortgage-application-form.tsx # Main form component
│   └── ui/
│       ├── hcaptcha.tsx               # hCaptcha component
│       ├── progress.tsx               # Progress bar component
│       └── radio-group.tsx            # Radio group component
└── lib/
    └── validation.ts                  # Validation utilities
```

## Usage

### Basic Usage
```tsx
import MortgageApplicationForm from '@/components/mortgage-application/mortgage-application-form'

export default function Page() {
  return (
    <div className="container mx-auto py-12">
      <MortgageApplicationForm />
    </div>
  )
}
```

### Custom Styling
The form uses Tailwind CSS classes and can be customized by modifying the component styles or wrapping it in custom containers.

## Accessibility

- All form controls have proper labels
- Error messages are associated with their respective fields
- Keyboard navigation is supported
- Screen reader friendly
- High contrast design
- Focus indicators for all interactive elements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading of hCaptcha script
- Optimized re-renders with React hooks
- Minimal bundle size
- Efficient validation functions

## Security Considerations

- hCaptcha protection against bots
- Input sanitization
- Email DNS validation
- No sensitive data stored in localStorage
- Secure API communication

## Future Enhancements

- [ ] Save form progress to localStorage
- [ ] File upload for documents
- [ ] Multi-language support
- [ ] Advanced analytics tracking
- [ ] A/B testing capabilities
- [ ] Integration with CRM systems
