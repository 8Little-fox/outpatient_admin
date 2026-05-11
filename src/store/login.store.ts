import type { LoginSession, RoleType } from '~/types/outpatient'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { useAdminStore } from './admin.store'
import { useCacheStore } from './cache.store'
import { useDoctorStore } from './doctor.store'
import { usePatientStore } from './patient.store'

export const useLoginStore = createGlobalState(() => {
  const session = useLocalStorage<LoginSession | null>('outpatient-session', null)
  const { setToken, removeToken } = useCacheStore()

  const isLogin = computed(() => !!session.value)

  const currentRole = computed(() => session.value?.role ?? null)

  const currentProfile = computed(() => {
    if (!session.value)
      return null
    const { role, account } = session.value
    if (role === '管理员') {
      const { dataList } = useAdminStore()
      const a = dataList.value.find(x => x.username === account)
      if (!a)
        return null
      return {
        role,
        username: a.username,
        displayName: a.real_name,
        id: a.admin_id,
      }
    }
    if (role === '医生') {
      const { dataList } = useDoctorStore()
      const d = dataList.value.find(x => x.doctor_no === account)
      if (!d)
        return null
      return {
        role,
        username: d.doctor_no,
        displayName: d.name,
        id: d.doctor_id,
        department_id: d.department_id,
      }
    }
    const { dataList } = usePatientStore()
    const p = dataList.value.find(x => x.username === account)
    if (!p)
      return null
    return {
      role,
      username: p.username,
      displayName: p.real_name,
      id: p.patient_id,
    }
  })

  function login(role: RoleType, account: string, password: string) {
    if (role === '管理员') {
      const { dataList } = useAdminStore()
      const u = dataList.value.find(x => x.username === account && x.password === password)
      if (!u)
        return { ok: false, message: '用户名或密码错误' }
      if (u.status !== 1)
        return { ok: false, message: '账号已被禁用' }
      const token = `mock-admin-${u.admin_id}`
      session.value = { role, account, token }
      setToken(token)
      return { ok: true }
    }
    if (role === '医生') {
      const { dataList } = useDoctorStore()
      const u = dataList.value.find(x => x.doctor_no === account && x.password === password)
      if (!u)
        return { ok: false, message: '用户名或密码错误' }
      if (u.status !== 1)
        return { ok: false, message: '账号已离职停用' }
      const token = `mock-doctor-${u.doctor_id}`
      session.value = { role, account: u.doctor_no, token }
      setToken(token)
      return { ok: true }
    }
    const { dataList } = usePatientStore()
    const u = dataList.value.find(x => x.username === account && x.password === password)
    if (!u)
      return { ok: false, message: '用户名或密码错误' }
    if (u.status !== 1)
      return { ok: false, message: '账号已被禁用' }
    const token = `mock-patient-${u.patient_id}`
    session.value = { role, account: u.username, token }
    setToken(token)
    return { ok: true }
  }

  function logout() {
    session.value = null
    removeToken()
  }

  /** 找回密码：按角色匹配账号后重置为默认密码 */
  function resetPassword(role: RoleType, account: string, newPassword: string) {
    if (!newPassword)
      return { ok: false, message: '新密码不能为空' }
    if (role === '管理员') {
      const { dataList, updateData } = useAdminStore()
      const i = dataList.value.findIndex(x => x.username === account)
      if (i < 0)
        return { ok: false, message: '未找到该管理员账号' }
      updateData(i, { ...dataList.value[i]!, password: newPassword })
      return { ok: true, message: '密码已重置，请使用新密码登录' }
    }
    if (role === '医生') {
      const { dataList, updateData } = useDoctorStore()
      const i = dataList.value.findIndex(x => x.doctor_no === account)
      if (i < 0)
        return { ok: false, message: '未找到该医生工号' }
      updateData(i, { ...dataList.value[i]!, password: newPassword })
      return { ok: true, message: '密码已重置' }
    }
    const { dataList, updateData } = usePatientStore()
    const i = dataList.value.findIndex(x => x.username === account)
    if (i < 0)
      return { ok: false, message: '未找到该患者用户名' }
    updateData(i, { ...dataList.value[i]!, password: newPassword })
    return { ok: true, message: '密码已重置' }
  }

  return {
    session,
    isLogin,
    currentRole,
    currentProfile,
    login,
    logout,
    resetPassword,
  }
})
