<script setup lang="ts">
import type { Schedule } from '~/types/outpatient'
import dayjs from 'dayjs'
import { NButton } from 'naive-ui'
import { useDepartmentStore, useDoctorStore, useScheduleStore } from '~/store'
import { nextNumericId } from '~/utils/outpatient'

const message = useMessage()
const { dataList, page, onUpdatePage, updateData, addData, removeData } = useScheduleStore()
const { dataList: doctors } = useDoctorStore()
const { dataList: departments } = useDepartmentStore()

function isDateDisabled(ts: number) {
  const d = dayjs(ts)
  if (d.isBefore(dayjs(), 'day'))
    return true
  return d.isAfter(dayjs().add(30, 'day'), 'day')
}

const showAdd = ref(false)
const form = reactive({
  work_date: dayjs().format('YYYY-MM-DD'),
  department_id: null as number | null,
  doctor_id: null as number | null,
  time_slot: '上午',
  max_patients: 20,
})

const datePickerValue = computed<number | null>({
  get: () => (form.work_date ? dayjs(form.work_date).valueOf() : null),
  set: (v) => {
    form.work_date = v ? dayjs(v).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  },
})

const doctorsInDept = computed(() => {
  if (!form.department_id)
    return []
  return doctors.value.filter(d => d.department_id === form.department_id && d.status === 1)
})

function openAdd() {
  form.work_date = dayjs().format('YYYY-MM-DD')
  form.department_id = departments.value[0]?.department_id ?? null
  form.doctor_id = null
  form.time_slot = '上午'
  form.max_patients = 20
  showAdd.value = true
}

function saveSchedule() {
  if (!form.work_date || !form.department_id || !form.doctor_id) {
    message.warning('请选择日期、科室与医生')
    return
  }
  const dup = dataList.value.some(
    s =>
      s.doctor_id === form.doctor_id
      && s.work_date === form.work_date
      && s.time_slot === form.time_slot,
  )
  if (dup) {
    message.error('该医生在该日该时段已存在排班')
    return
  }
  addData({
    schedule_id: nextNumericId(dataList.value, 'schedule_id'),
    doctor_id: form.doctor_id,
    department_id: form.department_id,
    work_date: form.work_date,
    time_slot: form.time_slot,
    max_patients: form.max_patients,
    booked_count: 0,
    status: 1,
  })
  message.success('排班成功')
  showAdd.value = false
}

function stopSchedule(row: Schedule) {
  const i = dataList.value.findIndex(s => s.schedule_id === row.schedule_id)
  if (i < 0)
    return
  updateData(i, { ...dataList.value[i]!, status: 0 })
  message.warning('已设为停诊，该时段不再接受新预约')
}

function delRow(row: Schedule) {
  const i = dataList.value.findIndex(s => s.schedule_id === row.schedule_id)
  if (i >= 0)
    removeData(i)
}

function deptName(id: number) {
  return departments.value.find(d => d.department_id === id)?.dept_name ?? '-'
}
function docName(id: number) {
  return doctors.value.find(d => d.doctor_id === id)?.name ?? '-'
}

const columns = [
  { title: '日期', key: 'work_date' },
  { title: '科室', key: 'department_id', render: (row: Schedule) => deptName(row.department_id) },
  { title: '医生', key: 'doctor_id', render: (row: Schedule) => docName(row.doctor_id) },
  { title: '时段', key: 'time_slot' },
  { title: '号源', key: 'booked_count', render: (row: Schedule) => `${row.booked_count}/${row.max_patients}` },
  {
    title: '状态',
    key: 'status',
    render: (row: Schedule) => (row.status === 1 ? '正常' : '停诊'),
  },
  {
    title: '操作',
    key: 'a',
    render: (row: Schedule) =>
      h('div', { class: 'flex gap-2' }, [
        row.status === 1
          ? h(NButton, { size: 'small', tertiary: true, onClick: () => stopSchedule(row) }, { default: () => '设置停诊' })
          : null,
        h(NButton, { size: 'small', type: 'error', quaternary: true, onClick: () => delRow(row) }, { default: () => '删除' }),
      ].filter(Boolean) as any),
  },
]
</script>

<template>
  <div>
    <n-alert type="info" class="!mb-4" title="值班安排">
      选择排班日期（仅未来 30 天内）、科室与医生，设置时段与最大接诊人数；停诊后该时段不再接受新预约。
    </n-alert>
    <n-space class="!mb-4">
      <NButton type="primary" @click="openAdd">
        新增排班
      </NButton>
    </n-space>
    <n-data-table :columns="columns" :data="dataList" :pagination="{ page, onUpdatePage }" />

    <n-modal v-model:show="showAdd" preset="card" title="新增排班" class="max-w-lg">
      <n-form label-placement="left" label-width="96">
        <n-form-item label="排班日期">
          <n-date-picker
            v-model:value="datePickerValue"
            type="date"
            class="w-full"
            :is-date-disabled="isDateDisabled"
          />
        </n-form-item>
        <n-form-item label="科室">
          <n-select
            v-model:value="form.department_id"
            :options="departments.filter(d => d.status === 1).map(d => ({ label: d.dept_name, value: d.department_id }))"
            @update:value="() => { form.doctor_id = null }"
          />
        </n-form-item>
        <n-form-item label="值班医生">
          <n-select
            v-model:value="form.doctor_id"
            :options="doctorsInDept.map(d => ({ label: `${d.name}（${d.doctor_no}）`, value: d.doctor_id }))"
            placeholder="请先选择科室"
          />
        </n-form-item>
        <n-form-item label="时段">
          <n-select
            v-model:value="form.time_slot"
            :options="[
              { label: '上午', value: '上午' },
              { label: '下午', value: '下午' },
            ]"
          />
        </n-form-item>
        <n-form-item label="最大接诊">
          <n-input-number v-model:value="form.max_patients" :min="1" :max="200" class="w-full" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <NButton @click="showAdd = false">
            取消
          </NButton>
          <NButton type="primary" @click="saveSchedule">
            保存排班
          </NButton>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
