<template>
  <view class="category">
    <navigator v-for="item in list" :key="item.id" class="category-item" hover-class="none">
      <image class="icon" :src="item.icon" />
      <text class="text">
        {{ item.name }}
      </text>
    </navigator>
  </view>
</template>

<script setup lang="ts">
import type { CategoryItem } from '@/types/home';

defineProps<{
  list: CategoryItem[];
}>();
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
