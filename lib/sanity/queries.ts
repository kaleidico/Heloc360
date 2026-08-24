// GROQ query strings.
//
// Field projection produces the BlogPost / TeamMember shape consumers expect.

/**
 * Every post, INCLUDING the full body.
 *
 * Only for consumers that genuinely need the article text. Do NOT use it to
 * build a listing: with 250 posts it serialises roughly 6 MB into the page.
 * Listings use BLOG_CARDS_QUERY below.
 */
export const ALL_BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishDate desc) {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishDate,
    "categories": coalesce(categories, []),
    featureImage,
    "featureImageAlt": featureImage.alt,
    seoTitle,
    seoDescription
  }
`

/**
 * Filter shared by the cards query and its matching count, so a listing's
 * pagination can never disagree with the rows it shows.
 *
 * `$q` is a match pattern (append `*` for prefix matching) and searches the
 * body via `pt::text()`, which keeps full-text search working server-side
 * without shipping any body text to the browser.
 */
const BLOG_FILTER = `
  _type == "blogPost"
  && (!defined($category) || $category in categories)
  && (
    !defined($q)
    || title match $q
    || excerpt match $q
    || seoDescription match $q
    || pt::text(body) match $q
    || $q in categories
  )
`

/**
 * One page of listing cards.
 *
 * `wordCount` and `autoExcerpt` are computed in GROQ rather than derived from
 * the body in JS, so read time and the fallback excerpt survive without the
 * body travelling to the client. A page of 12 is about 12 KB.
 */
export const BLOG_CARDS_QUERY = `
  *[${BLOG_FILTER}] | order(publishDate desc) [$from...$to] {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    publishDate,
    "categories": coalesce(categories, []),
    featureImage,
    "featureImageAlt": featureImage.alt,
    seoTitle,
    seoDescription,
    "wordCount": count(string::split(pt::text(body), " ")),
    "autoExcerpt": array::join(string::split(pt::text(body), " ")[0...40], " ")
  }
`

export const BLOG_CARDS_COUNT_QUERY = `count(*[${BLOG_FILTER}])`

export const BLOG_CATEGORIES_QUERY = `array::unique(*[_type == "blogPost"].categories[])`

export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishDate,
    "categories": coalesce(categories, []),
    featureImage,
    "featureImageAlt": featureImage.alt,
    seoTitle,
    seoDescription
  }
`

export const ALL_TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember"] | order(teamMemberName asc) {
    "id": _id,
    "name": teamMemberName,
    "slug": slug.current,
    title,
    email,
    phone,
    linkedIn,
    twitter,
    "bio": about,
    photo
  }
`

export const TEAM_MEMBER_BY_SLUG_QUERY = `
  *[_type == "teamMember" && slug.current == $slug][0] {
    "id": _id,
    "name": teamMemberName,
    "slug": slug.current,
    title,
    email,
    phone,
    linkedIn,
    twitter,
    "bio": about,
    photo
  }
`
