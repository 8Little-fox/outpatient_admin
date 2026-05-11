import type { Review } from '~/types/outpatient'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import { nextNumericId } from '~/utils/outpatient'

export const useReviewStore = createGlobalState(() => {
  const list = useLocalStorage<Review[]>('outpatient-review-list', [])

  function addReview(input: Omit<Review, 'review_id'>) {
    const row: Review = {
      ...input,
      review_id: nextNumericId(list.value, 'review_id'),
    }
    list.value = [...list.value, row]
    return row
  }

  return { list, addReview }
})
