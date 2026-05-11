<script lang="ts" setup>
withDefaults(defineProps<{ isDel?: boolean, isEdit?: boolean }>(), { isDel: false, isEdit: true })
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div>
    <n-button v-if="isEdit" quaternary type="primary" @click="emit('edit')">
      修改
    </n-button>
    <n-popconfirm
      v-if="isDel"
      @positive-click="emit('delete')"
    >
      <template #trigger>
        <n-button quaternary type="info">
          删除
        </n-button>
      </template>
      确认删除吗？
    </n-popconfirm>
  </div>
</template>
