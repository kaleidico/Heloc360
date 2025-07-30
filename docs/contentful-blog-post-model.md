# Contentful Content Model: Blog Post

This document outlines the content model structure needed in Contentful for the Blog section of the HELOC360 website.

## Content Model Name: `blogPost`

### Basic Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `title` | Short text | ✅ Yes | Blog post title | Max 100 characters |
| `slug` | Short text | ✅ Yes | URL-friendly version of title for routing | Lowercase, hyphens only, unique |
| `excerpt` | Long text | ✅ Yes | Brief summary for blog listing pages | Max 300 characters |
| `content` | Rich text | ✅ Yes | Full blog post content with formatting | Rich text editor |
| `featuredImage` | Media | ✅ Yes | Main image for the blog post | JPG/PNG/WebP, min 800x400px, max 5MB |

### Publishing Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `publishedDate` | Date and time | ✅ Yes | When the post was published | Date format |
| `featured` | Boolean | ❌ No | Whether this post is featured | Default: false |
| `readTime` | Number | ❌ No | Estimated reading time in minutes | Integer, 1-60 |

### Categorization Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `category` | Reference | ✅ Yes | Primary category for the post | Links to BlogCategory model |
| `tags` | Reference, many | ❌ No | Tags for the post | Links to BlogTag model, max 10 |

### Author Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `author` | Reference | ✅ Yes | Post author | Links to BlogAuthor model |

### SEO Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `metaTitle` | Short text | ❌ No | Custom SEO title | Max 60 characters |
| `metaDescription` | Long text | ❌ No | Custom SEO description | Max 160 characters |

## Field Usage on Website

### Blog Listing Pages
- `title` - Post title
- `slug` - URL generation
- `excerpt` - Post summary
- `featuredImage` - Post thumbnail
- `publishedDate` - Publication date
- `readTime` - Reading time estimate
- `category` - Category badge
- `author` - Author name and image
- `featured` - Featured post highlighting

### Individual Blog Posts
- `title` - Page title and H1
- `content` - Full post content
- `featuredImage` - Hero image
- `publishedDate` - Publication date
- `readTime` - Reading time
- `category` - Category link
- `tags` - Tag links
- `author` - Author bio section
- `metaTitle` - SEO title (fallback to title)
- `metaDescription` - SEO description (fallback to excerpt)

## SEO Considerations

### Individual Blog Posts
- Page title: `[metaTitle || title] | HELOC360 Blog`
- Meta description: `metaDescription || excerpt`
- Canonical URL: `/blog/[slug]`

### Structured Data
The website automatically generates Article schema markup using:
- `title` (as headline)
- `publishedDate` (as datePublished)
- `author` (as author)
- `featuredImage` (as image)
- `excerpt` (as description)

## Image Requirements

### Featured Images
- **Format**: JPG, PNG, or WebP
- **Dimensions**: Minimum 800x400px, recommended 1200x600px
- **Aspect Ratio**: 2:1 or 3:2
- **File Size**: Maximum 5MB
- **Quality**: High-resolution, relevant to content

## Content Guidelines

### Required for All Posts
1. **Title** - Clear, engaging, SEO-friendly
2. **Slug** - Use format: "topic-keywords" (lowercase, hyphens)
3. **Excerpt** - Compelling summary that encourages reading
4. **Content** - Well-structured with headings, paragraphs, lists
5. **Featured Image** - High-quality, relevant image
6. **Published Date** - Accurate publication timestamp
7. **Category** - Appropriate primary category
8. **Author** - Assigned author

### Optional Fields
- **Featured** - Mark important posts as featured
- **Read Time** - Estimate based on word count (250 words/minute)
- **Tags** - Relevant topic tags for discoverability
- **Meta Title** - Custom SEO title if different from main title
- **Meta Description** - Custom description if different from excerpt

## Content Maintenance

### Adding New Posts
1. Create new `blogPost` entry in Contentful
2. Fill all required fields
3. Add optional fields as appropriate
4. Preview content formatting
5. Publish entry
6. Website will automatically include in blog listings

### Updating Existing Posts
- Any field can be updated without affecting website structure
- Changing slug will update URL (consider redirects for SEO)
- Featured posts appear in special sections

### Content Organization
- Use consistent category assignment
- Apply relevant tags for filtering
- Maintain consistent author attribution
- Regular content audits for accuracy
