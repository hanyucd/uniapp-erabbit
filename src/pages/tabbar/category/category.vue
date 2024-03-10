<template>
  <view class="viewport">
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">
          女靴
        </text>
      </view>
    </view>

    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          <text class="name">
            {{ item.name }}
          </text>
        </view>
      </scroll-view>
      <!-- 右侧：二级分类 -->
      <scroll-view enable-back-to-top class="secondary" scroll-y>
        <!-- 焦点图 -->
        <DefSwiper class="banner" :list="bannerList" />
        <!-- 内容区域 -->
        <view v-for="item in subCategoryList" :key="item.id" class="panel">
          <view class="title">
            <text class="name">
              {{ item.name }}
            </text>
            <navigator class="more" hover-class="none">
              全部
            </navigator>
          </view>
          <view class="section">
            <navigator
              v-for="goods in item.goods"
              :key="goods.id"
              class="goods"
              hover-class="none"
              :url="`/pages/module-goods/goods/goods?id=${goods.id}`"
            >
              <image class="image" :src="goods.picture" />
              <view class="name ellipsis">
                {{ goods.name }}
              </view>
              <view class="price">
                <text class="symbol">
                  ¥
                </text>
                <text class="number">
                  {{ goods.price }}
                </text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, computed, inject } from 'vue';
import type { CategoryTopItem } from '@/types/category';
import type { BannerItem } from '@/types/home';
import type { ApiType } from '@/types/api';

const $api = inject('$api') as ApiType;


onLoad(async () => {
  await Promise.all([_getCategoryTopData(), _getHomeBannerData()]);
});

// 获取轮播图数据
const bannerList = ref<BannerItem[]>([]);

// 获取分类列表数据
const categoryList = ref<CategoryTopItem[]>([]);
const activeIndex = ref(0);

// 提取当前二级分类数据
const subCategoryList = computed(() => {
  return categoryList.value[activeIndex.value]?.children || [];
});
/**
 * 加载 banner
 */
const _getHomeBannerData = async () => {
  const { result: bannerResult } = await $api.getBannerApi({ distributionSite: 2 });
  bannerList.value = bannerResult;
};

/**
 * 获取分类列表数据
 */
const _getCategoryTopData = async () => {
  const res = await $api.getCategoryTopApi();
  categoryList.value = res.result;
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
