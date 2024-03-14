<template>
  <div />
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;

// 获取页面参数
const query = defineProps<{
  id: string;
}>();
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
