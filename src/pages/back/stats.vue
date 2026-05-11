<script setup lang="ts">
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { usePatientStore, useRegistrationStore } from '~/store'

const pieRef = ref<HTMLDivElement | null>(null)
const barRef = ref<HTMLDivElement | null>(null)

const { list: registrations } = useRegistrationStore()
const { dataList: patients } = usePatientStore()

onMounted(() => {
  const male = patients.value.filter(p => p.gender === 1).length
  const female = patients.value.filter(p => p.gender === 0).length
  if (pieRef.value) {
    const chart = echarts.init(pieRef.value)
    chart.setOption({
      title: { text: '患者性别年龄构成（性别）', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '65%',
          data: [
            { value: male, name: '男' },
            { value: female, name: '女' },
          ],
        },
      ],
    })
  }

  const days = Array.from({ length: 7 }, (_, i) => dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD'))
  const counts = days.map(d => registrations.value.filter(r => r.register_date === d && r.status !== 2).length)
  if (barRef.value) {
    const chart2 = echarts.init(barRef.value)
    chart2.setOption({
      title: { text: '近7日挂号趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: days },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{ type: 'bar', data: counts, itemStyle: { color: '#0d9488' } }],
    })
  }
})
</script>

<template>
  <div>
    <h3 class="mb-4 text-lg font-medium text-slate-800">
      数据统计
    </h3>
    <n-grid :cols="2" :x-gap="16" responsive="screen">
      <n-gi>
        <div ref="pieRef" class="h-[360px] w-full rounded-lg bg-white p-2 shadow" />
      </n-gi>
      <n-gi>
        <div ref="barRef" class="h-[360px] w-full rounded-lg bg-white p-2 shadow" />
      </n-gi>
    </n-grid>
  </div>
</template>
