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
    <div v-if="loading" class="text-sm text-muted">Chargement des recettes...</div>
    <div v-if="errorMessage" class="text-sm text-red">{{ errorMessage }}</div>

    <div v-for="recipe in recipes" :key="recipe.recipe_id" class="recipe-item">
      <div class="recipe-info">
        <span class="text-md font-semibold">{{ recipe.title }}</span>
        <span class="text-sm text-muted">{{ recipe.description }}</span>
      </div>
      <button class="btn-delete" @click="deleteRecipe(recipe.recipe_id)">Supprimer</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recipes-list {
  display: flex;
  flex-direction: column;
  gap: rem(12);

  .recipe-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--color-text);
    padding: rem(12);
    border-radius: rem(6);
    background-color: var(--color-bg);
  }

  .recipe-info {
    display: flex;
    flex-direction: column;
    gap: rem(4);

    .text-md {
      font-size: rem(16);
    }

    .text-sm {
      font-size: rem(14);
    }

    .text-muted {
      color: var(--color-text-secondary);
    }

    .font-semibold {
      font-weight: 600;
    }
  }

  .btn-delete {
    background-color: red;
    color: white;
    padding: rem(6) rem(12);
    border: none;
    border-radius: rem(4);
    cursor: pointer;
    font-size: rem(14);
    transition: background 0.2s;

    &:hover {
      background-color: darkred;
    }
  }

  .text-red {
    color: red;
  }
}
</style>
