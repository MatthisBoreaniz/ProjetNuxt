<script setup lang="ts">
const email = ref('')
const password = ref('')

const postLogin = () => {
  console.log(email.value, password.value)
}

watch(
  () => email.value,
  (value) => {
    if (value === 'matthis@gmail.com') {
      alert('Email correct')
    }
  },
)
</script>

<template>
  <form class="form" @submit.prevent="postLogin">
    <MyInput v-model="password" label="Password" type="password" />
    <MyInput v-model="email" label="Email" type="email"  />
    <MyButton>Se connecter</MyButton>
  </form>
</template>

<style lang="scss">
.form {
  border: 1px solid var(--color-text);
  border-radius: rem(4);
  display: flex;
  flex-direction: column;
  gap: rem(16);
  width: rem(300);
  padding: rem(16);
}
</style>
