<script setup lang="ts">
const route = useRoute()
</script>console.log(route)

<template>
  <div>
    <h1>l'article {{ route.params.slug }}</h1>
  </div>
</template>
