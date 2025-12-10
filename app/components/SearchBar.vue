<script setup lang="ts">
const config = useRuntimeConfig()
const search = ref('')

const { data: recipes, error: recipeError } = await useAsyncData(
  'recipes',
  async () => {
    const { data } = await $fetch<ApiResponse<Recipe[]>>(
      `${config.public.apiUrl}/recipes`
    )
    return data
  }
)

if (recipeError && recipeError.value) {
  // eslint-disable-next-line no-console
  console.error('Failed to fetch recipes inside SearchBar')
}

const Searched = computed(() => {
  if (!recipes.value) return []

  if (!search.value || search.value.trim() === '') {
    return []
  }

  const searchTerm = search.value.toLowerCase()

  return recipes.value.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      (recipe.cuisine_name &&
        recipe.cuisine_name.toLowerCase().includes(searchTerm))
  )
})
</script>

<template>
  <div class="search-bar">
    <MyInput
      v-model="search"
      placeholder="Search some recipes"
      type="text"
      class="search-bar__input"
    />

    <div v-if="Searched.length" class="search-bar__list">
      <div
        v-for="aRecipe in Searched"
        :key="aRecipe.recipe_id"
        class="search-bar__item"
      >
        <NuxtLink 
          :to="`/recipe/${aRecipe.recipe_id}`" 
          class="search-bar__link"
        >
          {{ aRecipe.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.search-bar {
  position: relative;
  flex-grow: 1;
  max-width: rem(600);
  margin: 0 rem(40);
  display: flex;
  flex-direction: column;

  &__input {
    width: 100%;
    padding: rem(10) rem(14);
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    background-color: $color-background;
    color: $color-text;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 rem(4) rgba(0, 0, 0, 0.05);
    }
  }

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: rem(4);
    z-index: 300;
    background-color: $color-background;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    box-shadow: $shadow-card;
    max-height: rem(300);
    overflow-y: auto;
  }

  &__item {
    padding: rem(10) rem(14);
    cursor: pointer;
    font-size: rem(14);
    color: $color-text;
    border-bottom: 1px solid transparent;

    &:hover {
      background-color: $color-hover;
      color: $color-primary;
    }

    &:last-child {
      border-bottom: none;
    }
  }
  &__link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
  }
}
</style>