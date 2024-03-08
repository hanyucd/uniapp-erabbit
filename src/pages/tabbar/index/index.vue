<template>
  <view class="viewport">
    <NavBar />

    <DefSwiper :list="bannerList" />
    <CategoryPanel :list="categoryList" />
  </view>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar/NavBar.vue';
import CategoryPanel from './components/CategoryPanel/CategoryPanel.vue';
import { onLoad } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import type { ApiType } from '@/types/api';
import type { BannerItem, CategoryItem } from '@/types/home';

const $api = inject('$api') as ApiType;

// 轮播图
const bannerList = ref<BannerItem[]>([]);
// 获取前台分类数据
const categoryList = ref<CategoryItem[]>([]);

onLoad(async () => {
  console.log('加载 onLoad');

  await Promise.all([_getHomeBannerData(), _getHomeCategoryData()]);

});

/**
 * 加载 banner
 */
const _getHomeBannerData = async () => {
  const { result: bannerResult } = await $api.getBannerApi({ distributionSite: 1 });
  bannerList.value = bannerResult;
};

/**
 * 加载 分类
 */
const _getHomeCategoryData = async () => {
  const { result: categoryData } = await $api.getHomeCategoryBannerApi();
  categoryList.value = categoryData;
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
