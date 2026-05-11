<script setup lang="ts">
import { useDoctorStore, useExamApplicationStore, useLoginStore, usePrescriptionStore, useRegistrationStore } from '~/store'

const message = useMessage()
const { list, payRegister, cancelRegister } = useRegistrationStore()
const { dataList: doctors } = useDoctorStore()
const { currentProfile } = useLoginStore()
const { list: rxList, payPrescription } = usePrescriptionStore()
const { list: examList, pay: payExam } = useExamApplicationStore()

const mine = computed(() =>
  list.value.filter(r => r.patient_id === currentProfile.value?.id).sort((a, b) => b.register_id - a.register_id),
)

const myRx = computed(() =>
  rxList.value.filter(p => p.patient_id === currentProfile.value?.id && p.status === 0),
)

const myExams = computed(() =>
  examList.value.filter(p => p.patient_id === currentProfile.value?.id && p.status === 0 && p.is_paid === 0),
)

function dname(id: number) {
  return doctors.value.find(d => d.doctor_id === id)?.name ?? id
}

function pay(r: import('~/types/outpatient').Registration) {
  payRegister(r.register_id)
  message.success('挂号费已支付（演示）')
}

function cancel(r: import('~/types/outpatient').Registration) {
  cancelRegister(r.register_id)
  message.info('已取消预约并释放号源')
}

function payRx(id: number) {
  payPrescription(id)
  message.success('药费已支付（演示）')
}

function payEx(id: number) {
  payExam(id)
  message.success('检查费已支付（演示）')
}
</script>

<template>
  <div>
    <n-h2 prefix="bar">
      我的挂号
    </n-h2>
    <n-empty v-if="!mine.length" description="暂无挂号记录" />
    <n-list v-else bordered>
      <n-list-item v-for="r in mine" :key="r.register_id">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <n-tag type="info">
              {{ r.register_no }}
            </n-tag>
            <span class="ml-2">{{ r.register_date }} {{ r.time_slot }}</span>
            <span class="ml-2 text-slate-600">医生：{{ dname(r.doctor_id) }}</span>
            <n-tag class="ml-2" size="small" :type="r.status === 0 ? 'warning' : r.status === 1 ? 'success' : 'default'">
              {{ r.status === 0 ? '待就诊' : r.status === 1 ? '已就诊' : '已取消' }}
            </n-tag>
            <n-tag class="ml-2" size="small" :type="r.is_paid ? 'success' : 'error'">
              {{ r.is_paid ? '已缴费' : '未缴费' }}
            </n-tag>
          </div>
          <n-space v-if="r.status !== 2">
            <n-button v-if="r.is_paid === 0 && r.status === 0" size="small" type="primary" @click="pay(r)">
              支付挂号费 ¥{{ r.register_fee }}
            </n-button>
            <n-button v-if="r.status === 0" size="small" tertiary @click="cancel(r)">
              取消预约
            </n-button>
          </n-space>
        </div>
      </n-list-item>
    </n-list>

    <n-divider />

    <n-h3 prefix="bar">
      待缴处方
    </n-h3>
    <n-empty v-if="!myRx.length" description="暂无待缴费处方" />
    <n-list v-else bordered>
      <n-list-item v-for="p in myRx" :key="p.prescription_id">
        <div class="flex items-center justify-between gap-2">
          <span>{{ p.prescription_no }} · 合计 ¥{{ p.total_amount }}</span>
          <n-button size="small" type="primary" @click="payRx(p.prescription_id)">
            支付药费
          </n-button>
        </div>
      </n-list-item>
    </n-list>

    <n-divider />

    <n-h3 prefix="bar">
      待缴检查费
    </n-h3>
    <n-empty v-if="!myExams.length" description="暂无待缴检查申请" />
    <n-list v-else bordered>
      <n-list-item v-for="e in myExams" :key="e.application_id">
        <div class="flex items-center justify-between gap-2">
          <span>{{ e.application_no }}</span>
          <n-button size="small" type="primary" @click="payEx(e.application_id)">
            支付检查费
          </n-button>
        </div>
      </n-list-item>
    </n-list>
  </div>
</template>
