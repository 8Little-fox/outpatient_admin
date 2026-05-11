<script setup lang="ts">
import type { Department } from '~/types/outpatient'
import ActionButton from '~/components/ActionButton.vue'
import BackCrudModal from '~/components/BackCrudModal.vue'
import ColorColumn from '~/components/ColorColumn.vue'
import { useDepartmentStore } from '~/store'
import { nextNumericId } from '~/utils/outpatient'

const store = useDepartmentStore()
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
  updateDataIndex: _updateDataIndex,
  isUpdate,
} = store

function confirmSave() {
  if (!isUpdate.value) {
    changeModal.value.department_id = nextNumericId(dataList.value, 'department_id')
    changeModal.value.status = changeModal.value.status ?? 1
  }
  saveForm()
}

const columns = [
  { title: '科室名称', key: 'dept_name' },
  { title: '编码', key: 'dept_code' },
  { title: '位置', key: 'location' },
  {
    title: '状态',
    key: 'status',
    render: (row: Department) => h(ColorColumn, { text: row.status === 1 ? '启用' : '停用', danger: row.status !== 1 }),
  },
  {
    title: '操作',
    key: 'action',
    render: (row: Department, index: number) =>
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
      新增科室
    </n-button>
    <n-data-table :columns="columns" :data="dataList" :pagination="{ page, onUpdatePage }" />
    <BackCrudModal
      v-model:show="openModalState"
      :title="updateTitle"
      card-class="!max-w-[560px]"
      @confirm="confirmSave"
      @cancel="closeModal"
    >
      <n-form :model="changeModal" label-placement="left" label-width="88px">
        <n-form-item label="科室名称">
          <n-input v-model:value="changeModal.dept_name" />
        </n-form-item>
        <n-form-item label="科室编码">
          <n-input v-model:value="changeModal.dept_code" />
        </n-form-item>
        <n-form-item label="简介">
          <n-input v-model:value="changeModal.description" type="textarea" :rows="2" />
        </n-form-item>
        <n-form-item label="位置">
          <n-input v-model:value="changeModal.location" />
        </n-form-item>
        <n-form-item label="状态">
          <n-select
            v-model:value="changeModal.status"
            :options="[
              { label: '启用', value: 1 },
              { label: '停用', value: 0 },
            ]"
          />
        </n-form-item>
      </n-form>
    </BackCrudModal>
  </div>
</template>
