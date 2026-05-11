import type { Medicine } from '~/types/outpatient'
import { createGlobalState } from '@vueuse/core'
import { useCurd } from '~/hooks'

const initData: Medicine[] = [
  { medicine_id: 1, medicine_no: 'M001', name: '阿莫西林胶囊', category: '抗生素', specification: '0.25g*24粒', manufacturer: '某某制药', price: 18.5, stock: 200, unit: '盒', usage_dosage: '口服，一次2粒，一日3次', status: 1 },
  { medicine_id: 2, medicine_no: 'M002', name: '布洛芬缓释胶囊', category: '解热镇痛', specification: '0.3g*20粒', manufacturer: '某某制药', price: 22, stock: 150, unit: '盒', usage_dosage: '口服，一次1粒，一日2次', status: 1 },
  { medicine_id: 3, medicine_no: 'M003', name: '连花清瘟胶囊', category: '中成药', specification: '0.35g*48粒', manufacturer: '某某药业', price: 28, stock: 80, unit: '盒', usage_dosage: '口服，一次4粒，一日3次', status: 1 },
]

export const useMedicineStore = createGlobalState(() => {
  return useCurd<Medicine>({ key: 'outpatient-medicine-list', initData })
})
