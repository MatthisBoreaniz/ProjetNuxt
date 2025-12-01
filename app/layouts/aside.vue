<template>
  <div class="ly-aside">
    <aside class="ly-aside__sidebar">Sidebar</aside>
    <main>
      Contenu de la page
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.ly-aside {
  display: flex;
  flex-flow: row wrap;

  &__sidebar {
    flex: 1;    
  }

  main {
    flex: 4;
  }
}
</style>
