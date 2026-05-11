import type { Department } from '~/types/outpatient'
import { createGlobalState } from '@vueuse/core'
import { useCurd } from '~/hooks'

const initData: Department[] = [
  { department_id: 1, dept_name: '内科', dept_code: 'NK', description: '心血管、呼吸等常见病诊疗', location: '门诊楼2层', status: 1 },
  { department_id: 2, dept_name: '外科', dept_code: 'WK', description: '普外、骨科等', location: '门诊楼3层', status: 1 },
  { department_id: 3, dept_name: '儿科', dept_code: 'EK', description: '儿童常见病', location: '门诊楼1层', status: 1 },
]

export const useDepartmentStore = createGlobalState(() => {
  return useCurd<Department>({ key: 'outpatient-department-list', initData })
})
