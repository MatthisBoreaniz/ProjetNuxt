import type { SanityDocument } from '@sanity/client'
import type { SanityImageSource } from '@sanity/image-url'

type SanityBook = SanityDocument & {
  title: string;
  slug: { current: string };
  publishedAt: string;
  author: SanityAuthor;
  categories: SanityCategory[];
  image: SanityImageSource;
  body: array[block];
}

type SanityAuthor = SanityDocument & {
  nom: string;
  slug: { current: string };
  publishedAt: string;
  image: SanityImageSource;
  body: array[block];
}

type SanityCategory = SanityDocument & {
  nom: string;
  slug: { current: string };
  publishedAt: string;
  image: SanityImageSource;
  body: array[block];
}