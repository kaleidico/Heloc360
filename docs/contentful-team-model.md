# Contentful Content Model: Our Team

This document outlines the content model structure needed in Contentful for the "Our Team" section of the HELOC360 website.

## Content Model Name: `teamMember`

### Basic Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `name` | Short text | ✅ Yes | Full name of the team member | Max 100 characters |
| `title` | Short text | ✅ Yes | Job title/position | Max 150 characters |
| `slug` | Short text | ✅ Yes | URL-friendly version of name for routing | Lowercase, hyphens only, unique |
| `profileImage` | Media | ✅ Yes | Professional headshot photo | JPG/PNG, min 400x400px, max 2MB |
| `shortBio` | Long text | ✅ Yes | Brief bio for team overview cards | Max 200 characters |
| `longBio` | Long text | ✅ Yes | Detailed biography for individual profile page | Max 2000 characters |

### Contact Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `email` | Short text | ❌ No | Professional email address | Valid email format |
| `phone` | Short text | ❌ No | Direct phone number | Phone number format |
| `linkedinUrl` | Short text | ❌ No | LinkedIn profile URL | Valid URL format |

### Professional Details Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `location` | Short text | ❌ No | City, State where they're based | Max 100 characters |
| `joinedDate` | Date | ❌ No | Date they joined the company | Date format |
| `expertise` | Short text, list | ❌ No | Array of expertise areas/skills | Max 10 items, 50 chars each |
| `achievements` | Long text, list | ❌ No | Array of key achievements | Max 10 items, 200 chars each |

### Education Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `education` | Reference, many | ❌ No | References to Education entries | Links to separate Education model |

## Separate Content Model: `education`

For the education entries, create a separate content model to allow for structured education data:

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `degree` | Short text | ✅ Yes | Degree name (e.g., "MBA in Finance") | Max 150 characters |
| `school` | Short text | ✅ Yes | Institution name | Max 200 characters |
| `graduationYear` | Short text | ✅ Yes | Year of graduation | 4-digit year format |

## Field Usage on Website

### Team Overview Cards (About Page)
- `name` - Display name
- `title` - Job title
- `profileImage` - Team member photo
- `shortBio` - Brief description
- `slug` - Used for linking to individual profile

### Individual Profile Pages
- `name` - Page title and display name
- `title` - Job title
- `profileImage` - Large profile photo
- `longBio` - Full biography (split by paragraphs)
- `email` - Contact email (if provided)
- `phone` - Contact phone (if provided)
- `linkedinUrl` - LinkedIn link (if provided)
- `location` - Location display (if provided)
- `joinedDate` - "Joined [Month Year]" format (if provided)
- `expertise` - Skill tags (if provided)
- `achievements` - Achievement list with icons (if provided)
- `education` - Education cards (if provided)

## Conditional Display Logic

The website will automatically handle missing fields:

### Contact Section
- Only shows contact methods that are provided
- If no contact info is provided, the entire contact section is hidden

### Professional Details
- Location only shows if provided
- Join date only shows if provided
- Expertise section only shows if array has items
- Achievements section only shows if array has items

### Education Section
- Entire education section is hidden if no education entries are linked
- Each education entry displays all three fields (degree, school, year)

## Content Entry Guidelines

### Required for All Team Members
1. **Name** - Use full professional name
2. **Title** - Official job title as it should appear publicly
3. **Slug** - Use format: "firstname-lastname" (lowercase, hyphens)
4. **Profile Image** - High-quality, professional headshot
5. **Short Bio** - 1-2 sentences for overview cards
6. **Long Bio** - 2-3 paragraphs with professional background

### Optional Fields
- Add contact information only if the team member wants to be contacted directly
- Include location if relevant for the role or if it adds value
- Add expertise tags to highlight key skills
- List major achievements and certifications
- Include education if it's relevant to their role and they want it displayed

## SEO Considerations

### Individual Profile Pages
- Page title: `[Name] - [Title] | HELOC360 Team`
- Meta description: Uses the `shortBio` field
- Canonical URL: `/meet-our-team/[slug]`

### Structured Data
The website automatically generates Person schema markup using:
- `name`
- `title` (as jobTitle)
- `profileImage` (as image)
- `longBio` (as description)
- `email` (as email, if provided)

## Image Requirements

### Profile Images
- **Format**: JPG or PNG
- **Dimensions**: Minimum 400x400px, recommended 800x800px
- **Aspect Ratio**: Square (1:1)
- **File Size**: Maximum 2MB
- **Quality**: High-resolution, professional headshot
- **Background**: Preferably neutral or consistent with brand

## Content Maintenance

### Adding New Team Members
1. Create new `teamMember` entry in Contentful
2. Fill required fields
3. Add optional fields as appropriate
4. Create `education` entries if needed
5. Publish entry
6. Website will automatically include in team section

### Updating Existing Members
- Any field can be updated without affecting the website structure
- Removing optional fields will automatically hide those sections
- Changing the slug will update the URL (consider redirects for SEO)

### Removing Team Members
- Unpublish the entry in Contentful
- Website will automatically remove from team section
- Individual profile page will show 404 (handled gracefully)
