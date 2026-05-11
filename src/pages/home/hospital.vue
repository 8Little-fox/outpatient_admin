<script setup lang="ts">
import { useBedStore, useHospitalizationStore, useLoginStore } from '~/store'

const { list } = useHospitalizationStore()
const { dataList: beds } = useBedStore()
const { currentProfile } = useLoginStore()

const mine = computed(() =>
  list.value.filter(h => h.patient_id === currentProfile.value?.id),
)

function bedNo(id: number) {
  return beds.value.find(b => b.bed_id === id)?.bed_no ?? id
}
</script>

<template>
  <div>
    <n-h2 prefix="bar">
      查看住院
    </n-h2>
    <n-empty v-if="!mine.length" description="暂无住院记录" />
    <n-table v-else :single-line="false" size="small">
      <thead>
        <tr>
          <th>住院号</th>
          <th>床位</th>
          <th>入院日期</th>
          <th>出院日期</th>
          <th>状态</th>
          <th>费用</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in mine" :key="h.hospitalization_id">
          <td>{{ h.hospital_no }}</td>
          <td>{{ bedNo(h.bed_id) }}</td>
          <td>{{ h.admission_date }}</td>
          <td>{{ h.discharge_date || '—' }}</td>
          <td>{{ h.status === 0 ? '住院中' : '已出院' }}</td>
          <td>¥{{ h.total_cost }}</td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
