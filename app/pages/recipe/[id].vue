<script setup lang="ts">

const config = useRuntimeConfig()
const route = useRoute()
const { id } = route.params

const { data: recipe, error } = useAsyncData(
  `recipe-${route.params.recipe_id}`,
  async () => {
    const { data } = await $fetch<ApiResponse<FullRecipe>>(
      `${config.public.apiUrl}/recipes/${id}`
    )
    return data
  }
)
if (error && error.value) throw new Error('Failed to fetch recipe')

useHead({
  title: `${recipe.value ? recipe.value.title : 'Recette'} - Mon Application de Recettes`,
  meta: [
    {
      name: 'description',
      content: recipe.value?.description }
  ]
})
</script>

<template>
  <div class="recipe-page">
    <MyTitle class="recipe-page__title" uppercase>
      Détail de la recette
    </MyTitle>

    <div v-if="recipe" class="recipe-page__content">
      <h2 class="recipe-page__name">{{ recipe.title }}</h2>
      <p class="recipe-page__description">{{ recipe.description }}</p>

      <div class="recipe-page__section">
        <h3 class="recipe-page__section-title">Ingrédients :</h3>
        <ul class="recipe-page__ingredients">
          <li
            v-for="ingredient in recipe.ingredients"
            :key="ingredient.ingredient_id"
            class="recipe-page__ingredient"
          >
            {{ ingredient.quantity }} {{ ingredient.unit }} de {{ ingredient.name }}
          </li>
        </ul>
      </div>

      <div class="recipe-page__section">
        <h3 class="recipe-page__section-title">Instructions :</h3>
        <ol class="recipe-page__instructions">
          <li
            v-for="(step, index) in recipe.instructions"
            :key="index"
            class="recipe-page__instruction"
          >
            {{ step.step_number }}. {{ step.description }}
          </li>
        </ol>
      </div>
    </div>

    <div v-else class="recipe-page__loading">
      Chargement de la recette...
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .recipe-page {
  max-width: 800px;
  margin: 0 auto;
  padding: rem(24);
  display: flex;
  flex-direction: column;
  gap: rem(16);

  @media (max-width: 768px) {
    padding: rem(16);
  }

  &__title {
    font-size: rem(28);
    font-weight: 700;
    text-align: center;
    color: var(--color-primary);

    @media (max-width: 480px) {
      font-size: rem(24);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: rem(16);
    background-color: var(--color-bg-alt);
    padding: rem(20);
    border-radius: rem(12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &__name {
    font-size: rem(24);
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: rem(8);

    @media (max-width: 480px) {
      font-size: rem(20);
    }
  }

  &__description {
    font-size: rem(16);
    color: var(--color-text-reverse);
    line-height: 1.6;

    @media (max-width: 480px) {
      font-size: rem(14);
    }
  }

  &__section {
    margin-top: rem(12);
    display: flex;
    flex-direction: column;
    gap: rem(8);
  }

  &__section-title {
    font-size: rem(18);
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: rem(8);

    @media (max-width: 480px) {
      font-size: rem(16);
    }
  }

  &__ingredients,
  &__instructions {
    padding-left: rem(20);
    display: flex;
    flex-direction: column;
    gap: rem(6);
  }

  &__ingredient,
  &__instruction {
    font-size: rem(14);
    color: var(--color-text-reverse);
    line-height: 1.5;

    @media (max-width: 480px) {
      font-size: rem(13);
    }
  }

  &__loading {
    font-size: rem(16);
    color: var(--color-text-reverse);
    text-align: center;
  }
}
</style>