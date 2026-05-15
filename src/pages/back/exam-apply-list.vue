<script setup lang="ts">
import type { ExamApplication } from '~/types/outpatient'
import { NButton, NSpace } from 'naive-ui'
import { h } from 'vue'
import { useExamApplicationStore, useExamItemStore, usePatientStore } from '~/store'

const message = useMessage()
const { list, pay, completeCheck } = useExamApplicationStore()
const { dataList: patients } = usePatientStore()
const { dataList: items } = useExamItemStore()

const resultText = ref('')
const pickId = ref<number | null>(null)
const show = ref(false)

function pname(id: number) {
  return patients.value.find(p => p.patient_id === id)?.real_name ?? id
}
function iname(id: number) {
  return items.value.find(i => i.item_id === id)?.item_name ?? id
}

function openFinish(row: ExamApplication) {
  pickId.value = row.application_id
  resultText.value = row.check_result || '未见明显异常'
  show.value = true
}

function saveFinish() {
  if (pickId.value == null)
    return
  completeCheck(pickId.value, resultText.value)
  message.success('已录入检查结果并出具报告时间')
  show.value = false
}

const columns = [
  { title: '申请单号', key: 'application_no' },
  { title: '患者', key: 'patient_id', render: (row: ExamApplication) => pname(row.patient_id) },
  { title: '项目', key: 'item_id', render: (row: ExamApplication) => iname(row.item_id) },
  { title: '缴费', key: 'is_paid', render: (row: ExamApplication) => (row.is_paid ? '已缴' : '未缴') },
  { title: '状态', key: 'status', render: (row: ExamApplication) => (row.status === 0 ? '待检查' : row.status === 1 ? '已完成' : '已取消') },
  {
    title: '操作',
    key: 'a',
    render: (row: ExamApplication) =>
      h(NSpace, { size: 8 }, () => [
        row.is_paid === 0
          ? h(NButton, {
              size: 'small',
              type: 'warning',
              onClick: () => {
                pay(row.application_id)
                message.success('已标记检查费缴纳')
              },
            }, { default: () => '代缴费' })
          : null,
        row.status === 0 && row.is_paid === 1
          ? h(NButton, { size: 'small', type: 'primary', onClick: () => openFinish(row) }, { default: () => '录入结果' })
          : null,
      ].filter(Boolean) as any),
  },
]
</script>

<template>
  <div>
    <h3 class="mb-4 text-lg font-medium">
      检查申请执行（录入结果）
    </h3>
    <n-data-table
      :columns="columns"
      :data="list"
    />

    <n-modal v-model:show="show" preset="dialog" title="检查结果">
      <n-input v-model:value="resultText" type="textarea" :rows="5" />
      <template #action>
        <NButton @click="show = false">
          取消
        </NButton>
        <NButton type="primary" @click="saveFinish">
          保存
        </NButton>
      </template>
    </n-modal>
  </div>
</template>
