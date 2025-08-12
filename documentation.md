# HELOC360 Mortgage Application Form - Developer Documentation

This document provides detailed technical information for developers working with the HELOC360 mortgage application form.

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Form Management**: React Hook Form + Zod
- **State Management**: React Hooks
- **Security**: hCaptcha
- **Deployment**: Vercel (recommended)

### Project Structure
```
heloc360/
├── app/
│   ├── get-started/
│   │   ├── page.tsx                    # Main form page
│   │   └── confirmation/
│   │       └── page.tsx                # Confirmation page
│   └── layout.tsx                      # Root layout
├── components/
│   ├── mortgage-application/
│   │   └── mortgage-application-form.tsx # Main form component
│   ├── tracking-provider.tsx           # Tracking initialization
│   └── ui/
│       ├── hcaptcha.tsx               # hCaptcha component
│       └── ...                        # Other UI components
├── lib/
│   ├── tracking.ts                    # Tracking utilities
│   └── utils.ts                       # General utilities
├── hooks/
│   └── use-toast.ts                   # Toast notifications
└── types/
    └── ...                            # TypeScript type definitions
```

## 🔧 Core Components

### 1. MortgageApplicationForm Component

**Location**: `components/mortgage-application/mortgage-application-form.tsx`

**Purpose**: Main form component handling the multi-step form logic.

**Key Features**:
- Multi-step navigation with validation
- Form state management with React Hook Form
- Input masking and formatting
- API integration for zip code lookup
- Tracking parameter capture
- hCaptcha integration

**State Management**:
```typescript
const [currentStep, setCurrentStep] = useState(1)
const [isSubmitting, setIsSubmitting] = useState(false)
const [hcaptchaToken, setHcaptchaToken] = useState('')
const [locationData, setLocationData] = useState<LocationData | null>(null)
```

**Form Schema**:
```typescript
const formSchema = z.object({
  zipCode: z.string().min(5).max(10),
  propertyAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  borrowerType: z.enum([...]),
  mortgageType: z.enum(['Purchase', 'Refinance', 'Cash Out']),
  // ... other fields
})
```

### 2. TrackingProvider Component

**Location**: `components/tracking-provider.tsx`

**Purpose**: Initializes tracking data when the app loads.

**Implementation**:
```typescript
export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeTracking()
  }, [])

  return <>{children}</>
}
```

### 3. HCaptcha Component

**Location**: `components/ui/hcaptcha.tsx`

**Purpose**: Reusable hCaptcha component with dynamic script loading.

**Features**:
- Dynamic script loading
- Environment-based rendering
- Proper cleanup on unmount
- Accessibility compliance

## 📊 Data Flow

### 1. Form Data Flow
```
User Input → React Hook Form → Zod Validation → Form State → API Submission
```

### 2. Tracking Data Flow
```
URL Parameters → TrackingProvider → localStorage → Form Submission → Webhook
```

### 3. Zip Code Lookup Flow
```
Zip Code Input → API Call → City/State Data → Form State → UI Display
```

## 🔍 Form Validation

### Validation Strategy
1. **Step-by-step validation**: Each step validates its fields before proceeding
2. **Real-time validation**: Fields validate on change/blur
3. **Final validation**: Complete form validation on submission

### Validation Rules
```typescript
// Zip Code
zipCode: z.string().min(5, 'Zip code must be at least 5 digits').max(10, 'Zip code must be 10 digits or less')

// Email
email: z.string().email('Please enter a valid email address')

// Phone
phone: z.string().min(10, 'Phone number must be at least 10 digits')

// Required fields
firstName: z.string().min(1, 'First name is required')
```

### Custom Validation Functions
```typescript
// Phone number formatting
const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
}

// Currency formatting
const formatCurrency = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers === '') return ''
  const num = parseInt(numbers, 10)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}
```

## 🌐 API Integration

### 1. Zip Code Lookup API
**Endpoint**: `https://api.zippopotam.us/US/{zipCode}`

**Implementation**:
```typescript
const lookupZipCode = async (zipCode: string) => {
  if (zipCode.length >= 5) {
    try {
      const response = await fetch(`https://api.zippopotam.us/US/${zipCode}`)
      if (response.ok) {
        const data = await response.json()
        const city = data.places[0]['place name']
        const state = data.places[0]['state abbreviation']
        setLocationData({ city, state })
        setValue('city', city)
        setValue('state', state)
      }
    } catch (error) {
      console.log('Zip code lookup failed:', error)
    }
  }
}
```

### 2. Form Submission API
**Endpoint**: `https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682`

**Implementation**:
```typescript
const onSubmit = async (data: FormData) => {
  setIsSubmitting(true)
  try {
    const trackingData = getTrackingData()
    const ipAddress = await getIpAddress()
    
    const submissionData = {
      ...data,
      hcaptchaToken,
      userAgent: navigator.userAgent,
      ipAddress,
      ...trackingData,
      submittedAt: new Date().toISOString(),
      source: 'mortgage-application-form'
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    })

    if (response.ok) {
      router.push('/mortgage-application/confirmation')
    }
  } catch (error) {
    console.error('Submission error:', error)
    toast.error('Submission failed')
  } finally {
    setIsSubmitting(false)
  }
}
```

### 3. IP Address API
**Endpoint**: `https://api.ipify.org?format=json`

**Implementation**:
```typescript
const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.log('Failed to get IP address:', error)
    return ''
  }
}
```

## 📈 Tracking System

### Tracking Data Structure
```typescript
interface TrackingData {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  fbclid?: string
  referral?: string
  userAgent?: string
  ipAddress?: string
}
```

### Tracking Functions
```typescript
// Extract tracking parameters from URL
export function extractTrackingParams(url: string): Partial<TrackingData>

// Save tracking data to localStorage
export function saveTrackingData(data: TrackingData): void

// Get tracking data from localStorage
export function getTrackingData(): Partial<TrackingData>

// Merge tracking data
export function getMergedTrackingData(): TrackingData

// Initialize tracking on page load
export function initializeTracking(): void

// Get IP address
export async function getIpAddress(): Promise<string>

// Update tracking with IP address
export async function updateTrackingWithIp(): Promise<void>
```

### Tracking Persistence
- Tracking data is stored in `localStorage` under key `tracking_data`
- Data persists across page loads and browser sessions
- New tracking parameters are merged with existing data
- IP address is fetched and stored on form submission

## 🔒 Security Implementation

### hCaptcha Integration
```typescript
// Conditional rendering based on environment
{process.env.NODE_ENV !== 'development' && (
  <HCaptcha
    onVerify={setHcaptchaToken}
    onExpire={() => setHcaptchaToken('')}
  />
)}

// Validation on submission
if (process.env.NODE_ENV !== 'development' && !hcaptchaToken) {
  toast.error('Please complete the security verification')
  return
}
```

### Input Sanitization
- All user inputs are validated through Zod schema
- HTML entities are properly escaped
- XSS protection through React's built-in sanitization

### Data Protection
- No sensitive data stored in localStorage
- Secure API communication over HTTPS
- Environment-based security features

## 🎨 Styling & UI

### Design System
- **Framework**: Tailwind CSS
- **Component Library**: Shadcn UI
- **Icons**: Lucide React
- **Typography**: Inter font family

### Responsive Design
```typescript
// Mobile-first approach
className="grid grid-cols-1 md:grid-cols-2 gap-4"

// Responsive text sizes
className="text-2xl md:text-3xl lg:text-4xl"

// Responsive spacing
className="p-4 md:p-6 lg:p-8"
```

### Accessibility Features
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- High contrast design

## 🧪 Testing Strategy

### Manual Testing Checklist
1. **Form Navigation**
   - [ ] Step-by-step navigation works
   - [ ] Previous/Next buttons function correctly
   - [ ] Progress bar updates accurately

2. **Validation**
   - [ ] Required field validation
   - [ ] Email format validation
   - [ ] Phone number validation
   - [ ] Zip code validation

3. **Input Masking**
   - [ ] Phone number formatting
   - [ ] Currency formatting
   - [ ] Zip code formatting

4. **API Integration**
   - [ ] Zip code lookup works
   - [ ] Form submission succeeds
   - [ ] Error handling works

5. **Tracking**
   - [ ] UTM parameters captured
   - [ ] Tracking data persists
   - [ ] IP address captured

6. **Security**
   - [ ] hCaptcha works in production
   - [ ] hCaptcha disabled in development
   - [ ] Form validation prevents invalid data

### Automated Testing (Recommended)
```typescript
// Example test structure
describe('MortgageApplicationForm', () => {
  it('should validate required fields', () => {
    // Test implementation
  })

  it('should format phone numbers correctly', () => {
    // Test implementation
  })

  it('should submit form data successfully', () => {
    // Test implementation
  })
})
```

## 🚀 Performance Optimization

### Code Splitting
- Dynamic imports for heavy components
- Lazy loading of hCaptcha script
- Route-based code splitting

### Bundle Optimization
- Tree shaking for unused code
- Minification in production
- Image optimization with Next.js

### Caching Strategy
- Static generation for confirmation page
- Browser caching for static assets
- API response caching where appropriate

## 🔧 Configuration

### Environment Variables
```env
# Development
NODE_ENV=development

# Production
NODE_ENV=production
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key_here

# Contentful (Blog)
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_ACCESS_TOKEN=your_cda_access_token
CONTENTFUL_HOST=cdn.contentful.com
```

### Build Configuration
```typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['api.zippopotam.us'],
  },
}
```

## 🐛 Debugging

### Common Issues

1. **Form not submitting**
   ```typescript
   // Check webhook URL accessibility
   // Verify hCaptcha completion
   // Check browser console for errors
   ```

2. **Zip code lookup failing**
   ```typescript
   // Verify internet connection
   // Check API endpoint status
   // Validate zip code format
   ```

3. **Tracking not working**
   ```typescript
   // Check localStorage availability
   // Verify URL parameter format
   // Check browser console for errors
   ```

### Debug Mode
```typescript
// Enable debug logging
if (process.env.NEXT_PUBLIC_DEBUG) {
  console.log('Debug info:', data)
}
```

## 📚 API Reference

### Form Methods
```typescript
// Navigate to next step
const nextStep = async () => {
  const isValid = await validateCurrentStep()
  if (isValid && currentStep < totalSteps) {
    setCurrentStep(currentStep + 1)
  }
}

// Navigate to previous step
const prevStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1)
  }
}

// Validate current step
const validateCurrentStep = async () => {
  const fieldsToValidate = getFieldsForStep(currentStep)
  const result = await trigger(fieldsToValidate)
  return result
}
```

### Tracking Methods
```typescript
// Initialize tracking
initializeTracking(): void

// Get tracking data
getTrackingData(): Partial<TrackingData>

// Update with IP address
updateTrackingWithIp(): Promise<void>
```

## 🔄 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Set environment variables
3. Configure build settings
4. Deploy automatically

### Environment Setup
```bash
# Production environment variables
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_production_key
NODE_ENV=production
```

### Build Process
```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

## 📈 Monitoring & Analytics

### Error Tracking
- Console error logging
- Form submission error tracking
- API failure monitoring

### Performance Monitoring
- Page load times
- Form completion rates
- API response times

### User Analytics
- Form step completion rates
- Drop-off points
- Conversion tracking

## 🔮 Future Enhancements

### Planned Features
- [ ] Form progress saving
- [ ] File upload integration
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] CRM integration
- [ ] Email notifications
- [ ] SMS notifications

### Technical Improvements
- [ ] Unit test coverage
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] SEO optimization

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintainer**: HELOC360 Development Team
