<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image class="image" mode="widthFix" :src="bannerPicture" />
    </view>
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

onLoad(() => {
  _getHotRecommendData();
});

/**
 * 获取热门推荐数据
 */
const _getHotRecommendData = async () => {
  const res = await $api.getHotRecommendAPIApi(currUrlMap!.url, {
    page: import.meta.env.DEV ? 30 : 1, pageSize: 10
  });
  bannerPicture.value = res.result.bannerPicture;
  console.log(res);
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
