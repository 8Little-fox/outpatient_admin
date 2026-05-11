<script setup lang="ts">
import type { RoleType } from '~/types/outpatient'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '~/store'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const { login } = useLoginStore()

const form = reactive({
  role: '患者' as RoleType,
  account: '',
  password: '',
})
const loading = ref(false)

const accountPlaceholder = computed(() => {
  if (form.role === '医生')
    return '医生工号'
  if (form.role === '管理员')
    return '管理员用户名'
  return '患者用户名'
})

function handleLogin() {
  const a = form.account.trim()
  const p = form.password
  if (!a || !p) {
    message.warning('请输入账号和密码')
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    const res = login(form.role, a, p)
    if (!res.ok) {
      message.error(res.message || '用户名或密码错误')
      return
    }
    message.success('登录成功')
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      router.replace(redirect)
      return
    }
    if (form.role === '管理员')
      router.replace('/back')
    else if (form.role === '医生')
      router.replace('/doctor')
    else
      router.replace('/home')
  }, 200)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100">
    <div class="login w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">
      <h1 class="mb-2 text-center text-2xl font-semibold text-slate-800">
        门诊管理系统
      </h1>
      <p class="mb-6 text-center text-sm text-slate-500">
        多角色身份验证（管理员 / 医生 / 患者）
      </p>
      <n-space vertical :size="14">
        <div>
          <div class="mb-1 text-sm text-slate-600">
            登录身份
          </div>
          <n-radio-group v-model:value="form.role" name="role" class="w-full">
            <n-space>
              <n-radio value="管理员">
                管理员
              </n-radio>
              <n-radio value="医生">
                医生
              </n-radio>
              <n-radio value="患者">
                患者
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>
        <n-input
          v-model:value="form.account"
          size="large"
          :placeholder="accountPlaceholder"
          @keydown.enter.prevent="handleLogin"
        />
        <n-input
          v-model:value="form.password"
          size="large"
          type="password"
          show-password-on="click"
          placeholder="密码"
          @keydown.enter.prevent="handleLogin"
        />
        <n-button type="primary" block size="large" :loading="loading" @click="handleLogin">
          登录
        </n-button>
        <div class="flex justify-between text-sm">
          <n-button text type="primary" @click="router.push('/register')">
            患者注册
          </n-button>
          <n-button text type="primary" @click="router.push('/forgot-password')">
            找回密码
          </n-button>
        </div>
      </n-space>
      <p class="mt-6 text-center text-xs leading-relaxed text-slate-400">
        演示：管理员 admin001 / 123456；医生工号 D001 / 123456；患者 patient001 / 123456
      </p>
    </div>
  </div>
</template>
