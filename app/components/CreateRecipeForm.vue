<!-- eslint-disable no-console -->
<script setup lang="ts">
const config = useRuntimeConfig()
const error = ref('')
const Payload = ref({
  title: '',
  description: '',
  cuisine_id: 1,
  goal_id: 1,
  image_url: '',
  DiataryInformation_id: '',
  AllergyInformation_id: ''
})

async function postCreateRecipe () {
  if (!Payload.value.title || !Payload.value.description ||
     !Payload.value.cuisine_id || !Payload.value.goal_id || Payload.value.image_url || Payload.value.DiataryInformation_id || Payload.value.AllergyInformation_id) {
    error.value = 'Tous les champs ne sont pas remplis'
  }
  try {
    const response = await fetch(`${config.public.apiUrl}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useCookie('recipe-token').value}`
      },
      body: JSON.stringify(Payload.value)
    })
    const json = await response.json()
    console.log('Recipe created successfully:', json)
  } catch (error) {
    console.error('Failed to create recipe:', error)
  }
}


const [
  { data: cuisines, error: cuisinesError },
  { data: goals, error: goalsError },
  { data: allergies, error: allergiesError },
  { data: dietaries, error: dietariesError }
] = await Promise.all([
  useAsyncData('cuisines', async () => {
    const { data } = await $fetch<ApiResponse<Cuisine[]>>(`${config.public.apiUrl}/cuisines`)
    return data
  }),
  useAsyncData('goals', async () => {
    const { data } = await $fetch<ApiResponse<Goal[]>>(`${config.public.apiUrl}/goals`)
    return data
  }),
  useAsyncData('allergies', async () => {
    const { data } = await $fetch<ApiResponse<Allergy[]>>(`${config.public.apiUrl}/allergies`)
    return data
  }),
  useAsyncData('dietaries', async () => {
    const { data } = await $fetch<ApiResponse<Diet[]>>(`${config.public.apiUrl}/dietaries`)
    return data
  })
])

if (cuisinesError.value) {
  throw new Error('Failed to fetch cuisines')
}
if (goalsError.value) {
  throw new Error('Failed to fetch goals')
}
if (allergiesError.value) {
  throw new Error('Failed to fetch allergies')
}
if (dietariesError.value) {
  throw new Error('Failed to fetch dietaries')
}
</script>

<template>
  <form class="recipe-form" @submit.prevent="postCreateRecipe">
    <h2 class="recipe-form__title">Créer une recette</h2>

    <p v-if="error" class="recipe-form__error">{{ error }}</p>

    <MyInput v-model="Payload.title" label="Titre" type="text" class="recipe-form__input" />
    <MyInput v-model="Payload.description" label="Description" type="text" class="recipe-form__input" />

    <div class="recipe-form__selects">
      <div class="recipe-form__select-group">
        <label for="cuisine" class="recipe-form__label">Cuisine</label>
        <select id="cuisine" v-model="Payload.cuisine_id" class="recipe-form__select">
          <option disabled value="">Choisir une cuisine</option>
          <option v-for="c in cuisines" :key="c.cuisine_id" :value="c.cuisine_id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div class="recipe-form__select-group">
        <label for="goal" class="recipe-form__label">Objectif</label>
        <select id="goal" v-model="Payload.goal_id" multiple class="recipe-form__select">
          <option disabled value="">Choisir un objectif</option>
          <option v-for="g in goals" :key="g.goal_id" :value="g.goal_id">
            {{ g.name }}
          </option>
        </select>
      </div>

      <div class="recipe-form__select-group">
        <label for="dietary" class="recipe-form__label">Informations diététiques</label>
        <select id="dietary" v-model="Payload.DiataryInformation_id" multiple class="recipe-form__select">
          <option disabled value="">Choisir une information diététique</option>
          <option v-for="d in dietaries" :key="d.diet_id" :value="d.diet_id">
            {{ d.name }}
          </option>
        </select>
      </div>

      <div class="recipe-form__select-group">
        <label for="allergy" class="recipe-form__label">Informations allergènes</label>
        <select id="allergy" v-model="Payload.AllergyInformation_id" multiple class="recipe-form__select">
          <option disabled value="">Choisir une information allergène</option>
          <option v-for="a in allergies" :key="a.allergy_id" :value="a.allergy_id">
            {{ a.name }}
          </option>
        </select>
      </div>
    </div>

    <MyInput v-model="Payload.image_url" label="Image URL" type="text" class="recipe-form__input" />

    <MyButton class="recipe-form__submit">Créer la recette</MyButton>
  </form>
</template>


<style lang="scss">

.recipe-form {
  max-width: rem(500);
  margin: 0 auto;
  padding: rem(24);
  background-color: $color-background;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: rem(16);

  @media (max-width: $medium-breakpoint) {
    padding: rem(16);
  }

  @media (max-width: $small-breakpoint) {
    padding: rem(12);
  }

  &__title {
    font-size: rem(22);
    font-weight: 700;
    color: $color-primary;
    text-align: center;
  }

  &__error {
    font-size: rem(14);
    color: #E53935; // rouge pour erreur
    text-align: center;
  }

  &__input {
    width: 100%;
    margin-bottom: rem(8);
  }

  &__selects {
    display: flex;
    flex-wrap: wrap;
    gap: rem(16);

    @media (max-width: $medium-breakpoint) {
      flex-direction: column;
    }
  }

  &__select-group {
    display: flex;
    flex-direction: column;
    flex: 1 1 rem(200);
    gap: rem(4);
  }

  &__label {
    font-size: rem(14);
    font-weight: 500;
    color: $color-text;
  }

  &__select {
    padding: rem(8);
    border: 1px solid $color-border;
    border-radius: $radius-md;
    font-size: rem(14);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: $btn-border-focus;
      box-shadow: $btn-focus-shadow;
      outline: none;
    }
  }

  &__submit {
    margin-top: rem(12);
    align-self: center;
    padding: $btn-padding-medium;
    font-size: $btn-font-size-medium;
    font-weight: 600;
    color: $btn-text-default;
    background-color: $btn-bg-default;
    border-radius: $btn-radius;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $btn-bg-hover;
    }

    &:disabled {
      background-color: $btn-bg-disabled;
      color: $btn-text-disabled;
      cursor: not-allowed;
    }
  }
}


</style>