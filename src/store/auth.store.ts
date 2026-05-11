import { createGlobalState } from '@vueuse/core'
import { computed } from 'vue'
import { useCacheStore } from './cache.store'
import { useLoginStore } from './login.store'

/** 会话信息来自 store + localStorage，无远程鉴权 */
export const useAuthStore = createGlobalState(() => {
  const { token } = useCacheStore()
  const { currentProfile, logout } = useLoginStore()

  const userInfo = computed(() => {
    const p = currentProfile.value
    if (!p)
      return undefined
    return {
      username: p.username,
      realname: p.displayName,
      usertype: p.role,
    }
  })

  async function logoutUser() {
    logout()
  }

  async function infoUser() {
    /* 无远程拉取 */
  }

  return {
    userInfo,
    token,
    logoutUser,
    infoUser,
  }
})
