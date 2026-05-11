<script setup lang="ts">
import type { Bed } from '~/types/outpatient'
import ActionButton from '~/components/ActionButton.vue'
import BackCrudModal from '~/components/BackCrudModal.vue'
import ColorColumn from '~/components/ColorColumn.vue'
import { useBedStore, useDepartmentStore } from '~/store'
import { nextNumericId } from '~/utils/outpatient'

const store = useBedStore()
const { dataList: departments } = useDepartmentStore()
const {
  dataList,
  page,
  onUpdatePage,
  removeData,
  openModalState,
  openModal,
  updateTitle,
  closeModal,
  changeModal,
  saveForm,
  updateDataIndex,
  isUpdate,
} = store

function deptName(id: number) {
  return departments.value.find(d => d.department_id === id)?.dept_name ?? '-'
}

function statusText(s: number) {
  if (s === 0)
    return '占用'
  if (s === 1)
    return '空闲'
  return '维修'
}

function confirmSave() {
  if (!isUpdate.value) {
    changeModal.value.bed_id = nextNumericId(dataList.value, 'bed_id')
    changeModal.value.status = changeModal.value.status ?? 1
    changeModal.value.patient_id = changeModal.value.patient_id ?? null
  }
  saveForm()
}

const columns = [
  { title: '床号', key: 'bed_no' },
  { title: '科室', key: 'department_id', render: (row: Bed) => deptName(row.department_id) },
  { title: '病房', key: 'room_no' },
  { title: '类型', key: 'bed_type' },
  { title: '日费用', key: 'price_per_day', render: (row: Bed) => `¥${row.price_per_day}` },
  {
    title: '状态',
    key: 'status',
    render: (row: Bed) => h(ColorColumn, { text: statusText(row.status), danger: row.status === 0 }),
  },
  {
    title: '操作',
    key: 'action',
    render: (row: Bed, index: number) =>
      h(ActionButton, {
        onDelete: () => removeData(index),
        isDel: true,
        onEdit: () => openModal(row, index),
      }),
  },
]
</script>

<template>
  <div>
    <n-button type="primary" class="!mb-4" @click="openModal()">
      新增病床
    </n-button>
    <n-data-table :columns="columns" :data="dataList" :pagination="{ page, onUpdatePage }" />
    <BackCrudModal
      v-model:show="openModalState"
      :title="updateTitle"
      card-class="!max-w-[560px]"
      @confirm="confirmSave"
      @cancel="closeModal"
    >
      <n-form :model="changeModal" label-placement="left" label-width="96px">
        <n-form-item label="病床编号">
          <n-input v-model:value="changeModal.bed_no" :disabled="updateDataIndex >= 0" />
        </n-form-item>
        <n-form-item label="科室">
          <n-select
            v-model:value="changeModal.department_id"
            :options="departments.filter(d => d.status === 1).map(d => ({ label: d.dept_name, value: d.department_id }))"
          />
        </n-form-item>
        <n-form-item label="病房号">
          <n-input v-model:value="changeModal.room_no" />
        </n-form-item>
        <n-form-item label="床位类型">
          <n-input v-model:value="changeModal.bed_type" />
        </n-form-item>
        <n-form-item label="每日费用">
          <n-input-number v-model:value="changeModal.price_per_day" class="w-full" :min="0" :precision="2" />
        </n-form-item>
        <n-form-item label="床位状态">
          <n-select
            v-model:value="changeModal.status"
            :options="[
              { label: '占用', value: 0 },
              { label: '空闲', value: 1 },
              { label: '维修', value: 2 },
            ]"
          />
        </n-form-item>
      </n-form>
    </BackCrudModal>
  </div>
</template>
