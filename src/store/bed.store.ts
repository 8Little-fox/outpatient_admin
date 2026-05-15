import type { Bed } from '~/types/outpatient'
import { createGlobalState } from '@vueuse/core'
import { useCurd } from '~/hooks'

const initData: Bed[] = [
  { bed_id: 1, bed_no: 'B101-1', department_id: 1, room_no: '101', bed_type: '普通', price_per_day: 120, status: 1, patient_id: null },
  /** 与住院种子「住院中」记录一致，供 /home/hospital 演示 */
  { bed_id: 2, bed_no: 'B101-2', department_id: 1, room_no: '101', bed_type: '普通', price_per_day: 120, status: 0, patient_id: 1 },
  { bed_id: 3, bed_no: 'B201-1', department_id: 2, room_no: '201', bed_type: '监护', price_per_day: 380, status: 1, patient_id: null },
]

export const useBedStore = createGlobalState(() => {
  return useCurd<Bed>({ key: 'outpatient-bed-list', initData })
})
