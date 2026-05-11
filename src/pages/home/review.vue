<script setup lang="ts">
import { useDoctorStore, useLoginStore, useRegistrationStore, useReviewStore } from '~/store'

const message = useMessage()
const { list } = useRegistrationStore()
const { list: reviews, addReview } = useReviewStore()
const { dataList: doctors } = useDoctorStore()
const { currentProfile } = useLoginStore()

const doneRegs = computed(() =>
  list.value.filter(
    r =>
      r.patient_id === currentProfile.value?.id
      && r.status === 1,
  ),
)

function dname(id: number) {
  return doctors.value.find(d => d.doctor_id === id)?.name ?? id
}

function hasReview(rid: number) {
  return reviews.value.some(x => x.register_id === rid)
}

const show = ref(false)
const pick = ref<number | null>(null)
const score = ref(5)
const content = ref('')

function open(rid: number) {
  pick.value = rid
  score.value = 5
  content.value = ''
  show.value = true
}

function submit() {
  if (!pick.value || !currentProfile.value)
    return
  const r = list.value.find(x => x.register_id === pick.value)
  if (!r) {
    message.error('记录不存在')
    return
  }
  addReview({
    register_id: pick.value,
    patient_id: currentProfile.value.id as number,
    doctor_id: r.doctor_id,
    score: score.value,
    content: content.value || '满意',
  })
  message.success('感谢您的评价')
  show.value = false
}
</script>

<template>
  <div>
    <n-h2 prefix="bar">
      评价医生
    </n-h2>
    <n-empty v-if="!doneRegs.length" description="暂无已就诊记录可评价" />
    <n-list v-else bordered>
      <n-list-item v-for="r in doneRegs" :key="r.register_id">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span>{{ r.register_no }} · {{ dname(r.doctor_id) }} · {{ r.register_date }}</span>
          <n-button v-if="!hasReview(r.register_id)" size="small" type="primary" tertiary @click="open(r.register_id)">
            评价
          </n-button>
          <n-tag v-else type="success" size="small">
            已评价
          </n-tag>
        </div>
      </n-list-item>
    </n-list>

    <n-modal v-model:show="show" preset="dialog" title="服务质量评价">
      <n-form label-placement="top">
        <n-form-item label="评分（1-5）">
          <n-rate v-model:value="score" :count="5" />
        </n-form-item>
        <n-form-item label="评价内容">
          <n-input v-model:value="content" type="textarea" :rows="3" maxlength="300" show-count />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="show = false">
          取消
        </n-button>
        <n-button type="primary" @click="submit">
          提交
        </n-button>
      </template>
    </n-modal>
  </div>
</template>
