<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const logout = () => {
  const cookie = useCookie('recipe-token')
  cookie.value = null
  navigateTo('/login')
}
</script>

<template>
  <div class="p-dashboard">
    <h1>Dashboard</h1>
    <button @click="logout">
      Se déconnecter
    </button>
  </div>
</template>

<style scoped lang="scss">
div {
  background-color: white;
  min-height: 100vh; // s'assure que le fond couvre toute la hauteur de la page
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

.text {
  color: black;
}

</style>