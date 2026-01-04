<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Tableau des recettes
const recipes = ref<Recipe[]>([])
const loading = ref(false)
const errorMessage = ref('')

// Props pour configurer l'API
const props = defineProps<{
  apiUrl?: string
}>()

const config = useRuntimeConfig()

/**
 * Récupère toutes les recettes
 */
const fetchRecipes = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${props.apiUrl || config.public.apiUrl}/recipes`)
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

/**
 * Supprimer une recette (auth requise)
 */
const deleteRecipe = async (id: number) => {
  if (!confirm('Voulez-vous vraiment supprimer cette recette ?')) return

  try {
    // Récupère le token JWT
    const cookie = useCookie('recipe-token')
    const token = cookie.value

    if (!token) {
      alert('Vous devez être connecté pour supprimer une recette')
      return
    }

    const response = await fetch(`${props.apiUrl || config.public.apiUrl}/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const json = await response.json()

    if (!response.ok) {
      alert(json.message || 'Erreur lors de la suppression')
      return
    }

    // Retire la recette du tableau
    recipes.value = recipes.value.filter(r => r.recipe_id !== id)
  } catch (error) {
    console.error(error)
    alert('Impossible de contacter le serveur')
  }
}

// On récupère les recettes au montage
onMounted(() => fetchRecipes())
</script>

<template>
  <div class="recipes-list">
    <div v-if="loading" class="recipes-list__loading">Chargement des recettes...</div>
    <div v-if="errorMessage" class="recipes-list__error">{{ errorMessage }}</div>

    <div
      v-for="recipe in recipes"
      :key="recipe.recipe_id"
      class="recipes-list__item"
    >
      <div class="recipes-list__info">
        <span class="recipes-list__title">{{ recipe.title }}</span>
        <span class="recipes-list__description">{{ recipe.description }}</span>
      </div>
      <button
        class="recipes-list__delete"
        @click="deleteRecipe(recipe.recipe_id)"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>


<style lang="scss" scoped>

.recipes-list {
  display: flex;
  flex-direction: column;
  gap: rem(12);

  &__loading,
  &__error {
    font-size: rem(14);
    text-align: center;
  }

  &__error {
    color: #E53935; // rouge pour erreur
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(12);
    border-radius: $radius-md;
    background-color: $color-background;
    border: 1px solid $color-border;
    box-shadow: $shadow-card;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    @media (max-width: $medium-breakpoint) {
      flex-direction: column;
      align-items: flex-start;
      gap: rem(8);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: rem(4);
  }

  &__title {
    font-size: rem(16);
    font-weight: 600;
    color: $color-text;
  }

  &__description {
    font-size: rem(14);
    color: $color-text; // pas de variable secondaire
  }

  &__delete {
    background-color: $btn-quit-bg-default;
    color: $btn-quit-text-default;
    border: none;
    border-radius: $radius-sm;
    padding: $btn-padding-small;
    font-size: $btn-font-size-medium;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background-color: $btn-quit-bg-hover;
    }

    &:active {
      background-color: $btn-quit-bg-pressed;
    }

    &:disabled {
      background-color: $btn-bg-disabled;
      color: $btn-quit-text-disabled;
      cursor: not-allowed;
    }

    @media (max-width: $medium-breakpoint) {
      align-self: flex-end;
    }
  }
}

</style>
