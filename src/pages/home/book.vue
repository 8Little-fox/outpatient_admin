<script setup lang="ts">
import dayjs from 'dayjs'
import {
  useDepartmentStore,
  useDoctorStore,
  useLoginStore,
  useRegistrationStore,
  useScheduleStore,
} from '~/store'

const message = useMessage()
const { dataList: departments } = useDepartmentStore()
const { dataList: doctors } = useDoctorStore()
const { dataList: schedules } = useScheduleStore()
const { book, isSlotFull, hasConflict } = useRegistrationStore()
const { currentProfile } = useLoginStore()

const step = ref(1)
const deptId = ref<number | null>(null)
const pickDate = ref(dayjs().format('YYYY-MM-DD'))
const doctorId = ref<number | null>(null)
const slot = ref('')

const doctorsInDept = computed(() => {
  if (!deptId.value)
    return []
  return doctors.value.filter(d => d.department_id === deptId.value && d.status === 1)
})

const doctorSchedules = computed(() => {
  if (!doctorId.value || !pickDate.value)
    return []
  return schedules.value.filter(
    s => s.doctor_id === doctorId.value && s.work_date === pickDate.value && s.status === 1,
  )
})

const slotOptions = computed(() => {
  return doctorSchedules.value.map((s) => {
    const full = s.booked_count >= s.max_patients
    return {
      label: `${s.time_slot}（剩余 ${Math.max(0, s.max_patients - s.booked_count)} / ${s.max_patients}）`,
      value: s.time_slot,
      disabled: full,
    }
  })
})

function next1() {
  if (!deptId.value) {
    message.warning('请选择科室')
    return
  }
  step.value = 2
}

function next2() {
  if (!pickDate.value || !doctorId.value) {
    message.warning('请选择日期与医生')
    return
  }
  if (!doctorSchedules.value.length) {
    message.warning('该医生当日无排班或已停诊')
    return
  }
  step.value = 3
}

function confirmBook() {
  if (!slot.value || !doctorId.value || !deptId.value || !currentProfile.value) {
    message.warning('请选择时段')
    return
  }
  if (isSlotFull(doctorId.value, pickDate.value, slot.value)) {
    message.error('该时段号源已满，请选择其他时段或医生')
    return
  }
  if (hasConflict(currentProfile.value.id as number, pickDate.value, slot.value)) {
    message.error('您在该时段已有其他预约，请取消原预约后再试')
    return
  }
  const res = book({
    patient_id: currentProfile.value.id as number,
    doctor_id: doctorId.value,
    department_id: deptId.value,
    register_date: pickDate.value,
    time_slot: slot.value,
    register_fee: 15,
  })
  if (!res.ok) {
    message.error(res.message || '预约失败')
    return
  }
  message.success(`预约成功，挂号单号 ${res.registration?.register_no}`)
  step.value = 1
  deptId.value = null
  doctorId.value = null
  slot.value = ''
  pickDate.value = dayjs().format('YYYY-MM-DD')
}

function isDateDisabled(ts: number) {
  const d = dayjs(ts)
  if (d.isBefore(dayjs(), 'day'))
    return true
  return d.isAfter(dayjs().add(30, 'day'), 'day')
}

const dateMs = computed({
  get: () => dayjs(pickDate.value).valueOf(),
  set: (v: number) => {
    pickDate.value = dayjs(v).format('YYYY-MM-DD')
    doctorId.value = null
    slot.value = ''
  },
})
</script>

<template>
  <div>
    <n-h2 prefix="bar">
      预约挂号
    </n-h2>
    <n-steps :current="step" class="mb-8">
      <n-step title="选择科室" description="全院科室列表" />
      <n-step title="选择日期与医生" description="查看号源余量" />
      <n-step title="选择时段并确认" description="生成挂号单号" />
    </n-steps>

    <n-card v-show="step === 1" title="选择挂号科室">
      <n-radio-group v-model:value="deptId" name="dept">
        <n-space vertical>
          <n-radio v-for="d in departments.filter(x => x.status === 1)" :key="d.department_id" :value="d.department_id">
            <strong>{{ d.dept_name }}</strong>
            <span class="text-slate-500"> — {{ d.description }}</span>
          </n-radio>
        </n-space>
      </n-radio-group>
      <n-button class="mt-6" type="primary" @click="next1">
        下一步
      </n-button>
    </n-card>

    <n-card v-show="step === 2" title="选择挂号日期以及医生">
      <n-form label-placement="left" label-width="96">
        <n-form-item label="就诊日期">
          <n-date-picker v-model:value="dateMs" type="date" :is-date-disabled="isDateDisabled" />
        </n-form-item>
        <n-form-item label="出诊医生">
          <n-select
            v-model:value="doctorId"
            :options="doctorsInDept.map(d => ({ label: `${d.name} · ${d.title}`, value: d.doctor_id }))"
            placeholder="请选择医生"
            @update:value="() => { slot = '' }"
          />
        </n-form-item>
      </n-form>
      <n-space>
        <n-button @click="step = 1">
          上一步
        </n-button>
        <n-button type="primary" @click="next2">
          下一步
        </n-button>
      </n-space>
    </n-card>

    <n-card v-show="step === 3" title="选择挂号时间段">
      <n-alert v-if="!slotOptions.length" type="warning" title="该日无可预约时段" />
      <n-radio-group v-else v-model:value="slot" name="slot">
        <n-space vertical>
          <n-radio
            v-for="opt in slotOptions"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
          >
            {{ opt.label }}
            <n-text v-if="opt.disabled" depth="3" class="ml-2">
              已满
            </n-text>
          </n-radio>
        </n-space>
      </n-radio-group>
      <n-space class="mt-6">
        <n-button @click="step = 2">
          上一步
        </n-button>
        <n-button type="primary" :disabled="!slot || slotOptions.find(o => o.value === slot)?.disabled" @click="confirmBook">
          确认预约
        </n-button>
      </n-space>
    </n-card>
  </div>
</template>
