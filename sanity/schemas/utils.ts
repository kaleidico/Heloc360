import type { SlugIsUniqueValidator } from 'sanity'

export const isUniqueAcrossAllDocuments: SlugIsUniqueValidator = async (slug, context) => {
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2024-12-01' })
  const id = document?._id?.replace(/^drafts\./, '')
  const type = document?._type
  const params = { draft: `drafts.${id}`, published: id, slug, type }
  const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && _type == $type][0]._id)`
  return await client.fetch(query, params)
}
