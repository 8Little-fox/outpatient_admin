<script setup lang="ts">
import type { Medicine } from '~/types/outpatient'
import ActionButton from '~/components/ActionButton.vue'
import BackCrudModal from '~/components/BackCrudModal.vue'
import { useMedicineStore } from '~/store'
import { nextNumericId } from '~/utils/outpatient'

const store = useMedicineStore()
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
    changeModal.value.medicine_id = nextNumericId(dataList.value, 'medicine_id')
    changeModal.value.status = changeModal.value.status ?? 1
    changeModal.value.stock = changeModal.value.stock ?? 0
    changeModal.value.price = changeModal.value.price ?? 0
  }
  saveForm()
}

const columns = [
  { title: '编号', key: 'medicine_no' },
  { title: '名称', key: 'name' },
  { title: '规格', key: 'specification' },
  { title: '库存', key: 'stock' },
  { title: '单价', key: 'price', render: (row: Medicine) => `¥${row.price}` },
  {
    title: '操作',
    key: 'action',
    render: (row: Medicine, index: number) =>
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
      新增药品
    </n-button>
    <n-data-table :columns="columns" :data="dataList" :pagination="{ page, onUpdatePage }" />
    <BackCrudModal
      v-model:show="openModalState"
      :title="updateTitle"
      card-class="!max-w-[600px]"
      @confirm="confirmSave"
      @cancel="closeModal"
    >
      <n-form :model="changeModal" label-placement="left" label-width="96px">
        <n-form-item label="药品编号">
          <n-input v-model:value="changeModal.medicine_no" :disabled="updateDataIndex >= 0" />
        </n-form-item>
        <n-form-item label="名称">
          <n-input v-model:value="changeModal.name" />
        </n-form-item>
        <n-form-item label="类别">
          <n-input v-model:value="changeModal.category" />
        </n-form-item>
        <n-form-item label="规格">
          <n-input v-model:value="changeModal.specification" />
        </n-form-item>
        <n-form-item label="厂家">
          <n-input v-model:value="changeModal.manufacturer" />
        </n-form-item>
        <n-form-item label="单价">
          <n-input-number v-model:value="changeModal.price" class="w-full" :min="0" :precision="2" />
        </n-form-item>
        <n-form-item label="库存">
          <n-input-number v-model:value="changeModal.stock" class="w-full" :min="0" />
        </n-form-item>
        <n-form-item label="单位">
          <n-input v-model:value="changeModal.unit" />
        </n-form-item>
        <n-form-item label="用法用量">
          <n-input v-model:value="changeModal.usage_dosage" type="textarea" :rows="2" />
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
