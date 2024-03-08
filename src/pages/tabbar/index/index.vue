<template>
  <view class="viewport">
    <NavBar />

    <DefSwiper :list="bannerList" />
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, inject, onMounted } from 'vue';
import NavBar from './components/NavBar/NavBar.vue';
import type { ApiType } from '@/types/api';
import type { BannerItem } from '@/types/home';

const $api = inject('$api') as ApiType;

// 轮播图
const bannerList = ref<BannerItem[]>([]);

onLoad(() => {
  console.log('加载 onLoad');

  getHomeBannerData();
});

onShow(() => {
  console.log('index Show');
});

// onMounted(() => {
//   console.log('index mounted');
// });

/**
 * 加载 banner
 */
const getHomeBannerData = async () => {
  const { result: bannerResult } = await $api.getBannerApi({ distributionSite: 1 });
  bannerList.value = bannerResult;
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
