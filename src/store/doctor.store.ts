import type { Doctor } from '~/types/outpatient'
import { createGlobalState } from '@vueuse/core'
import { useCurd } from '~/hooks'

const initData: Doctor[] = [
  {
    doctor_id: 1,
    doctor_no: 'D001',
    password: '123456',
    name: '张明',
    gender: 1,
    age: 42,
    department_id: 1,
    title: '主任医师',
    phone: '13800001001',
    email: 'zhangming@hospital.com',
    introduction: '擅长高血压、冠心病诊疗',
    status: 1,
  },
  {
    doctor_id: 2,
    doctor_no: 'D002',
    password: '123456',
    name: '李华',
    gender: 0,
    age: 36,
    department_id: 1,
    title: '副主任医师',
    phone: '13800001002',
    email: 'lihua@hospital.com',
    introduction: '擅长呼吸系统疾病',
    status: 1,
  },
  {
    doctor_id: 3,
    doctor_no: 'D003',
    password: '123456',
    name: '王强',
    gender: 1,
    age: 45,
    department_id: 2,
    title: '主任医师',
    phone: '13800001003',
    email: 'wangqiang@hospital.com',
    introduction: '普外微创手术',
    status: 1,
  },
]

export const useDoctorStore = createGlobalState(() => {
  return useCurd<Doctor>({ key: 'outpatient-doctor-list', initData })
})
