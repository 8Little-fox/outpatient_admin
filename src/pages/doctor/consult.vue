<script setup lang="ts">
import type { PrescriptionDetail } from '~/types/outpatient'
import { useRoute, useRouter } from 'vue-router'
import {
  useExamApplicationStore,
  useExamItemStore,
  useHospitalizationStore,
  useLoginStore,
  useMedicineStore,
  usePrescriptionStore,
  useRegistrationStore,
} from '~/store'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const { list, updateRegistration } = useRegistrationStore()
const { createPrescription } = usePrescriptionStore()
const { createApplication } = useExamApplicationStore()
const { applyHospital } = useHospitalizationStore()
const { dataList: medicines } = useMedicineStore()
const { dataList: examItems } = useExamItemStore()
const { currentProfile } = useLoginStore()

const regId = computed(() => Number(route.query.id || 0))
const reg = computed(() => list.value.find(r => r.register_id === regId.value))

const symptom = ref('')
const diagnosis = ref('')

const rxLines = ref<{ medicine_id: number | null, quantity: number, usage: string, dosage: string, days: number }[]>([
  { medicine_id: null, quantity: 1, usage: '口服', dosage: '一次2粒', days: 3 },
])

const examPick = ref<number[]>([])
const examPurpose = ref('')

const showZy = ref(false)
const zyDiag = ref('')
const zyDays = ref(3)

watchEffect(() => {
  if (reg.value) {
    symptom.value = reg.value.symptom_desc || ''
    diagnosis.value = reg.value.diagnosis || ''
  }
})

function addRxLine() {
  rxLines.value.push({ medicine_id: null, quantity: 1, usage: '口服', dosage: '', days: 3 })
}

async function savePrescription() {
  if (!reg.value || !currentProfile.value)
    return
  const details: Omit<PrescriptionDetail, 'detail_id' | 'amount'>[] = []
  for (const line of rxLines.value) {
    if (!line.medicine_id)
      continue
    const med = medicines.value.find(m => m.medicine_id === line.medicine_id)
    details.push({
      medicine_id: line.medicine_id,
      quantity: line.quantity,
      unit_price: med?.price ?? 0,
      usage: line.usage,
      dosage: line.dosage,
      days: line.days,
    })
  }
  if (!details.length) {
    message.warning('请至少选择一种药品')
    return
  }
  const res = createPrescription({
    register_id: reg.value.register_id,
    doctor_id: currentProfile.value.id as number,
    patient_id: reg.value.patient_id,
    details,
  })
  if (!res.ok) {
    message.error(res.message || '处方保存失败')
    return
  }
  message.success(`处方已保存，单号 ${res.prescription.prescription_no}，药品库存已扣减`)
}

function submitExams() {
  if (!reg.value || !currentProfile.value)
    return
  if (!examPick.value.length) {
    message.warning('请选择检查项目')
    return
  }
  for (const item_id of examPick.value)
    createApplication({ register_id: reg.value.register_id, doctor_id: currentProfile.value.id as number, patient_id: reg.value.patient_id, item_id, purpose: examPurpose.value })
  message.success('检查申请已生成，患者端可缴费后检查')
}

function finishVisit() {
  if (!reg.value)
    return
  updateRegistration(reg.value.register_id, {
    symptom_desc: symptom.value,
    diagnosis: diagnosis.value,
    status: 1,
    visiting: false,
  })
  message.success('接诊完成，已更新病历')
  router.replace('/doctor/processed')
}

function doHospital() {
  if (!reg.value || !currentProfile.value)
    return
  const r = applyHospital({
    register_id: reg.value.register_id,
    patient_id: reg.value.patient_id,
    doctor_id: currentProfile.value.id as number,
    diagnosis: zyDiag.value || diagnosis.value,
    expected_days: zyDays.value,
  })
  if (!r.ok) {
    message.error(r.message)
    return
  }
  message.success(r.message)
  showZy.value = false
}
</script>

<template>
  <div v-if="reg">
    <n-page-header title="处理挂号 / 诊疗" @back="router.replace('/doctor/queue')">
      <template #subtitle>
        单号 {{ reg.register_no }} · 患者ID {{ reg.patient_id }}
      </template>
    </n-page-header>

    <n-card class="mt-4" title="主诉与诊断">
      <n-form label-placement="top">
        <n-form-item label="症状描述 / 主诉">
          <n-input v-model:value="symptom" type="textarea" :rows="3" placeholder="录入患者主诉与临床症状信息" />
        </n-form-item>
        <n-form-item label="诊断结果">
          <n-input v-model:value="diagnosis" type="textarea" :rows="2" />
        </n-form-item>
      </n-form>
    </n-card>

    <n-card class="mt-4" title="药品处方">
      <n-table :single-line="false" size="small">
        <thead>
          <tr>
            <th>药品</th>
            <th>数量</th>
            <th>用法</th>
            <th>用量</th>
            <th>天数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(line, idx) in rxLines" :key="idx">
            <td>
              <n-select
                v-model:value="line.medicine_id"
                filterable
                placeholder="检索药品"
                :options="medicines.filter(m => m.status === 1).map(m => ({ label: `${m.name}（库存${m.stock}）`, value: m.medicine_id }))"
              />
            </td>
            <td style="width:100px">
              <n-input-number v-model:value="line.quantity" :min="1" />
            </td>
            <td>
              <n-input v-model:value="line.usage" />
            </td>
            <td>
              <n-input v-model:value="line.dosage" />
            </td>
            <td style="width:100px">
              <n-input-number v-model:value="line.days" :min="1" />
            </td>
          </tr>
        </tbody>
      </n-table>
      <n-space class="mt-3">
        <n-button dashed @click="addRxLine">
          添加药品行
        </n-button>
        <n-button type="primary" @click="savePrescription">
          保存处方
        </n-button>
      </n-space>
    </n-card>

    <n-card class="mt-4" title="申请检查">
      <n-form label-placement="top">
        <n-form-item label="检查项目（可多选）">
          <n-select
            v-model:value="examPick"
            multiple
            filterable
            :options="examItems.filter(e => e.status === 1).map(e => ({ label: `${e.item_name} ¥${e.price}`, value: e.item_id }))"
          />
        </n-form-item>
        <n-form-item label="检查目的">
          <n-input v-model:value="examPurpose" type="textarea" :rows="2" />
        </n-form-item>
        <n-button type="primary" @click="submitExams">
          提交检查申请
        </n-button>
      </n-form>
    </n-card>

    <n-card class="mt-4" title="住院与完成接诊">
      <n-space>
        <n-button type="warning" @click="showZy = true">
          申请当天入院
        </n-button>
        <n-button type="success" @click="finishVisit">
          完成接诊
        </n-button>
      </n-space>
    </n-card>

    <n-modal v-model:show="showZy" preset="dialog" title="住院申请">
      <n-form label-placement="top">
        <n-form-item label="入院诊断">
          <n-input v-model:value="zyDiag" type="textarea" :rows="2" />
        </n-form-item>
        <n-form-item label="预计住院天数">
          <n-input-number v-model:value="zyDays" :min="1" :max="60" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showZy = false">
          取消
        </n-button>
        <n-button type="primary" @click="doHospital">
          提交
        </n-button>
      </template>
    </n-modal>
  </div>
  <n-result v-else status="404" title="未找到挂号记录" description="请从待诊队列进入" />
</template>
