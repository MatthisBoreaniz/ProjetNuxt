<script setup lang="ts">
import { ref, onMounted } from 'vue'

const recipes = ref<Recipe[]>([])
const loading = ref(false)
const errorMessage = ref('')

const config = useRuntimeConfig()

// MÃ©thode pour fetcher les recettes
const fetchRecipes = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${config.public.apiUrl}/recipes`)
    const json = await response.json()

    if (!response.ok) {
      errorMessage.value = json.message || 'Erreur lors du chargement des recettes'
      return
    }

    recipes.value = json.data
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Impossible de contacter le serveur'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchRecipes())
</script>

<template>
  <div class="recipes-page">
    <div class="recipes-title">
      <span class="text-lg font-bold">Recettes</span>
    </div>

    <div v-if="loading" class="recipes-loading">
      <span class="text-sm text-muted">Chargement des recettes...</span>
    </div>

    <div v-if="errorMessage" class="recipes-error">
      <span class="text-sm text-red">{{ errorMessage }}</span>
    </div>

    <div class="recipes-grid">
      <div
        v-for="recipe in recipes"
        :key="recipe.image_url"
        class="recipe-card"
      >
        <div v-if="recipe.image_url" class="recipe-image-wrapper">
          <NuxtImg
            :src="`/recipes/${recipe.image_url}`"
            :alt="recipe.title"
            width="200"
            height="150"
          />
        </div>

        <div class="recipe-title text-md font-semibold">
          {{ recipe.title }}
        </div>

        <div class="recipe-description text-sm text-muted">
          {{ recipe.description }}
        </div>

        <NuxtLink
          :to="`/recipe/${recipe.recipe_id}`"
          class="recipe-link text-primary underline text-sm"
        >
          Voir la recette
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recipes-page {
  padding: rem(24);

  .recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(rem(220), 1fr));
    gap: rem(16);
    margin-top: rem(16);
  }

  .recipe-card {
    border: 1px solid var(--color-text);
    border-radius: rem(8);
    padding: rem(16);
    display: flex;
    flex-direction: column;
    gap: rem(8);
    background-color: var(--color-bg);
  }

  .recipe-image-wrapper {
    width: 100%;
    height: rem(140);
    overflow: hidden;
    border-radius: rem(4);
  }

  .recipe-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .text-primary {
    color: var(--color-primary);
  }

  .text-red {
    color: red;
  }

  .text-muted {
    color: var(--color-text-secondary);
  }

  .text-lg {
    font-size: rem(28);
  }

  .text-md {
    font-size: rem(18);
  }

  .text-sm {
    font-size: rem(14);
  }

  .font-bold {
    font-weight: 700;
  }

  .font-semibold {
    font-weight: 600;
  }

  .recipe-link {
    margin-top: auto;
  }
}
</style>