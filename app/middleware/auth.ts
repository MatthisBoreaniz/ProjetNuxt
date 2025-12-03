import { jwtDecode } from 'jwt-decode'
const token = useCookie('recipe-token')

export default defineNuxtRouteMiddleware(() => {
  if (!token || !token.value || !token.value.length) {
    return navigateTo('/login')
  }
  const decoded = jwtDecode(token.value)
  if (!(decoded.exp && decoded.exp > (Date.now() / 1000))) {
    return navigateTo('/login')
  }
})