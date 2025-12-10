<script setup lang="ts">
import type { SanitySiteSettings } from '@/types/cms/site-settings'
const query = groq`*[_type == "siteSettings"][0]`
const { data } = await useLazySanityQuery<SanitySiteSettings>(query)
console.log('Site Settings:', data)
</script>

<template>
  <div>
    <MyHeader/>
    <NuxtLink to="/books">Books</NuxtLink>
    <main class="ly-default">
      <slot />
    </main>
    <MyFooter/>
  </div>
</template>
