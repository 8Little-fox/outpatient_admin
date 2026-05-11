<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { useDepartmentStore, useDoctorStore, usePatientStore, useRegistrationStore } from '~/store'

const { list, cancelRegister, payRegister } = useRegistrationStore()
const { dataList: patients } = usePatientStore()
const { dataList: doctors } = useDoctorStore()
const { dataList: departments } = useDepartmentStore()
const message = useMessage()

function pname(id: number) {
  return patients.value.find(p => p.patient_id === id)?.real_name ?? id
}
function dname(id: number) {
  return doctors.value.find(d => d.doctor_id === id)?.name ?? id
}
function depname(id: number) {
  return departments.value.find(d => d.department_id === id)?.dept_name ?? id
}

const columns = [
  { title: '挂号单号', key: 'register_no' },
  { title: '患者', key: 'patient_id', render: (row: any) => pname(row.patient_id) },
  { title: '医生', key: 'doctor_id', render: (row: any) => dname(row.doctor_id) },
  { title: '科室', key: 'department_id', render: (row: any) => depname(row.department_id) },
  { title: '日期', key: 'register_date' },
  { title: '时段', key: 'time_slot' },
  { title: '挂号费', key: 'register_fee', render: (row: any) => `¥${row.register_fee}` },
  {
    title: '缴费',
    key: 'is_paid',
    render: (row: any) => (row.is_paid ? '已缴' : '未缴'),
  },
  {
    title: '状态',
    key: 'status',
    render: (row: any) => (row.status === 0 ? '待就诊' : row.status === 1 ? '已就诊' : '已取消'),
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: any) => {
      const btns: ReturnType<typeof h>[] = []
      if (row.is_paid === 0 && row.status !== 2) {
        btns.push(h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: () => {
            payRegister(row.register_id)
            message.success('已标记缴费')
          },
        }, { default: () => '代缴费' }))
      }
      if (row.status !== 2) {
        btns.push(h(NButton, {
          size: 'small',
          tertiary: true,
          onClick: () => {
            cancelRegister(row.register_id)
            message.info('已取消并释放号源')
          },
        }, { default: () => '取消' }))
      }
      return h(NSpace, { size: 8 }, () => btns)
    },
  },
]
</script>

<template>
  <div>
    <h3 class="mb-4 text-lg font-medium text-slate-800">
      挂号管理
    </h3>
    <n-data-table :columns="columns" :data="list" :pagination="{ pageSize: 10 }" />
  </div>
</template>
