<script setup lang="ts">
import dayjs from 'dayjs'
import { useLoginStore, useRegistrationStore } from '~/store'

const { list } = useRegistrationStore()
const { currentProfile } = useLoginStore()
const today = dayjs().format('YYYY-MM-DD')

const myToday = computed(() =>
  list.value.filter(
    r =>
      r.doctor_id === currentProfile.value?.id
      && r.register_date === today
      && r.status !== 2,
  ),
)

const stats = computed(() => ({
  total: myToday.value.length,
  pending: myToday.value.filter(r => r.status === 0 && !r.visiting).length,
  visiting: myToday.value.filter(r => r.visiting).length,
  done: myToday.value.filter(r => r.status === 1).length,
}))

const pendingQueue = computed(() => myToday.value.filter(r => r.status === 0))
</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-semibold text-slate-800">
      当日预约患者统计
    </h2>
    <n-grid :cols="4" :x-gap="12" responsive="screen">
      <n-gi>
        <n-statistic label="今日预约总数" :value="stats.total" />
      </n-gi>
      <n-gi>
        <n-statistic label="待接诊" :value="stats.pending" />
      </n-gi>
      <n-gi>
        <n-statistic label="就诊中" :value="stats.visiting" />
      </n-gi>
      <n-gi>
        <n-statistic label="已完成" :value="stats.done" />
      </n-gi>
    </n-grid>
    <n-card class="mt-6" title="按挂号顺序的待诊队列（摘要）">
      <n-empty v-if="!pendingQueue.length" description="暂无待就诊患者" />
      <n-timeline v-else>
        <n-timeline-item
          v-for="r in pendingQueue"
          :key="r.register_id"
          :title="r.register_no"
          :time="r.time_slot"
        >
          缴费：{{ r.is_paid ? '已缴' : '未缴' }}
        </n-timeline-item>
      </n-timeline>
    </n-card>
  </div>
</template>
