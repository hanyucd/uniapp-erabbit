<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl" />
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 指示点 -->
    <view class="indicator">
      <text v-for="(item, index) in list?.length" :key="item" class="dot" :class="{ active: index === activeIndex }" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BannerItem } from '@/types/home';

defineProps<{
  list?: BannerItem[];
}>();

const activeIndex = ref(0);

/**
 * current 改变时会触发
 */
const onChange: UniHelper.SwiperOnChange = (event) => {
  activeIndex.value = event.detail.current;
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
