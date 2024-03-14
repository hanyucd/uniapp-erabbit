<template>
  <view class="viewport">
    <!-- tabs -->
    <view class="tabs">
      <text
        v-for="(item, index) in orderTabs"
        :key="item.title"
        class="item"
        @click=" () => { activeIndex = index; item.isRender = true } "
      >
        {{ item.title }}
      </text>
      <!-- 游标 -->
      <view class="cursor" :style="{ left: activeIndex * 20 + '%' }" />
    </view>

    <!-- 滑动容器 -->
    <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
      <!-- 滑动项 -->
      <swiper-item v-for="item in orderTabs" :key="item.title">
        <!-- 订单列表 -->
        <OrderList v-if="item.isRender" :order-state="item.orderState" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import OrderList from './components/OrderList/OrderList.vue';
import { ref } from 'vue';

// 获取页面参数
const query = defineProps<{
  type: string;
}>();

// tabs 数据
const orderTabs = ref([
  { orderState: 0, title: '全部', isRender: false },
  { orderState: 1, title: '待付款', isRender: false },
  { orderState: 2, title: '待发货', isRender: false },
  { orderState: 3, title: '待收货', isRender: false },
  { orderState: 4, title: '待评价', isRender: false },
]);

// 高亮下标
const activeIndex = ref(orderTabs.value.findIndex((v) => v.orderState === Number(query.type)));

// 默认渲染容器
orderTabs.value[activeIndex.value].isRender = true;
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
