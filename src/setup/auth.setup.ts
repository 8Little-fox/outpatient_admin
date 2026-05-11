import type { Router } from 'vue-router'
import { useLoginStore } from '~/store'

export function authSetup(router: Router) {
  router.beforeEach((to, _from, next) => {
    const { isLogin, currentRole } = useLoginStore()

    if (to.path === '/register' || to.path === '/forgot-password') {
      next()
      return
    }

    if (to.path.startsWith('/home')) {
      if (!isLogin.value) {
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
      if (currentRole.value === '医生') {
        next({ path: '/doctor' })
        return
      }
    }

    if (to.path.startsWith('/back')) {
      if (!isLogin.value) {
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
      if (currentRole.value !== '管理员') {
        next(currentRole.value === '医生' ? '/doctor' : '/home')
        return
      }
    }

    if (to.path.startsWith('/doctor')) {
      if (!isLogin.value) {
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
      if (currentRole.value !== '医生') {
        next(currentRole.value === '管理员' ? '/back' : '/home')
        return
      }
    }

    if (to.path === '/login' && isLogin.value) {
      const r = currentRole.value
      next(r === '管理员' ? '/back' : r === '医生' ? '/doctor' : '/home')
      return
    }

    next()
  })
}
