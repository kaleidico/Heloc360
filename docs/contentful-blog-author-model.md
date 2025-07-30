# Contentful Content Model: Blog Author

This document outlines the content model structure needed in Contentful for Blog Authors on the HELOC360 website.

## Content Model Name: `blogAuthor`

### Basic Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `name` | Short text | ✅ Yes | Author's full name | Max 100 characters |
| `slug` | Short text | ✅ Yes | URL-friendly version of name | Lowercase, hyphens only, unique |
| `title` | Short text | ✅ Yes | Professional title/position | Max 100 characters |
| `bio` | Long text | ✅ Yes | Author biography | Max 500 characters |
| `image` | Media | ✅ Yes | Author profile photo | JPG/PNG, min 200x200px, max 1MB |

### Contact Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `email` | Short text | ❌ No | Professional email address | Valid email format |
| `linkedinUrl` | Short text | ❌ No | LinkedIn profile URL | Valid URL format |
| `twitterUrl` | Short text | ❌ No | Twitter profile URL | Valid URL format |

### Professional Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `expertise` | Short text, list | ❌ No | Areas of expertise | Max 10 items, 50 chars each |
| `credentials` | Short text, list | ❌ No | Professional credentials | Max 10 items, 100 chars each |

## Field Usage on Website

### Blog Post Author Section
- `name` - Author name display
- `title` - Professional title
- `bio` - Author description
- `image` - Author photo
- `expertise` - Expertise tags
- `linkedinUrl` - Social media link

### Author Archive Pages
- `name` - Page title
- `slug` - URL generation (/blog/author/[slug])
- `bio` - Full author description
- `credentials` - Professional qualifications
- All contact information (if provided)

## Content Guidelines

### Required for All Authors
1. **Name** - Full professional name
2. **Slug** - Use format: "firstname-lastname" (lowercase, hyphens)
3. **Title** - Current professional title
4. **Bio** - Professional background and expertise
5. **Image** - Professional headshot

### Optional Fields
- **Contact Info** - Only if author wants to be contacted
- **Expertise** - Key areas of knowledge
- **Credentials** - Relevant certifications and qualifications

## Image Requirements

### Author Photos
- **Format**: JPG or PNG
- **Dimensions**: Minimum 200x200px, recommended 400x400px
- **Aspect Ratio**: Square (1:1)
- **File Size**: Maximum 1MB
- **Quality**: Professional headshot
