import type { Patient } from '~/types/outpatient'
import { createGlobalState } from '@vueuse/core'
import { useCurd } from '~/hooks'

const initData: Patient[] = [
  {
    patient_id: 1,
    username: 'patient001',
    password: '123456',
    real_name: '赵患者',
    gender: 1,
    age: 28,
    id_card: '210102199701011234',
    phone: '13800002001',
    address: '沈阳市和平区',
    email: 'patient001@qq.com',
    medical_history: '无',
    status: 1,
  },
]

export const usePatientStore = createGlobalState(() => {
  return useCurd<Patient>({ key: 'outpatient-patient-list', initData })
})
