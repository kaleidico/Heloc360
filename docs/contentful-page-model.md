# Contentful Content Model: Page

This document outlines the content model structure needed in Contentful for static pages on the HELOC360 website.

## Content Model Name: `page`

### Basic Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `title` | Short text | ✅ Yes | Page title | Max 100 characters |
| `slug` | Short text | ✅ Yes | URL-friendly version of title | Lowercase, hyphens only, unique |
| `content` | Rich text | ✅ Yes | Main page content | Rich text editor |
| `excerpt` | Long text | ❌ No | Brief page description | Max 300 characters |

### SEO Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `metaTitle` | Short text | ❌ No | Custom SEO title | Max 60 characters |
| `metaDescription` | Long text | ❌ No | Custom SEO description | Max 160 characters |
| `featuredImage` | Media | ❌ No | Page hero image | JPG/PNG/WebP, max 5MB |

### Page Settings Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `showInNavigation` | Boolean | ❌ No | Whether to show in main navigation | Default: false |
| `navigationOrder` | Number | ❌ No | Order in navigation menu | Integer |
| `pageType` | Short text | ❌ No | Type of page (legal, about, etc.) | Max 50 characters |

## Field Usage on Website

### Page Display
- `title` - Page H1 and browser title
- `slug` - URL generation
- `content` - Main page content
- `featuredImage` - Hero image (if provided)
- `excerpt` - Meta description fallback

### Navigation
- `showInNavigation` - Include in menus
- `navigationOrder` - Menu ordering
- `pageType` - Styling and layout variations

## Suggested Pages

### Legal Pages
- Privacy Policy - `privacy`
- Terms of Service - `terms`
- Affiliate Disclosure - `affiliate-disclosure`
- Communication Consent - `communication-consent`

### Company Pages
- About Us - `about`
- Contact - `contact`
- Careers - `careers`

### Educational Pages
- HELOC 101 - `heloc-101`
- Getting Started - `getting-started`

## Content Guidelines

### Required for All Pages
1. **Title** - Clear, descriptive page title
2. **Slug** - Use format: "page-name" (lowercase, hyphens)
3. **Content** - Well-structured page content

### Optional Fields
- **Excerpt** - Brief description for SEO
- **Meta fields** - Custom SEO optimization
- **Featured Image** - Relevant hero image
- **Navigation settings** - Menu inclusion and ordering

## SEO Considerations

### Page Optimization
- Page title: `[metaTitle || title] | HELOC360`
- Meta description: `metaDescription || excerpt`
- Canonical URL: `/[slug]`

### Content Structure
- Use proper heading hierarchy (H1, H2, H3)
- Include internal links where relevant
- Optimize for target keywords
- Ensure mobile-friendly formatting
