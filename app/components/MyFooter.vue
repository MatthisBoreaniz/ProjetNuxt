<script setup lang="ts">
import type { SanitySiteSettings } from '@/types/cms/site-settings'

const query = groq`*[_type == "siteSettings"][0]`
const { data: siteSettings } = await useLazySanityQuery<SanitySiteSettings>(query)

const { urlFor } = useSanityImage()
</script>

<template>
  <footer class="footer">
    <div class="footer__top">
      <!-- Navigation -->
      <div class="footer__nav">
        <div class="footer__section-title">Navigation</div>
        <ul class="footer__list">
          <NuxtLink
            v-for="item in siteSettings.navigation"
            :key="item.label"
            :to="item.url"
            class="footer__link"
          >
            {{ item.label }}
          </NuxtLink>
        </ul>
      </div>

      <!-- Réseaux sociaux -->
      <div class="footer__nav">
        <div class="footer__section-title">Réseaux sociaux</div>
        <ul class="footer__list">
          <NuxtLink
            v-for="item in siteSettings.socialLinks"
            :key="item.label"
            :to="item.url"
            class="footer__link"
          >
            {{ item.label }}
          </NuxtLink>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <span>© 2026 {{ siteSettings.title }}. Tous droits réservés.</span>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: $color-background-reverse;
  color: $color-text-reverse;
  padding: rem(24);
  display: flex;
  flex-direction: column;
  gap: rem(16);

  &__top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: rem(24);
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: rem(12);
  }

  &__section-title {
    font-weight: 600;
    font-size: rem(14);
    text-transform: uppercase;
    margin-bottom: rem(8);
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: rem(6);
  }

  &__link {
    display: block;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: $color-primary;
    }
  }

  &__bottom {
    border-top: 1px solid $color-border;
    padding-top: rem(12);
    font-size: rem(12);
    text-align: center;
    color: $color-text-reverse;
  }

  /* 🔹 Responsive */
  @media (max-width: 768px) {
    &__top {
      flex-direction: column;
      gap: rem(16);
    }

    &__list {
      flex-direction: row;
      flex-wrap: wrap;
      gap: rem(12);
    }

    &__link {
      font-size: rem(12);
    }
  }

  @media (max-width: 480px) {
    &__list {
      flex-direction: column;
      gap: rem(6);
    }

    &__link {
      font-size: rem(11);
    }
  }
}
</style>
