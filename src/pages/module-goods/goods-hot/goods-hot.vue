<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image class="image" mode="widthFix" :src="bannerPicture" />
    </view>

    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        v-for="(item, index) in subTypes"
        :key="item.id"
        class="text"
        :class="{ active: index === activeIndex }"
        @click="activeIndex = index"
      >
        {{ item.title }}
      </text>
    </view>

    <!-- 推荐列表 -->
    <scroll-view
      v-for="(item, index) in subTypes"
      v-show="activeIndex === index"
      :key="item.id"
      class="scroll-view"
      enable-back-to-top
      scroll-y
      @scrolltolower="onScrolltolowerEvt"
    >
      <view class="goods">
        <navigator
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          hover-class="none"
          class="navigator"
          :url="`/pages/module-goods/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture" />
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
      <view class="loading-text">
        {{ item.finish ? '没有更多数据了~' : '正在加载...' }}
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import type { SubTypeItem } from '@/types/hot';
import type { ApiType } from '@/types/api';

const $api = inject('$api') as ApiType;

// setup 语法获取页面参数方式 之一
const query = defineProps<{
  type: string;
}>();

// 热门推荐页 标题和url
const urlMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
];

const currUrlMap = urlMap.find(v => v.type === query.type);
// 动态设置标题
uni.setNavigationBarTitle<UniApp.SetNavigationBarTitleOptions>({ title: currUrlMap?.title || '' });

// 推荐封面图
const bannerPicture = ref('');
// 推荐选项
const subTypes = ref<(SubTypeItem & { finish?: boolean })[]>([]);
// 高亮的下标
const activeIndex = ref(0);

onLoad(() => {
  _getHotRecommendData();
});

/**
 * 获取热门推荐数据
 */
const _getHotRecommendData = async () => {
  const res = await $api.getHotRecommendAPIApi(currUrlMap!.url, {
    page: import.meta.env.DEV ? 2 : 1, pageSize: 10
  });
  bannerPicture.value = res.result.bannerPicture;
  subTypes.value = res.result.subTypes;
};

// 滚动触底
const onScrolltolowerEvt = async () => {
  // 获取当前选项
  const currsubTypes = subTypes.value[activeIndex.value];
  // 分页条件
  if (currsubTypes.goodsItems.page < currsubTypes.goodsItems.pages) {
    // 当前页码累加
    currsubTypes.goodsItems.page++;
  } else {
    // 标记已结束
    currsubTypes.finish = true;
    // 退出并轻提示
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' });
  }

  // 调用API传参
  const res = await $api.getHotRecommendAPIApi(currUrlMap!.url, {
    subType: currsubTypes.id,
    page: currsubTypes.goodsItems.page,
    pageSize: currsubTypes.goodsItems.pageSize,
  });
  // 新的列表选项
  const newsubTypes = res.result.subTypes[activeIndex.value];
  // 数组追加
  currsubTypes.goodsItems.items.push(...newsubTypes.goodsItems.items);
};
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
