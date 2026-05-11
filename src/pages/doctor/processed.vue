<script setup lang="ts">
import { NButton } from 'naive-ui'
import { h } from 'vue'
import { useLoginStore, usePatientStore, useRegistrationStore } from '~/store'

const message = useMessage()
const { list, updateRegistration } = useRegistrationStore()
const { dataList: patients } = usePatientStore()
const { currentProfile } = useLoginStore()

const rows = computed(() =>
  list.value.filter(r => r.doctor_id === currentProfile.value?.id && r.status === 1),
)

function pname(id: number) {
  return patients.value.find(p => p.patient_id === id)?.real_name ?? String(id)
}

const showAdd = ref(false)
const addRow = ref<import('~/types/outpatient').Registration | null>(null)
const addText = ref('')

function openAdd(r: import('~/types/outpatient').Registration) {
  addRow.value = r
  addText.value = r.diagnosis || ''
  showAdd.value = true
}

function saveAdd() {
  if (!addRow.value)
    return
  updateRegistration(addRow.value.register_id, {
    diagnosis: addText.value,
  })
  message.success('追加诊断已保存')
  showAdd.value = false
}
</script>

<template>
  <div>
    <h3 class="mb-4 text-lg font-medium">
      已处理挂号信息
    </h3>
    <n-empty v-if="!rows.length" description="暂无已就诊记录" />
    <n-data-table
      v-else
      :columns="[
        { title: '挂号单号', key: 'register_no' },
        { title: '患者', key: 'patient_id', render: (row: any) => pname(row.patient_id) },
        { title: '就诊日', key: 'register_date' },
        { title: '时段', key: 'time_slot' },
        { title: '诊断', key: 'diagnosis', ellipsis: { tooltip: true } },
        {
          title: '操作',
          key: 'a',
          render: (row: any) =>
            h(NButton, { size: 'small', type: 'primary', tertiary: true, onClick: () => openAdd(row) }, { default: () => '追加诊断' }),
        },
      ]"
      :data="rows"
    />

    <n-modal v-model:show="showAdd" preset="dialog" title="追加诊断">
      <n-input v-model:value="addText" type="textarea" :rows="4" placeholder="补充诊断结果" />
      <template #action>
        <NButton @click="showAdd = false">
          取消
        </NButton>
        <NButton type="primary" @click="saveAdd">
          保存
        </NButton>
      </template>
    </n-modal>
  </div>
</template>
