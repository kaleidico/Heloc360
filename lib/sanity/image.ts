import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from './client'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function imageUrl(source: SanityImageSource | undefined | null): string {
  if (!source) return '/placeholder.svg'
  return urlFor(source).auto('format').url()
}
