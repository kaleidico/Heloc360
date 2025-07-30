# Contentful Content Model: Blog Tag

This document outlines the content model structure needed in Contentful for Blog Tags on the HELOC360 website.

## Content Model Name: `blogTag`

### Basic Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `name` | Short text | ✅ Yes | Tag display name | Max 30 characters |
| `slug` | Short text | ✅ Yes | URL-friendly version of name | Lowercase, hyphens only, unique |
| `description` | Long text | ❌ No | Tag description for SEO | Max 200 characters |

### Display Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `color` | Short text | ❌ No | Hex color code for tag styling | Hex format (#000000) |

## Field Usage on Website

### Tag Display
- `name` - Tag display name
- `slug` - URL generation (/blog/tag/[slug])
- `color` - Tag styling
- `description` - Tag page description

### Blog Post Filtering
- Tags used for search and filtering functionality
- Tag-based post recommendations

## Suggested Tags

### Financial Topics
- `first-time-buyer`
- `refinancing`
- `credit-score`
- `loan-terms`
- `closing-costs`

### HELOC Specific
- `heloc-vs-loan`
- `draw-period`
- `repayment-period`
- `variable-rates`
- `credit-line`

### General Finance
- `budgeting`
- `investing`
- `retirement`
- `emergency-fund`
- `financial-tips`

## Content Guidelines

### Required for All Tags
1. **Name** - Concise, searchable tag name
2. **Slug** - Use format: "tag-name" (lowercase, hyphens)

### Optional Fields
- **Description** - Brief explanation for tag pages
- **Color** - Consistent color scheme
