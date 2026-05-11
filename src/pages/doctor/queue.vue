<script setup lang="ts">
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useLoginStore, usePatientStore, useRegistrationStore } from '~/store'

const router = useRouter()
const { list, updateRegistration } = useRegistrationStore()
const { dataList: patients } = usePatientStore()
const { currentProfile } = useLoginStore()
const today = dayjs().format('YYYY-MM-DD')

const rows = computed(() =>
  list.value.filter(
    r =>
      r.doctor_id === currentProfile.value?.id
      && r.register_date === today
      && r.status === 0,
  ),
)

function pname(id: number) {
  return patients.value.find(p => p.patient_id === id)?.real_name ?? String(id)
}

function receive(r: import('~/types/outpatient').Registration) {
  updateRegistration(r.register_id, { visiting: true })
  router.push({ path: '/doctor/consult', query: { id: String(r.register_id) } })
}
</script>

<template>
  <div>
    <h3 class="mb-4 text-lg font-medium">
      当日待诊患者队列
    </h3>
    <n-empty v-if="!rows.length" description="暂无待就诊挂号" />
    <n-list v-else bordered>
      <n-list-item v-for="r in rows" :key="r.register_id">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <n-tag type="info">
              {{ r.register_no }}
            </n-tag>
            <span class="ml-2 font-medium">{{ pname(r.patient_id) }}</span>
            <span class="ml-2 text-slate-500">{{ r.time_slot }}</span>
            <n-tag class="ml-2" :type="r.is_paid ? 'success' : 'warning'" size="small">
              {{ r.is_paid ? '已缴费' : '未缴费' }}
            </n-tag>
          </div>
          <n-button type="primary" @click="receive(r)">
            接诊
          </n-button>
        </div>
      </n-list-item>
    </n-list>
  </div>
</template>
