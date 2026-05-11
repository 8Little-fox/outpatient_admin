import type { ExamItem } from '~/types/outpatient'
import { createGlobalState } from '@vueuse/core'
import { useCurd } from '~/hooks'

const initData: ExamItem[] = [
  { item_id: 1, item_no: 'E001', item_name: '血常规', category: '检验', price: 35, description: '全血细胞分析', location: '检验科', status: 1 },
  { item_id: 2, item_no: 'E002', item_name: '胸部X光', category: '影像', price: 120, description: '正位片', location: '放射科', status: 1 },
  { item_id: 3, item_no: 'E003', item_name: '心电图', category: '功能', price: 30, description: '十二导联', location: '功能科', status: 1 },
]

export const useExamItemStore = createGlobalState(() => {
  return useCurd<ExamItem>({ key: 'outpatient-exam-item-list', initData })
})
