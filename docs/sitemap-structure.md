# Sitemap Structure

HELOC360 uses a sitemap index structure for better organization and scalability.

## Sitemap Index

**File:** `/public/sitemap.xml`

-   Main sitemap index that references all other sitemaps
-   Referenced in `robots.txt`

## Individual Sitemaps

### 1. Static Pages Sitemap

**File:** `/public/sitemap-pages.xml`

-   Contains all static pages (home, about, contact, calculators, etc.)
-   Manually maintained
-   Includes priority and change frequency settings

### 2. Blog Posts Sitemap

**Dynamic Route:** `/app/sitemap-posts.xml/route.ts`

-   Automatically generated from Contentful blog posts
-   Updates when new posts are published
-   Uses actual publication dates for `lastmod`
-   Cached for 1 hour, CDN cached for 24 hours

### 3. Team Members Sitemap

**Dynamic Route:** `/app/sitemap-team.xml/route.ts`

-   Automatically generated from Contentful team members
-   Updates when team members are added/modified
-   Cached for 1 hour, CDN cached for 24 hours

## URL Structure

### Static Pages

-   Home: `https://heloc360.com` (Priority: 1.0)
-   HELOC 101: `https://heloc360.com/heloc-101` (Priority: 0.9)
-   Calculators: `https://heloc360.com/calculators/*` (Priority: 0.8)
-   About: `https://heloc360.com/about` (Priority: 0.7)
-   Blog: `https://heloc360.com/blog` (Priority: 0.8)
-   Contact: `https://heloc360.com/contact` (Priority: 0.6)
-   Get Started: `https://ratequote-heloc360.secure-clix.com/` (Priority: 0.9)
-   Legal Pages: `https://heloc360.com/privacy`, `/terms`, etc. (Priority: 0.3)

### Blog Posts

-   Individual posts: `https://heloc360.com/blog/{slug}` (Priority: 0.7)
-   Change frequency: Monthly
-   Last modified: Actual publication date

### Team Members

-   Individual profiles: `https://heloc360.com/meet-our-team/{slug}` (Priority: 0.6)
-   Change frequency: Monthly

## Benefits of This Structure

1. **Scalability**: Each content type has its own sitemap
2. **Performance**: Dynamic sitemaps are cached appropriately
3. **Maintenance**: Static pages are manually controlled, dynamic content is automatic
4. **SEO**: Proper priorities and change frequencies for different content types
5. **Reliability**: Dynamic generation with proper error handling

## Maintenance

### Static Pages

-   Update `/public/sitemap-pages.xml` when adding new static pages
-   Update priorities and change frequencies as needed

### Dynamic Content

-   Blog posts and team members are automatically included
-   No manual maintenance required
-   Content is pulled from Contentful CMS

### Testing

-   Visit `https://heloc360.com/sitemap.xml` to see the index
-   Visit individual sitemaps to verify content
-   Check Google Search Console for sitemap submission status
