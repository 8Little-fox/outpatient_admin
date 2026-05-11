import type { ExamApplication } from '~/types/outpatient'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import { genNo, nextNumericId } from '~/utils/outpatient'

export const useExamApplicationStore = createGlobalState(() => {
  const list = useLocalStorage<ExamApplication[]>('outpatient-exam-application-list', [])

  function createApplication(input: {
    register_id: number
    doctor_id: number
    patient_id: number
    item_id: number
    purpose?: string
  }) {
    const row: ExamApplication = {
      application_id: nextNumericId(list.value, 'application_id'),
      application_no: genNo('JC'),
      register_id: input.register_id,
      doctor_id: input.doctor_id,
      patient_id: input.patient_id,
      item_id: input.item_id,
      status: 0,
      is_paid: 0,
      check_result: '',
      check_time: null,
      report_time: null,
      purpose: input.purpose,
    }
    list.value = [...list.value, row]
    return row
  }

  function pay(applicationId: number) {
    const i = list.value.findIndex(x => x.application_id === applicationId)
    if (i < 0)
      return false
    const x = list.value[i]!
    list.value[i] = { ...x, is_paid: 1 }
    list.value = [...list.value]
    return true
  }

  function completeCheck(applicationId: number, result: string) {
    const i = list.value.findIndex(x => x.application_id === applicationId)
    if (i < 0)
      return
    const x = list.value[i]!
    list.value[i] = {
      ...x,
      status: 1,
      check_result: result,
      check_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      report_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    list.value = [...list.value]
  }

  return { list, createApplication, pay, completeCheck }
})
