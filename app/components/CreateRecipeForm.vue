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
  <form class="form" @submit.prevent="postCreateRecipe">
    <MyInput v-model="Payload.title" label="Title" type="text" />
    <MyInput v-model="Payload.description" label="Description" type="text" />
    <div class="select-group">
      <label for="cuisine">Cuisine</label>

      <select id="cuisine" v-model="Payload.cuisine_id">
        <option disabled value="">Choisir une cuisine</option>

        <option v-for="c in cuisines" :key="c.cuisine_id" :value="c.cuisine_id">
          {{ c.name }}
        </option>
      </select>

      <label for="goal">Goal</label>
      <select id="goal" v-model="Payload.goal_id" multiple>
        <option disabled value="">Choisir un objectif</option>
        <option v-for="g in goals" :key="g.goal_id" :value="g.goal_id">
          {{ g.name }}
        </option>
      </select>

      <label for="dietary">Dietary Information</label>
      <select id="dietary" v-model="Payload.DiataryInformation_id" multiple>
        <option disabled value="">Choisir une information diététique</option>
        <option v-for="d in dietaries" :key="d.diet_id" :value="d.diet_id">
          {{ d.name }}
        </option>
      </select>
      <label for="allergy">Allergy Information</label>
      <select id="allergy" v-model="Payload.AllergyInformation_id" multiple>
        <option disabled value="">Choisir une information allergène</option>
        <option v-for="a in allergies" :key="a.allergy_id" :value="a.allergy_id">
          {{ a.name }}
        </option>
      </select>

      <MyInput v-model="Payload.image_url" label="Image URL" type="text" />
    </div>
    <MyButton>Creer la recette</MyButton>
  </form>
</template>

<style lang="scss">
.form {
  border: 1px solid var(--color-text);
  border-radius: rem(4);
  display: flex;
  flex-direction: column;
  gap: rem(16);
  width: rem(400);
  padding: rem(16);
}
</style>