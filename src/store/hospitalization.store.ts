import type { Hospitalization } from '~/types/outpatient'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import { genNo, nextNumericId } from '~/utils/outpatient'
import { useBedStore } from './bed.store'

export const useHospitalizationStore = createGlobalState(() => {
  const list = useLocalStorage<Hospitalization[]>('outpatient-hospitalization-list', [])
  const { dataList: beds, updateData: updateBed } = useBedStore()

  function applyHospital(input: {
    register_id: number
    patient_id: number
    doctor_id: number
    diagnosis: string
    expected_days?: number
  }) {
    const freeIdx = beds.value.findIndex(b => b.status === 1 && !b.patient_id)
    if (freeIdx < 0)
      return { ok: false, message: '暂无空闲床位，请稍后在病床管理中释放资源后再试' }
    const bed = beds.value[freeIdx]!
    const row: Hospitalization = {
      hospitalization_id: nextNumericId(list.value, 'hospitalization_id'),
      hospital_no: genNo('ZY'),
      register_id: input.register_id,
      patient_id: input.patient_id,
      doctor_id: input.doctor_id,
      bed_id: bed.bed_id,
      admission_date: new Date().toISOString().slice(0, 10),
      discharge_date: null,
      diagnosis: input.diagnosis,
      status: 0,
      total_cost: bed.price_per_day * (input.expected_days ?? 3),
      expected_days: input.expected_days,
    }
    updateBed(freeIdx, { ...bed, status: 0, patient_id: input.patient_id })
    list.value = [...list.value, row]
    return { ok: true, message: '住院申请已通过，已自动分配床位', hospitalization: row }
  }

  function discharge(hospitalizationId: number) {
    const i = list.value.findIndex(h => h.hospitalization_id === hospitalizationId)
    if (i < 0)
      return
    const h = list.value[i]!
    const bi = beds.value.findIndex(b => b.bed_id === h.bed_id)
    if (bi >= 0) {
      const b = beds.value[bi]!
      updateBed(bi, { ...b, status: 1, patient_id: null })
    }
    list.value[i] = {
      ...h,
      status: 1,
      discharge_date: new Date().toISOString().slice(0, 10),
    }
    list.value = [...list.value]
  }

  return { list, applyHospital, discharge }
})
