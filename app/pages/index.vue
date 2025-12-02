<script setup lang="ts">
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
        recipe.cuisine_name.toLowerCase().includes(searchTerm)
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
  <div>
    <MyTitle uppercase>Bienvenue sur la page d'accueil</MyTitle>
    <input
      v-model="search"
      type="text"
      placeholder="Rechercher une recette..."
    >
    <div class="pagination">
      <p>page : {{ page }} sur {{ totalPages }}</p>
      <span
        v-for="n in totalPages"
        :key="`page-${n}`"
        @click="onPageClick(n)"
      >{{ n }}</span
      >
    </div>
    <p>Filtre actif : {{ filters }}</p>
    <MyTitle uppercase>Cuisines disponibles</MyTitle>
    <ul>
      <li v-for="(cuisine, index) in cuisines" :key="index">
        <input
          :id="cuisine.name"
          type="checkbox"
          :value="cuisine.name"
          @input="onInputCheckbox"
        >
        <label :for="cuisine.name">{{ cuisine.name }}</label>
      </li>
    </ul>
    <ul>
      <li
        v-for="(uneRecette, index) in displayedRecipes"
        :key="index"
        v-bind="uneRecette"
      >
        <NuxtImg
          :src="`/recipes/${uneRecette.image_url}`"
          :alt="uneRecette.title"
          width="200"
          height="150"
        />
        <NuxtLink :to="`/recipe/${uneRecette.recipe_id}`">
          {{ uneRecette.title }}
        </NuxtLink>
        <NuxtLink :to="`/cuisine/${uneRecette.recipe_id}`">
          <p>Cuisine : {{ uneRecette.cuisine_name }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
.pagination {
  span {
    cursor: pointer;
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
}
</style>
