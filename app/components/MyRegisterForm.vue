<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const config = useRuntimeConfig()

const postRegister = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await fetch(`${config.public.apiUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value
      })
    })

    const json = await response.json()

    if (!response.ok) {
      errorMessage.value = json.message || 'Erreur lors de l’inscription'
      return
    }

    const token = json.data.token

    // Stockage du JWT
    const cookie = useCookie('recipe-token', {
      sameSite: 'lax'
    })
    cookie.value = token

    navigateTo('/dashboard')
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Impossible de contacter le serveur'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="register">
    <h1>Créer un compte</h1>

    <form class="form" @submit.prevent="postRegister">
      <MyInput
        v-model="username"
        label="Nom d'utilisateur"
        type="text"
        required
      />

      <MyInput
        v-model="email"
        label="Email"
        type="email"
        required
      />

      <MyInput
        v-model="password"
        label="Mot de passe"
        type="password"
        required
      />

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

      <MyButton :disabled="loading">
        {{ loading ? 'Création...' : 'S’inscrire' }}
      </MyButton>
    </form>

    <p class="login-link">
      Déjà un compte ?
      <NuxtLink to="/login">Se connecter</NuxtLink>
    </p>
  </section>
</template>

<style lang="scss" scoped>
.register {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: rem(24);

  h1 {
    font-size: rem(24);
  }
}

.form {
  border: 1px solid var(--color-text);
  border-radius: rem(4);
  display: flex;
  flex-direction: column;
  gap: rem(16);
  width: rem(320);
  padding: rem(24);
}

.error {
  color: red;
  font-size: rem(14);
}

.login-link {
  font-size: rem(14);

  a {
    margin-left: rem(4);
    text-decoration: underline;
  }
}
</style>