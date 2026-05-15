import type { Hospitalization } from '~/types/outpatient'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { genNo, nextNumericId } from '~/utils/outpatient'
import { useBedStore } from './bed.store'

/** 患者 1（演示账号）在 /home/hospital 可见；register_id 与挂号种子对齐 */
function hospitalizationSeed(): Hospitalization[] {
  return [
    {
      hospitalization_id: 1,
      hospital_no: 'ZY202605001',
      register_id: 4,
      patient_id: 1,
      doctor_id: 4,
      bed_id: 1,
      admission_date: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
      discharge_date: dayjs().subtract(8, 'day').format('YYYY-MM-DD'),
      diagnosis: '急性支气管炎',
      status: 1,
      total_cost: 2860,
      expected_days: 6,
    },
    {
      hospitalization_id: 2,
      hospital_no: 'ZY202605002',
      register_id: 8,
      patient_id: 1,
      doctor_id: 3,
      bed_id: 2,
      admission_date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
      discharge_date: null,
      diagnosis: '普外术后留院观察',
      status: 0,
      total_cost: 2680,
      expected_days: 5,
    },
    {
      hospitalization_id: 3,
      hospital_no: 'ZY202604088',
      register_id: 13,
      patient_id: 1,
      doctor_id: 3,
      bed_id: 3,
      admission_date: dayjs().subtract(40, 'day').format('YYYY-MM-DD'),
      discharge_date: dayjs().subtract(35, 'day').format('YYYY-MM-DD'),
      diagnosis: '阑尾炎术后恢复',
      status: 1,
      total_cost: 15200,
      expected_days: 5,
    },
  ]
}

export const useHospitalizationStore = createGlobalState(() => {
  const list = useLocalStorage<Hospitalization[]>('outpatient-hospitalization-list', hospitalizationSeed())
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
