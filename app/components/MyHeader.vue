<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
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
        <li class="header__auth-item"><img src="" alt="logout">Register</li>
        <li class="header__auth-item"><img src="" alt="usericon">Login</li>
      </ul>
    </div>

    <div class="header__main">
      <img class="header__logo" src="" alt="LogoLarge">
      
      <div class="header__search">searchBar</div>
      
      <section class="header__actions">
        <img class="header__cart-icon" src="" alt="panier">
        
        <div class="header__user-menu">
          <img 
            class="header__avatar" 
            src="" 
            alt="pfp" 
            @click="toggleMenu" 
          >
          
          <ul v-show="isMenuOpen" class="header__dropdown">
            <li class="header__dropdown-item">Profile</li>
            <li class="header__dropdown-item">Privacy</li>
            <li class="header__dropdown-item">Collections</li>
            <li class="header__dropdown-item">Settings</li>
            <li class="header__dropdown-item header__dropdown-item--danger">Logout</li>
          </ul>
        </div>
      </section>
    </div>
  </header>
</template>

<style lang="scss">


.header {
  width: 100%;

  &__top {
    background-color: $color-background-reverse;
    color: $color-text-reverse;
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: rem(8) rem(16); 
    font-size: rem(12);
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

  &__logo {

    height: rem(50); 
    width: auto;
  }

  &__search {
    flex-grow: 1; 
    max-width: rem(600);
    margin: 0 rem(40); 

  }

  &__actions {
    display: flex;
    align-items: center;
    gap: rem(24);
  }

  &__cart-icon {
    width: rem(28);
    height: auto;
    cursor: pointer;
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
    &--danger {
      color: red; 
      border-top: 1px solid $color-border;
      margin-top: rem(4);
    }
  }
}
</style>
