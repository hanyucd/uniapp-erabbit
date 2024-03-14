<template>
  <view class="navbar" :style="{ paddingTop: safeAreaTop + 10 + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <!-- <image class="logo-image" src="@/static/images/logo.png" /> -->
      <text style="color: #fff;">小兔儿</text>
      <text class="logo-text">新鲜 · 亲民 · 快捷</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <text class="icon-search">
        搜索商品
      </text>
      <text class="icon-scan" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 系统信息
const systemInfo = ref<UniApp.GetSystemInfoResult>(uni.getSystemInfoSync());
// 顶部安全距离
const safeAreaTop = computed(() => systemInfo.value.safeAreaInsets!.top);

// console.log(systemInfo.value);
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
