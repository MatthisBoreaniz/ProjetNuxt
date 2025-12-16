<script setup lang="ts">
import type { SanitySiteSettings } from '@/types/cms/site-settings'

const query = groq`*[_type == "siteSettings"][0]`
const { data: siteSettings } = await useLazySanityQuery<SanitySiteSettings>(query)

const { urlFor } = useSanityImage()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = () => {
  const cookie = useCookie('recipe-token')
  cookie.value = null
  navigateTo('/login')
}

</script>

<template>
  <header class="header">
    <div class="header__top">
      <ul class="header__nav-list">
        <li v-for="item in siteSettings.navigation" :key="item.label" class="header__nav-item">
          <NuxtLink :to="item.url" class="header__nav-link">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <ul class="header__auth-list">
        <NuxtLink
          v-for="item in siteSettings.authLink"
          :key="item.label"
          :to="item.url"
          class="header__auth-link"
        >
          <li class="header__auth-item">
            <img
              v-if="item.icon"
              :src="urlFor(item.icon)?.width(550).height(310).url()"
              :alt="item?.label"
              class="header__auth-icon"
              width="550"
              height="310"
            >{{ item.label }}
          </li>
        </NuxtLink>
        
        <MyButton variant="quit" class="header__logout-btn" @click="logout">
          <li class="header__logout-content">
            <img src="/assets/icones/logout.png" alt="logout" class="header__logout-icon">
            Logout
          </li>
        </MyButton>
      </ul>
    </div>

    <div class="header__main">
      <div class="header__logo-section">
        <NuxtLink to="/" class="header__logo-link">
          <img
            v-if="siteSettings.logo"
            :src="urlFor(siteSettings.logo)?.width(550).height(310).url()"
            :alt="siteSettings.label"
            class="header__logo"
            width="550"
            height="310"
          >
          <MyTitle variant="accent"><strong>{{ siteSettings.title }}</strong></MyTitle>
        </NuxtLink>
      </div>

      <SearchBar />

      <section class="header__actions">
        <div class="header__user-menu">
          <img
            class="header__avatar"
            src="/assets/icones/pfp.png"
            alt="pfp"
            @click="toggleMenu"
          >

          <ul v-show="isMenuOpen" class="header__dropdown">
            <NuxtLink
              v-for="item in siteSettings.navigation2"
              :key="item.label"
              :to="item.url"
              class="header__dropdown-link"
            >
              <li class="header__dropdown-item">{{ item.label }}</li>
            </NuxtLink>
            
            <MyButton
              class="header__dropdown-logout"
              variant="quit"
              @click="logout"
            >
              <li class="header__dropdown-text">Logout</li>
            </MyButton>
          </ul>
        </div>
      </section>
    </div>
  </header>
</template>

<style lang="scss">
.header {
  &__top {
    background-color: $color-background-reverse;
    color: $color-text-reverse;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(8) rem(16);
    font-size: rem(12);
  }

  &__nav-list,
  &__auth-list {
    display: flex;
    align-items: center;
    gap: rem(24);
    list-style: none;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    font-weight: 600;
  }
  
  &__nav-item,
  &__auth-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: rem(8);
  }

  &__auth-icon {
    height: rem(14);
    width: auto;
  }

  &__auth-link {
    text-decoration: none;
    color: inherit;
    display: flex;
  }

  &__nav-link {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s;

    &:hover {
      color: $color-primary;
    }
  }

  &__main {
    background-color: $color-background;
    color: $color-text;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(16) rem(32);
    border-bottom: 1px solid $color-border;
  }

  &__logo-link {
    display: flex;
    align-items: center;
    gap: rem(12);
    text-decoration: none;
    color: inherit;
  }

  &__logo {
    height: rem(50);
    width: auto;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: rem(24);
  }

  &__user-menu {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: rem(45);
    height: rem(45);
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 0 0 2px $color-primary;
    }
  }

  &__dropdown {
    position: absolute;
    top: 120%;
    right: 0;
    width: rem(200);
    background-color: $color-background;
    box-shadow: $shadow-card;
    border-radius: $radius-sm;
    padding: rem(8) 0;
    list-style: none;
    z-index: 100;
    transform-origin: top right;
  }

  &__dropdown-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  &__dropdown-item {
    padding: rem(10) rem(16);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: rem(12);
    font-size: rem(14);
    color: $color-text;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-hover;
    }
  }

  &__logout-content {
    list-style: none;
    display: flex;
    align-items: center;
    gap: rem(8);
  }

  &__logout-icon {
    height: rem(14);
    width: auto;
  }

  &__dropdown-logout {
    width: 100%;
    border-radius: 0;
    justify-content: flex-start;
    padding: rem(10) rem(16);
  }

  &__dropdown-text {
    list-style: none;
  }
}
</style>