<script setup lang="ts">
useHead({
  title: 'Accueil - Mon Application de Recettes',
  meta: [
    {
      name: 'description',
      content: 'bienvenue sur la page d\'accueil du site de recette' }
  ]
})
const config = useRuntimeConfig()
const [{ data: recipes, error: recipeError }, { data: cuisines, error: cuisineError }] =
  await Promise.all([
    useAsyncData('recipes', async () => {
      const { data } = await $fetch<ApiResponse<Recipe[]>>(
        `${config.public.apiUrl}/recipes`
      )
      return data
    }),
    useAsyncData('cuisines', async () => {
      const { data } = await $fetch<ApiResponse<Cuisine[]>>(
        `${config.public.apiUrl}/cuisines`
      )
      return data
    })
  ])

if (recipeError && recipeError.value) {
  throw new Error('Failed to fetch recipes')
}
if (cuisineError && cuisineError.value) {
  throw new Error('Failed to fetch cuisines')
}

const filters = ref<Cuisine['name'][]>([])

function onInputCheckbox ($event: Event) {
  const target = $event.target
  if (!(target instanceof HTMLInputElement)) return
  const value = target.value
  if (!filters.value.includes(value)) {
    filters.value.push(value)
  } else {
    filters.value = filters.value.filter((c) => c !== value)
  }
}

const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return []
  let result = recipes.value

  if (filters.value.length > 0) {
    result = result.filter((recipe) =>
      filters.value.includes(recipe.cuisine_name)
    )
  }

  if (search.value.length) {
    const searchTerm = search.value.toLowerCase()
    result = result.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        (recipe.cuisine_name && recipe.cuisine_name.toLowerCase().includes(searchTerm))
    )
  }

  return result
})

const page = ref(1)
const perPage = 2

const displayedRecipes = computed(() => {
  if (!filteredRecipes.value) return []
  return filteredRecipes.value.slice(
    (page.value - 1) * perPage,
    page.value * perPage
  )
})

const totalPages = computed<number>(() => {
  return Math.ceil(filteredRecipes.value.length / perPage)
})

function onPageClick (index: number) {
  page.value = index
}

const search = ref('')

watch(() => [search.value, filters.value], () => {
  page.value = 1
})
</script>

<template>
  <div class="home-container">
    <MyTitle uppercase>Bienvenue sur la page d'accueil</MyTitle>
    <input
      class="search-input"
      v-model="search"
      type="text"
      placeholder="Rechercher une recette..."
    >
    <div class="pagination-wrapper">
      <p class="pagination-text">page : {{ page }} sur {{ totalPages }}</p>
      <div class="pagination-buttons">
        <span
          v-for="n in totalPages"
          :key="`page-${n}`"
          class="pagination-button"
          @click="onPageClick(n)"
        >{{ n }}</span>
      </div>
    </div>
    <p class="filters-text">Filtre actif : {{ filters }}</p>
    <MyTitle uppercase>Cuisines disponibles</MyTitle>
    <ul class="cuisines-list">
      <li class="cuisine-item" v-for="(cuisine, index) in cuisines" :key="index">
        <input
          class="cuisine-checkbox"
          :id="cuisine.name"
          type="checkbox"
          :value="cuisine.name"
          @input="onInputCheckbox"
        >
        <label class="cuisine-label" :for="cuisine.name">{{ cuisine.name }}</label>
      </li>
    </ul>
    <ul class="recipes-list">
      <li
        class="recipe-item"
        v-for="(uneRecette, index) in displayedRecipes"
        :key="index"
        v-bind="uneRecette"
      >
        <NuxtImg
          class="recipe-image"
          :src="`/recipes/${uneRecette.image_url}`"
          :alt="uneRecette.title"
          width="200"
          height="150"
        />
        <NuxtLink class="recipe-title" :to="`/recipe/${uneRecette.recipe_id}`">
          {{ uneRecette.title }}
        </NuxtLink>
        <NuxtLink class="recipe-cuisine" :to="`/cuisine/${uneRecette.recipe_id}`">
          <p>Cuisine : {{ uneRecette.cuisine_name }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
}

.pagination-wrapper {
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 15px 0;
  }
}

.pagination-text {
  margin-bottom: 10px;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.pagination-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.pagination-button {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: #f0f0f0;
    border-color: #999;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 12px;
  }
}

.filters-text {
  margin: 15px 0;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.cuisines-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;

  @media (max-width: 768px) {
    gap: 10px;
  }
}

.cuisine-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cuisine-checkbox {
  cursor: pointer;
  width: 18px;
  height: 18px;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
}

.cuisine-label {
  cursor: pointer;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.recipes-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.recipe-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px;
    gap: 8px;
  }
}

.recipe-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

.recipe-title {
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.recipe-cuisine {
  text-decoration: none;
  color: #666;
  font-size: 14px;

  & p {
    margin: 0;
  }

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
}
</style>
