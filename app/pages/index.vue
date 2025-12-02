<script setup lang="ts">
const config = useRuntimeConfig()
const { data: recipes, error } = useAsyncData('recipes', async () => {
  const { data } = await $fetch<ApiResponse<Recipe[]>>(`${config.public.apiUrl}/recipes`)
  return data
})

if (error && error.value) throw new Error('Failed to fetch recipes')
</script>

<template>
  <div>
    <MyTitle uppercase>Bienvenue sur la page d'accueil</MyTitle>
    <ul>
      <li
        v-for="(uneRecette, index) in recipes"
        :key="index"
        v-bind="uneRecette"
      >
        <NuxtLink :to="`/recipe/${uneRecette.recipe_id}`">{{
          uneRecette.title
        }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
