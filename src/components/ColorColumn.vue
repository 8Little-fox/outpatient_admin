<script lang="ts" setup>
withDefaults(defineProps<{ text?: string, danger?: boolean }>(), { text: '', danger: false })
</script>

<template>
  <n-button quaternary :type="danger ? 'warning' : 'success'">
    {{ text }}
  </n-button>
</template>
