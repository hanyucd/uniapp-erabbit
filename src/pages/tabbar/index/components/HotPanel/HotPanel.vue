<script setup lang="ts">
import type { HotItem } from '@/types/home';

// 定义 props 接收数据
defineProps<{
  list: HotItem[];
}>();
</script>

<template>
  <!-- 推荐专区 -->
  <view class="panel hot">
    <view v-for="item in list" :key="item.id" class="item">
      <view class="title">
        <text class="title-text">
          {{ item.title }}
        </text>
        <text class="title-desc">
          {{ item.alt }}
        </text>
      </view>
      <navigator hover-class="none" :url="`/pages/module-goods/goods-hot/goods-hot?type=${item.type}`" class="cards">
        <image v-for="src in item.pictures" :key="src" class="image" mode="aspectFit" :src="src" />
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
@import './style.scss';
</style>
