// GROQ query strings.
//
// Field projection produces the BlogPost / TeamMember shape consumers expect.

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
    updatedAt,
    author->{
      "name": teamMemberName,
      "slug": slug.current,
      title,
      photo
    },
    seoTitle,
    seoDescription
  }
`

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
    updatedAt,
    author->{
      "name": teamMemberName,
      "slug": slug.current,
      title,
      photo
    },
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
