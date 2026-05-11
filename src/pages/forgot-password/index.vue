<script setup lang="ts">
import type { RoleType } from '~/types/outpatient'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '~/store'

const router = useRouter()
const message = useMessage()
const { resetPassword } = useLoginStore()

const form = reactive({
  role: '患者' as RoleType,
  account: '',
  newPassword: '',
  confirm: '',
})
const loading = ref(false)

function submit() {
  if (!form.account.trim() || !form.newPassword) {
    message.warning('请填写账号与新密码')
    return
  }
  if (form.newPassword !== form.confirm) {
    message.error('两次输入的新密码不一致')
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    const res = resetPassword(form.role, form.account.trim(), form.newPassword)
    if (!res.ok) {
      message.error(res.message || '重置失败')
      return
    }
    message.success(res.message || '已重置')
    router.replace('/login')
  }, 200)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 class="mb-2 text-center text-xl font-semibold text-slate-800">
        找回密码
      </h1>
      <p class="mb-6 text-center text-sm text-slate-500">
        选择身份并输入账号，验证通过后将密码更新为新密码（演示环境无短信验证）
      </p>
      <n-space vertical :size="14">
        <n-radio-group v-model:value="form.role" name="role">
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
        <n-input v-model:value="form.account" placeholder="管理员用户名 / 医生工号 / 患者用户名" />
        <n-input v-model:value="form.newPassword" type="password" placeholder="新密码" show-password-on="click" />
        <n-input v-model:value="form.confirm" type="password" placeholder="确认新密码" show-password-on="click" />
        <n-button type="primary" block :loading="loading" @click="submit">
          重置密码
        </n-button>
        <n-button quaternary block @click="router.push('/login')">
          返回登录
        </n-button>
      </n-space>
    </div>
  </div>
</template>
