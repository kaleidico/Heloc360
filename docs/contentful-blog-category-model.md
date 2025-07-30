# Contentful Content Model: Blog Category

This document outlines the content model structure needed in Contentful for Blog Categories on the HELOC360 website.

## Content Model Name: `blogCategory`

### Basic Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `name` | Short text | ✅ Yes | Category display name | Max 50 characters |
| `slug` | Short text | ✅ Yes | URL-friendly version of name | Lowercase, hyphens only, unique |
| `description` | Long text | ✅ Yes | Category description for SEO and display | Max 300 characters |
| `color` | Short text | ❌ No | Hex color code for category styling | Hex format (#000000) |

### Display Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `icon` | Short text | ❌ No | Lucide icon name for category | Valid Lucide icon name |
| `sortOrder` | Number | ❌ No | Display order in category lists | Integer |

### SEO Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `metaTitle` | Short text | ❌ No | Custom SEO title for category page | Max 60 characters |
| `metaDescription` | Long text | ❌ No | Custom SEO description | Max 160 characters |

## Field Usage on Website

### Category Listings
- `name` - Category display name
- `slug` - URL generation (/blog/category/[slug])
- `description` - Category description
- `color` - Badge/tag styling
- `icon` - Category icon display
- `sortOrder` - Category ordering

### Blog Post Display
- `name` - Category badge on posts
- `slug` - Category link generation
- `color` - Badge color styling

## Predefined Categories

### Suggested Categories
1. **HELOC Basics** - `heloc-basics`
2. **Home Equity** - `home-equity`
3. **Debt Consolidation** - `debt-consolidation`
4. **Interest Rates** - `interest-rates`
5. **Tax Benefits** - `tax-benefits`
6. **Real Estate** - `real-estate`
7. **Financial Planning** - `financial-planning`
8. **Market Updates** - `market-updates`

## Content Guidelines

### Required for All Categories
1. **Name** - Clear, descriptive category name
2. **Slug** - Use format: "category-name" (lowercase, hyphens)
3. **Description** - Brief explanation of category content

### Optional Fields
- **Color** - Brand-consistent hex colors
- **Icon** - Relevant Lucide React icons
- **Sort Order** - Logical ordering for display
- **Meta fields** - Custom SEO optimization
