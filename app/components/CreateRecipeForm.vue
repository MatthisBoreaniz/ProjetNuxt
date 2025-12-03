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


const { data: cuisines } = await useAsyncData<Cuisine[]>('cuisines', async () => {
  const response = await $fetch<{ data: Cuisine[] }>(`${config.public.apiUrl}/cuisines`)
  return response.data
})

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
        <option value="1">Perte de Poids</option>
        <option value="2">Riche en protéines</option>
        <option value="3">Riche en nutriments</option>
        <option value="4">Faible en calories</option>
        <option value="5">Rapide et facile</option>
        <option value="6">Adapté aux familles</option>
        <option value="7">Économique</option>
        <option value="8">Occasions spéciales</option>
      </select>

      <MyInput v-model="Payload.image_url" label="Image URL" type="text" />
      <MyInput v-model="Payload.DiataryInformation_id" label="Diatary Information ID" type="text" />
      <MyInput v-model="Payload.AllergyInformation_id" label="Allergy Information ID" type="text" />
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