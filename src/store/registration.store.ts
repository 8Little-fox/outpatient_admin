import type { Registration } from '~/types/outpatient'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { genNo, nextNumericId } from '~/utils/outpatient'
import { useScheduleStore } from './schedule.store'

/** 与排班 seed 的 work_date（今日起 14 天）、医生 1–5、上午/下午 对齐 */
function registrationSeed(): Registration[] {
  const d0 = dayjs().format('YYYY-MM-DD')
  const d1 = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const d2 = dayjs().add(2, 'day').format('YYYY-MM-DD')
  const d3 = dayjs().add(3, 'day').format('YYYY-MM-DD')
  const d4 = dayjs().add(4, 'day').format('YYYY-MM-DD')
  const d5 = dayjs().add(5, 'day').format('YYYY-MM-DD')
  const d6 = dayjs().add(6, 'day').format('YYYY-MM-DD')
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return [
    { register_id: 1, register_no: 'GH20260520001', patient_id: 1, doctor_id: 1, department_id: 1, register_date: d0, time_slot: '上午', register_fee: 10, status: 0, is_paid: 1, pay_time: now, symptom_desc: '头痛、乏力三天', diagnosis: '', visiting: false },
    { register_id: 2, register_no: 'GH20260520002', patient_id: 1, doctor_id: 2, department_id: 5, register_date: d0, time_slot: '下午', register_fee: 12, status: 0, is_paid: 0, pay_time: null, symptom_desc: '胸闷气短', diagnosis: '', visiting: false },
    { register_id: 3, register_no: 'GH20260520003', patient_id: 1, doctor_id: 3, department_id: 9, register_date: d1, time_slot: '上午', register_fee: 15, status: 0, is_paid: 1, pay_time: now, symptom_desc: '上腹隐痛一周', diagnosis: '', visiting: false },
    { register_id: 4, register_no: 'GH20260520004', patient_id: 1, doctor_id: 4, department_id: 2, register_date: d1, time_slot: '下午', register_fee: 10, status: 1, is_paid: 1, pay_time: now, symptom_desc: '咳嗽有痰', diagnosis: '急性支气管炎', visiting: false },
    { register_id: 5, register_no: 'GH20260520005', patient_id: 1, doctor_id: 5, department_id: 24, register_date: d2, time_slot: '上午', register_fee: 10, status: 0, is_paid: 0, pay_time: null, symptom_desc: '失眠、食欲差', diagnosis: '', visiting: false },
    { register_id: 6, register_no: 'GH20260520006', patient_id: 1, doctor_id: 1, department_id: 1, register_date: d2, time_slot: '下午', register_fee: 10, status: 2, is_paid: 1, pay_time: now, symptom_desc: '复查', diagnosis: '', visiting: false },
    { register_id: 7, register_no: 'GH20260520007', patient_id: 1, doctor_id: 2, department_id: 5, register_date: d3, time_slot: '上午', register_fee: 12, status: 0, is_paid: 1, pay_time: now, symptom_desc: '血压偏高随访', diagnosis: '', visiting: false },
    { register_id: 8, register_no: 'GH20260520008', patient_id: 1, doctor_id: 3, department_id: 9, register_date: d3, time_slot: '下午', register_fee: 15, status: 1, is_paid: 1, pay_time: now, symptom_desc: '术后换药', diagnosis: '伤口愈合良好', visiting: false },
    /** 已就诊：供 /doctor/processed 各医生账号演示 */
    { register_id: 9, register_no: 'GH20260520009', patient_id: 1, doctor_id: 1, department_id: 1, register_date: d4, time_slot: '上午', register_fee: 10, status: 1, is_paid: 1, pay_time: now, symptom_desc: '头晕', diagnosis: '椎基底动脉供血不足（轻度）', visiting: false },
    { register_id: 10, register_no: 'GH20260520010', patient_id: 1, doctor_id: 1, department_id: 1, register_date: d5, time_slot: '下午', register_fee: 10, status: 1, is_paid: 1, pay_time: now, symptom_desc: '失眠焦虑', diagnosis: '神经衰弱？建议心理量表评估', visiting: false },
    { register_id: 11, register_no: 'GH20260520011', patient_id: 1, doctor_id: 2, department_id: 5, register_date: d4, time_slot: '下午', register_fee: 12, status: 1, is_paid: 1, pay_time: now, symptom_desc: '活动后心悸', diagnosis: '窦性心动过速，建议 Holter', visiting: false },
    { register_id: 12, register_no: 'GH20260520012', patient_id: 1, doctor_id: 2, department_id: 5, register_date: d6, time_slot: '上午', register_fee: 12, status: 1, is_paid: 1, pay_time: now, symptom_desc: '胸痛复查', diagnosis: '肋间神经痛，对症处理', visiting: false },
    { register_id: 13, register_no: 'GH20260520013', patient_id: 1, doctor_id: 3, department_id: 9, register_date: d4, time_slot: '上午', register_fee: 15, status: 1, is_paid: 1, pay_time: now, symptom_desc: '阑尾术后随访', diagnosis: '切口愈合可，未见感染征象', visiting: false },
    { register_id: 14, register_no: 'GH20260520014', patient_id: 1, doctor_id: 5, department_id: 24, register_date: d4, time_slot: '下午', register_fee: 10, status: 1, is_paid: 1, pay_time: now, symptom_desc: '胃脘胀满', diagnosis: '脾虚湿困，健脾化湿方一周', visiting: false },
    { register_id: 15, register_no: 'GH20260520015', patient_id: 1, doctor_id: 5, department_id: 24, register_date: d6, time_slot: '下午', register_fee: 10, status: 1, is_paid: 1, pay_time: now, symptom_desc: '乏力盗汗', diagnosis: '气阴两虚，益气养阴调理', visiting: false },
  ]
}

export const useRegistrationStore = createGlobalState(() => {
  const list = useLocalStorage<Registration[]>('outpatient-registration-list', registrationSeed())
  const { dataList: schedules, updateData: updateSchedule } = useScheduleStore()

  function findSchedule(doctorId: number, workDate: string, timeSlot: string) {
    return schedules.value.findIndex(
      s => s.doctor_id === doctorId && s.work_date === workDate && s.time_slot === timeSlot && s.status === 1,
    )
  }

  /** 号源是否已满 */
  function isSlotFull(doctorId: number, workDate: string, timeSlot: string) {
    const i = findSchedule(doctorId, workDate, timeSlot)
    if (i < 0)
      return true
    const s = schedules.value[i]!
    return s.booked_count >= s.max_patients
  }

  /** 同一患者同日同时段冲突 */
  function hasConflict(patientId: number, workDate: string, timeSlot: string, excludeRegisterId?: number) {
    return list.value.some(
      r =>
        r.patient_id === patientId
        && r.register_date === workDate
        && r.time_slot === timeSlot
        && r.status !== 2
        && r.register_id !== excludeRegisterId,
    )
  }

  function book(params: {
    patient_id: number
    doctor_id: number
    department_id: number
    register_date: string
    time_slot: string
    register_fee: number
  }) {
    const si = findSchedule(params.doctor_id, params.register_date, params.time_slot)
    if (si < 0)
      return { ok: false, message: '该医生当日未排班或已停诊' }
    const s = schedules.value[si]!
    if (s.booked_count >= s.max_patients)
      return { ok: false, message: '该时段号源已满，请选择其他时段或医生' }
    if (hasConflict(params.patient_id, params.register_date, params.time_slot))
      return { ok: false, message: '您在该时段已有其他预约，请取消原预约后再试' }

    const reg: Registration = {
      register_id: nextNumericId(list.value, 'register_id'),
      register_no: genNo('GH'),
      patient_id: params.patient_id,
      doctor_id: params.doctor_id,
      department_id: params.department_id,
      register_date: params.register_date,
      time_slot: params.time_slot,
      register_fee: params.register_fee,
      status: 0,
      is_paid: 0,
      pay_time: null,
      symptom_desc: '',
      diagnosis: '',
      visiting: false,
    }
    list.value = [...list.value, reg]
    updateSchedule(si, { ...s, booked_count: s.booked_count + 1 })
    return { ok: true, message: '预约成功', registration: reg }
  }

  function payRegister(registerId: number) {
    const i = list.value.findIndex(r => r.register_id === registerId)
    if (i < 0)
      return false
    const r = list.value[i]!
    if (r.is_paid === 1)
      return true
    list.value[i] = { ...r, is_paid: 1, pay_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }
    list.value = [...list.value]
    return true
  }

  function cancelRegister(registerId: number) {
    const i = list.value.findIndex(r => r.register_id === registerId)
    if (i < 0)
      return
    const r = list.value[i]!
    if (r.status === 2)
      return
    const si = findSchedule(r.doctor_id, r.register_date, r.time_slot)
    if (si >= 0) {
      const s = schedules.value[si]!
      updateSchedule(si, { ...s, booked_count: Math.max(0, s.booked_count - 1) })
    }
    list.value[i] = { ...r, status: 2 }
    list.value = [...list.value]
  }

  function updateRegistration(registerId: number, patch: Partial<Registration>) {
    const i = list.value.findIndex(r => r.register_id === registerId)
    if (i < 0)
      return
    list.value[i] = { ...list.value[i]!, ...patch }
    list.value = [...list.value]
  }

  return {
    list,
    book,
    payRegister,
    cancelRegister,
    updateRegistration,
    isSlotFull,
    hasConflict,
    findSchedule,
  }
})
