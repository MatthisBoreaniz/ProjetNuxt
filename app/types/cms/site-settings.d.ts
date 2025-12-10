import type { sanityDocument } from '@sanity/client'
import type { SanityImageSource } from '@sanity/image-url'

export type SanitySiteSettings = sanityDocument & {
  title: string;
  description: string;
  logo: SanityImageSource;
  navigation: NavigationItem[];
  navigation2: Navigation2Item[];
  authLink: authLink[];
}

type NavigationItem = {
  label: string;
  url: string;
}

type Navigation2Item = {
  label: string;
  url: string;
}

type AuthLink = {
  label: string;
  url: string;
  icon: SanityImageSource;
}
