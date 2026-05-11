<script setup lang="ts">
import type { ExamItem } from '~/types/outpatient'
import ActionButton from '~/components/ActionButton.vue'
import BackCrudModal from '~/components/BackCrudModal.vue'
import { useExamItemStore } from '~/store'
import { nextNumericId } from '~/utils/outpatient'

const store = useExamItemStore()
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

function confirmSave() {
  if (!isUpdate.value) {
    changeModal.value.item_id = nextNumericId(dataList.value, 'item_id')
    changeModal.value.status = changeModal.value.status ?? 1
    changeModal.value.price = changeModal.value.price ?? 0
  }
  saveForm()
}

const columns = [
  { title: '项目编号', key: 'item_no' },
  { title: '名称', key: 'item_name' },
  { title: '类别', key: 'category' },
  { title: '费用', key: 'price', render: (row: ExamItem) => `¥${row.price}` },
  { title: '地点', key: 'location' },
  {
    title: '操作',
    key: 'action',
    render: (row: ExamItem, index: number) =>
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
      新增检查项目
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
        <n-form-item label="项目编号">
          <n-input v-model:value="changeModal.item_no" :disabled="updateDataIndex >= 0" />
        </n-form-item>
        <n-form-item label="项目名称">
          <n-input v-model:value="changeModal.item_name" />
        </n-form-item>
        <n-form-item label="类别">
          <n-input v-model:value="changeModal.category" />
        </n-form-item>
        <n-form-item label="费用">
          <n-input-number v-model:value="changeModal.price" class="w-full" :min="0" :precision="2" />
        </n-form-item>
        <n-form-item label="说明">
          <n-input v-model:value="changeModal.description" type="textarea" :rows="2" />
        </n-form-item>
        <n-form-item label="检查地点">
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
