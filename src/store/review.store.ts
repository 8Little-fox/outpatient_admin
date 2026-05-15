import type { Review } from '~/types/outpatient'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import { nextNumericId } from '~/utils/outpatient'

/** 患者 1 对已就诊挂号的评价；其余挂号在 /home/review 仍显示「评价」按钮 */
const reviewSeed: Review[] = [
  { review_id: 1, register_id: 4, patient_id: 1, doctor_id: 4, score: 5, content: '医生讲解清楚，用药交代细致。' },
  { review_id: 2, register_id: 8, patient_id: 1, doctor_id: 3, score: 4, content: '伤口处理专业，候诊略久。' },
  { review_id: 3, register_id: 11, patient_id: 1, doctor_id: 2, score: 5, content: '心血管随诊很满意，会按时复查。' },
]

export const useReviewStore = createGlobalState(() => {
  const list = useLocalStorage<Review[]>('outpatient-review-list', reviewSeed)

  /** 患者评价均分，无记录时按文档展示默认 5 分 */
  function avgScoreForDoctor(doctorId: number) {
    const rs = list.value.filter(r => r.doctor_id === doctorId)
    if (!rs.length)
      return 5
    return Math.round((rs.reduce((s, r) => s + r.score, 0) / rs.length) * 10) / 10
  }

  function addReview(input: Omit<Review, 'review_id'>) {
    const row: Review = {
      ...input,
      review_id: nextNumericId(list.value, 'review_id'),
    }
    list.value = [...list.value, row]
    return row
  }

  return { list, addReview, avgScoreForDoctor }
})
