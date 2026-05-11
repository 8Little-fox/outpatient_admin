import { QueryClient } from '@tanstack/vue-query'

export * from './admin.store'
export * from './auth.store'
export * from './bed.store'
export * from './cache.store'
export * from './department.store'
export * from './doctor.store'
export * from './examApplication.store'
export * from './examItem.store'
export * from './hospitalization.store'
export * from './login.store'
export * from './medicine.store'
export * from './patient.store'
export * from './prescription.store'
export * from './registration.store'
export * from './review.store'
export * from './schedule.store'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})
