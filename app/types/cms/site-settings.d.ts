import type { sanityDocument } from '@sanity/client'
import type { SanityImageSource } from '@sanity/image-url'

export type SanitySiteSettings = sanityDocument & {
  title: string;
  description: string;
  logo: SanityImageSource;
  navigation: NavigationItem[];
}

type NavigationItem = {
  label: string;
  url: string;
}
