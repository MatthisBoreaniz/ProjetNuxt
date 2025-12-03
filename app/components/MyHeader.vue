<script setup lang="ts">
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = () => {
  const cookie = useCookie('recipe-token')
  cookie.value = null
  navigateTo('/login')
}

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

const search = ref('')

const Searched = computed(() => {
  if (!recipes.value) return []

  if (!search.value || search.value.trim() === '') {
    return [] 
  }

  const searchTerm = search.value.toLowerCase()
  
  return recipes.value.filter((recipe) => 
    recipe.title.toLowerCase().includes(searchTerm) ||
    (recipe.cuisine_name && recipe.cuisine_name.toLowerCase().includes(searchTerm))
  )
})
</script>

<template>
  <header class="header">
    
    <div class="header__top">
      <ul class="header__nav-list">
        <li class="header__nav-item">Community</li>
        <li class="header__nav-item">Books</li>
        <li class="header__nav-item">Recipe Index</li>
        <li class="header__nav-item">Popular</li>
      </ul>
      
      <ul class="header__auth-list">
        <NuxtLink to="/register">
          <li class="header__auth-item"><img src="/assets/icones/register.png" alt="register">Register</li>
        </NuxtLink>
        <NuxtLink to="/login">
          <li class="header__auth-item"><img src="/assets/icones/login.png" alt="login">Login</li>
        </NuxtLink>
        <MyButton variant="quit" @click=logout>
          <li><img src="/assets/icones/logout.png" alt="logout">Logout</li>
        </MyButton>
      </ul>
    </div>

    <div class="header__main">
      <div class="header__logo-section">
        <NuxtLink to='/' class="header__logo-link">
          <img class="header__logo" src="/assets/icones/logo.png" alt="LogoLarge">
          <MyTitle variant="accent"><strong>CookingApi</strong></MyTitle>
        </NuxtLink>
      </div>
      
      <div class="header__search">
        <MyInput v-model="search" placeholder="Search some recipes" type="text" />
        
        <div v-if="Searched.length" class="header__search-list">
          <div 
            v-for="aRecipe in Searched" 
            :key="aRecipe.recipe_id" 
            class="header__search-item"
          >
            {{ aRecipe.title }}
          </div>
        </div>

      </div>
      
      <section class="header__actions">
        <div class="header__user-menu">
          <img 
            class="header__avatar" 
            src="/assets/icones/pfp.png" 
            alt="pfp" 
            @click="toggleMenu" 
          >
          
          <ul v-show="isMenuOpen" class="header__dropdown">
            <NuxtLink to="/dashboard" class="header__dropdown-link">
              <li class="header__dropdown-item">Dashboard</li>
            </NuxtLink>
            <li class="header__dropdown-item">Privacy</li>
            <li class="header__dropdown-item">Collections</li>
            <li class="header__dropdown-item">Settings</li>
            <MyButton class="header__auth-logout" variant="quit" @click="logout">
              <li>Logout</li>
            </MyButton>
          </ul>
        </div>
      </section>
    </div>
  </header>
</template>

<style lang="scss">
.header {
  &__top {
    background-color: $color-background-reverse;
    color: $color-text-reverse;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(8) rem(16); 
    font-size: rem(12);
    
    & > ul > a > li {
      text-decoration: none;
    }
  }

  &__nav-list,
  &__auth-list {
    display: flex;
    align-items: center;
    gap: rem(24);
    list-style: none;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    font-weight: 600;

    li {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: rem(8); 
      
      img {
        height: rem(14); 
        width: auto;
      }
    }
  }

  &__main {
    background-color: $color-background;
    color: $color-text;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(16) rem(32);
    border-bottom: 1px solid $color-border;
  }

  &__logo-link {
    display: flex;
    align-items: center;
    gap: rem(12);
    text-decoration: none;
    color: inherit;
  }

  &__logo {
    height: rem(50); 
    width: auto;
  }

  &__search {
    position: relative;
    flex-grow: 1; 
    max-width: rem(600);
    margin: 0 rem(40);
    display: flex;
    flex-direction: column;


    input[type="text"] {
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


    &-list {
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

    &-item {
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
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: rem(24);
  }

  &__user-menu {
    position: relative; 
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: rem(45);
    height: rem(45);
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 0 0 2px $color-primary; 
    }
  }

  &__dropdown {
    position: absolute;
    top: 120%; 
    right: 0; 
    width: rem(200);
    background-color: $color-background;
    box-shadow: $shadow-card; 
    border-radius: $radius-sm;
    padding: rem(8) 0;
    list-style: none;
    z-index: 100;
    transform-origin: top right;
  }

  &__dropdown-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  &__dropdown-item {
    padding: rem(10) rem(16);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: rem(12);
    font-size: rem(14);
    color: $color-text;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-hover; 
    }
  }
  
  &__auth-logout {
     width: 100%;
     border-radius: 0;
     justify-content: flex-start;
     padding: rem(10) rem(16);
     
     li {
       list-style: none;
     }
  }
}
</style>