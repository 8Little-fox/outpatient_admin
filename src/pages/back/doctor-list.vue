<script setup lang="ts">
import type { Doctor } from '~/types/outpatient'
import ActionButton from '~/components/ActionButton.vue'
import BackCrudModal from '~/components/BackCrudModal.vue'
import ColorColumn from '~/components/ColorColumn.vue'
import { useDepartmentStore, useDoctorStore } from '~/store'
import { nextNumericId } from '~/utils/outpatient'

const store = useDoctorStore()
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

function deptName(id?: number) {
  if (!id)
    return '-'
  return departments.value.find(d => d.department_id === id)?.dept_name ?? '-'
}

function confirmSave() {
  if (!isUpdate.value) {
    changeModal.value.doctor_id = nextNumericId(dataList.value, 'doctor_id')
    changeModal.value.status = changeModal.value.status ?? 1
    changeModal.value.gender = changeModal.value.gender ?? 1
  }
  saveForm()
}

function exportSelected() {
  const blob = new Blob([JSON.stringify(dataList.value, null, 2)], { type: 'application/json;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `医生信息_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

const columns = [
  { title: '工号', key: 'doctor_no' },
  { title: '姓名', key: 'name' },
  { title: '科室', key: 'department_id', render: (row: Doctor) => deptName(row.department_id) },
  { title: '职称', key: 'title' },
  { title: '电话', key: 'phone' },
  {
    title: '状态',
    key: 'status',
    render: (row: Doctor) => h(ColorColumn, { text: row.status === 1 ? '在职' : '离职', danger: row.status !== 1 }),
  },
  {
    title: '操作',
    key: 'action',
    render: (row: Doctor, index: number) =>
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
    <n-space class="!mb-4">
      <n-button type="primary" @click="openModal()">
        新增医生
      </n-button>
      <n-button secondary @click="exportSelected">
        批量导出
      </n-button>
    </n-space>
    <n-data-table :columns="columns" :data="dataList" :pagination="{ page, onUpdatePage }" />
    <BackCrudModal
      v-model:show="openModalState"
      :title="updateTitle"
      card-class="!max-w-[600px]"
      @confirm="confirmSave"
      @cancel="closeModal"
    >
      <n-form :model="changeModal" label-placement="left" label-width="96px">
        <n-form-item label="工号">
          <n-input v-model:value="changeModal.doctor_no" :disabled="updateDataIndex >= 0" />
        </n-form-item>
        <n-form-item label="登录密码">
          <n-input v-model:value="changeModal.password" type="password" show-password-on="click" />
        </n-form-item>
        <n-form-item label="姓名">
          <n-input v-model:value="changeModal.name" />
        </n-form-item>
        <n-form-item label="性别">
          <n-radio-group v-model:value="changeModal.gender">
            <n-radio :value="0">
              女
            </n-radio>
            <n-radio :value="1">
              男
            </n-radio>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="年龄">
          <n-input-number v-model:value="changeModal.age" class="w-full" :min="18" :max="80" />
        </n-form-item>
        <n-form-item label="科室">
          <n-select
            v-model:value="changeModal.department_id"
            :options="departments.filter(d => d.status === 1).map(d => ({ label: d.dept_name, value: d.department_id }))"
          />
        </n-form-item>
        <n-form-item label="职称">
          <n-input v-model:value="changeModal.title" />
        </n-form-item>
        <n-form-item label="电话">
          <n-input v-model:value="changeModal.phone" />
        </n-form-item>
        <n-form-item label="邮箱">
          <n-input v-model:value="changeModal.email" />
        </n-form-item>
        <n-form-item label="简介">
          <n-input v-model:value="changeModal.introduction" type="textarea" :rows="2" />
        </n-form-item>
        <n-form-item label="状态">
          <n-select
            v-model:value="changeModal.status"
            :options="[
              { label: '在职', value: 1 },
              { label: '离职', value: 0 },
            ]"
          />
        </n-form-item>
      </n-form>
    </BackCrudModal>
  </div>
</template>
