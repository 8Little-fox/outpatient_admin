import type { Admin } from '~/types/outpatient'
import { createGlobalState } from '@vueuse/core'
import { useCurd } from '~/hooks'

const initData: Admin[] = [
  {
    admin_id: 1,
    username: 'admin001',
    password: '123456',
    real_name: '系统管理员',
    email: 'admin@hospital.com',
    phone: '13900000000',
    status: 1,
  },
]

export const useAdminStore = createGlobalState(() => {
  return useCurd<Admin>({ key: 'outpatient-admin-list', initData })
})
