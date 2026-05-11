<script setup lang="ts">
import dayjs from 'dayjs'
import { useDepartmentStore, usePatientStore, useRegistrationStore } from '~/store'

const { list: registrations } = useRegistrationStore()
const { dataList: departments } = useDepartmentStore()
const { dataList: patients } = usePatientStore()

const today = dayjs().format('YYYY-MM-DD')

const todayRegs = computed(() =>
  registrations.value.filter(r => r.register_date === today && r.status !== 2),
)

const stats = computed(() => ({
  departments: departments.value.filter(d => d.status === 1).length,
  patients: patients.value.length,
  todayAppointments: todayRegs.value.length,
  pendingPay: registrations.value.filter(r => r.status === 0 && r.is_paid === 0).length,
}))
</script>

<template>
  <div>
    <h2 class="mb-6 text-xl font-semibold text-slate-800">
      管理首页
    </h2>
    <n-grid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
      <n-gi>
        <n-card title="启用科室">
          <div class="text-3xl font-bold text-teal-600">
            {{ stats.departments }}
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="患者档案数">
          <div class="text-3xl font-bold text-teal-600">
            {{ stats.patients }}
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="今日预约量">
          <div class="text-3xl font-bold text-teal-600">
            {{ stats.todayAppointments }}
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="待缴挂号费">
          <div class="text-3xl font-bold text-amber-600">
            {{ stats.pendingPay }}
          </div>
        </n-card>
      </n-gi>
    </n-grid>
    <n-card class="mt-6" title="今日挂号动态">
      <n-empty v-if="!todayRegs.length" description="今日暂无挂号记录" />
      <n-list v-else bordered>
        <n-list-item v-for="r in todayRegs" :key="r.register_id">
          <div class="flex flex-wrap gap-2 text-sm">
            <n-tag>{{ r.register_no }}</n-tag>
            <span>时段 {{ r.time_slot }}</span>
            <n-tag :type="r.is_paid ? 'success' : 'warning'">
              {{ r.is_paid ? '已缴费' : '未缴费' }}
            </n-tag>
            <n-tag :type="r.status === 1 ? 'info' : 'default'">
              {{ r.status === 0 ? '待就诊' : r.status === 1 ? '已就诊' : '已取消' }}
            </n-tag>
          </div>
        </n-list-item>
      </n-list>
    </n-card>
  </div>
</template>
