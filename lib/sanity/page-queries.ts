export const PAGE_BY_SLUG_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    sections,
    seoTitle,
    seoDescription,
    canonicalUrl,
    noindex
  }
`

export const ALL_PAGE_SLUGS_QUERY = `*[_type == "page"]{ "slug": slug.current }`
