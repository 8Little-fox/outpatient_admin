<script setup lang="ts">
import type { Patient } from '~/types/outpatient'
import ActionButton from '~/components/ActionButton.vue'
import BackCrudModal from '~/components/BackCrudModal.vue'
import ColorColumn from '~/components/ColorColumn.vue'
import { usePatientStore } from '~/store'
import { nextNumericId } from '~/utils/outpatient'

const store = usePatientStore()
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
    changeModal.value.patient_id = nextNumericId(dataList.value, 'patient_id')
    changeModal.value.status = changeModal.value.status ?? 1
    changeModal.value.gender = changeModal.value.gender ?? 1
  }
  saveForm()
}

const columns = [
  { title: '用户名', key: 'username' },
  { title: '姓名', key: 'real_name' },
  { title: '身份证', key: 'id_card' },
  { title: '电话', key: 'phone' },
  {
    title: '状态',
    key: 'status',
    render: (row: Patient) => h(ColorColumn, { text: row.status === 1 ? '正常' : '禁用', danger: row.status !== 1 }),
  },
  {
    title: '操作',
    key: 'action',
    render: (row: Patient, index: number) =>
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
      新增患者档案
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
        <n-form-item label="用户名">
          <n-input v-model:value="changeModal.username" :disabled="updateDataIndex >= 0" />
        </n-form-item>
        <n-form-item label="密码">
          <n-input v-model:value="changeModal.password" type="password" show-password-on="click" />
        </n-form-item>
        <n-form-item label="真实姓名">
          <n-input v-model:value="changeModal.real_name" />
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
          <n-input-number v-model:value="changeModal.age" class="w-full" :min="1" :max="120" />
        </n-form-item>
        <n-form-item label="身份证号">
          <n-input v-model:value="changeModal.id_card" />
        </n-form-item>
        <n-form-item label="联系电话">
          <n-input v-model:value="changeModal.phone" />
        </n-form-item>
        <n-form-item label="住址">
          <n-input v-model:value="changeModal.address" />
        </n-form-item>
        <n-form-item label="邮箱">
          <n-input v-model:value="changeModal.email" />
        </n-form-item>
        <n-form-item label="既往病史">
          <n-input v-model:value="changeModal.medical_history" type="textarea" :rows="2" />
        </n-form-item>
        <n-form-item label="状态">
          <n-select
            v-model:value="changeModal.status"
            :options="[
              { label: '正常', value: 1 },
              { label: '禁用', value: 0 },
            ]"
          />
        </n-form-item>
      </n-form>
    </BackCrudModal>
  </div>
</template>
