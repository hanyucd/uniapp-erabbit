<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">
      猜你喜欢
    </text>
  </view>
  <view class="guess">
    <navigator v-for="item in guessList" :key="item.id" class="guess-item" :url="`/pages/module-goods/goods/goods?id=${item.id}`">
      <image class="image" mode="aspectFill" :src="item.picture" />
      <view class="name">
        {{ item.name }}
      </view>
      <view class="price">
        <text class="small">
          ¥
        </text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text">
    {{ finish ? '没有更多数据~' : '正在加载...' }}
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import type { GuessItem } from '@/types/home';
import type { PageParams } from '@/types/common';
import type { ApiType } from '@/types/api';

const $api = inject('$api') as ApiType;

// 猜你喜欢的列表
const guessList = ref<GuessItem[]>([]);
// 已结束标记
const finish = ref(false);

// 分页参数 | Required<T> 把一个对象的属性转换成必选
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
};

onMounted(() => {
  _getHomeGoodsGuessLikeData();
});

// 获取猜你喜欢数据
const _getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  if (finish.value === true) return uni.showToast({ icon: 'none', title: '没有更多数据~' });
  
  const { result: guessResult } = await $api.getGoodsGuessLikeApi(pageParams);

  guessList.value.push(...guessResult.items);

  // 分页条件
  if (pageParams.page < guessResult.pages) {
    // 页码累加
    pageParams.page++;
  } else {
    finish.value = true;
  }
};

// 重置数据
const resetData = () => {
  pageParams.page = 1;
  guessList.value = [];
  finish.value = false;
};

defineExpose({
  getMoreGuessLike: _getHomeGoodsGuessLikeData,
  resetGuessLikeData: resetData
});
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
