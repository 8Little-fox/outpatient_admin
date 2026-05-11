import { watchEffect } from 'vue'
import { useAuthStore, useCacheStore } from '~/store'
import { setupFetch } from './fetch.setup'

export * from './auth.setup'

function setupApp() {
  setupFetch()
  import.meta.env.DEV && addCustomeDevtoolsTab()
}

setupApp()

function addCustomeDevtoolsTab() {
  const authStore = useAuthStore()
  const cacheStore = useCacheStore()

  watchEffect(() => {
    Object.entries(authStore).forEach(([key, value]) => {
      if (typeof value !== 'function' && key !== 'infoUser' && key !== 'logoutUser') {
        const v = value && typeof value === 'object' && 'value' in value ? (value as { value: unknown }).value : value
        console.warn('auth', key, v)
      }
    })

    Object.entries(cacheStore).forEach(([key, value]) => {
      if (typeof value !== 'function') {
        console.warn('cache', key, value.value)
      }
    })
  })
}
