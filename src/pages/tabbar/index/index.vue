<template>
  <view class="viewport">
    <NavBar />

    <!-- 轮播图 -->
    <DefSwiper :list="bannerList" />
    <!-- 分类面板 -->
    <CategoryPanel :list="categoryList" />
    <!-- 热门推荐 -->
    <HotPanel :list="hotList" />
  </view>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar/NavBar.vue';
import CategoryPanel from './components/CategoryPanel/CategoryPanel.vue';
import HotPanel from './components/HotPanel/HotPanel.vue';
import { onLoad } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import type { ApiType } from '@/types/api';
import type { BannerItem, CategoryItem, HotItem } from '@/types/home';

const $api = inject('$api') as ApiType;

// 轮播图
const bannerList = ref<BannerItem[]>([]);
// 获取前台分类数据
const categoryList = ref<CategoryItem[]>([]);
  // 热门推荐数据
const hotList = ref<HotItem[]>([]);

onLoad(async () => {
  await Promise.all([_getHomeBannerData(), _getHomeCategoryData(), _getHomeHotData()]);
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

/**
 * 加载 热门
 */
const _getHomeHotData = async () => {
  const { result: hotData } = await $api.getHomeHotApi();
  hotList.value = hotData;
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  // overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
