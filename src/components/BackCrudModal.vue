<script setup lang="ts">
/**
 * 管理端统一表单弹窗：卡片样式 + 底部「取消 / 确定」
 * （避免 n-modal preset=dialog 未配置文案时不显示按钮的问题）
 */
const props = withDefaults(
  defineProps<{
    title: string
    /** 追加到弹窗外的 class */
    cardClass?: string
    /** 「确定」按钮类型 */
    confirmBtnType?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  }>(),
  { cardClass: '', confirmBtnType: 'primary' },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = defineModel<boolean>('show', { required: true })

function onCancel() {
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="title"
    :class="['back-crud-modal', 'max-w-[640px]', props.cardClass].filter(Boolean)"
    :mask-closable="false"
  >
    <slot />
    <template #footer>
      <n-space justify="end">
        <n-button @click="onCancel">
          取消
        </n-button>
        <n-button :type="props.confirmBtnType" @click="onConfirm">
          确定
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
