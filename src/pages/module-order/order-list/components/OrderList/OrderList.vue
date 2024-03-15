<template>
  <scroll-view enable-back-to-top scroll-y class="orders" refresher-enabled :refresher-triggered="isTriggered" @refresherrefresh="onRefresherrefresh" @scrolltolower="_getMemberOrderData">
    <view v-for="order in orderList" :key="order.id" class="card">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ order.createTime }}</text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[order.orderState].text }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text v-if="order.orderState >= OrderState.DaiPingJia" class="icon-delete" @click="onOrderDelete(order.id)" />
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator v-for="item in order.skus" :key="item.id" class="goods" :url="`/pages/module-order/order-detail/order-detail?id=${order.id}`" hover-class="none">
        <view class="cover">
          <image class="image" mode="aspectFit" :src="item.image" />
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="type">{{ item.attrsText }}</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ order.totalNum }}件商品</text>
        <text>实付</text>
        <text class="amount"> <text class="symbol">¥</text>{{ order.payMoney }}</text>
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="order.orderState === OrderState.DaiFuKuan">
          <view class="button primary" @click="onOrderPay(order.id)">去支付</view>
        </template>
        <template v-else>
          <navigator class="button secondary" :url="`/pages/module-order/order-create/order-create?orderId=${order.id}`" hover-class="none">
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view v-if="order.orderState === OrderState.DaiShouHuo" class="button primary" @click="onOrderConfirm(order.id)">
            确认收货
          </view>
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { OrderState } from '@/enums';
import { orderStateList } from '@/consts';
import type { OrderItem, OrderListParams } from '@/types/order';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;

// 定义 porps
const props = defineProps<{
  orderState: number;
}>();

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();

// 获取订单列表
const orderList = ref<OrderItem[]>([]);
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false);
// 是否分页结束
const isFinish = ref(false);

// 请求参数
const queryParams: Required<OrderListParams> = {
  page: 1,
  pageSize: 5,
  orderState: props.orderState,
};

onMounted(() => {
  _getMemberOrderData();
});

/**
 * 获取订单列表
 */
const _getMemberOrderData = async () => {
  // 如果数据出于加载中，退出函数
  if (isLoading.value) return;
  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' });
  }
  // 发送请求前，标记为加载中
  isLoading.value = true;
  // 发送请求
  const res = await $api.getMemberOrderApi(queryParams);
  // 发送请求后，重置标记
  isLoading.value = false;
  // 数组追加
  orderList.value.push(...res.result.items);
  // 分页条件
  if (queryParams.page < res.result.pages) {
    // 页码累加
    queryParams.page++;
  } else {
    // 分页已结束
    isFinish.value = true;
  }
};

// 是否触发下拉刷新
const isTriggered = ref(false);
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true;
  // 重置数据
  queryParams.page = 1;
  orderList.value = [];
  isFinish.value = false;
  // 加载数据
  await _getMemberOrderData();
  // 关闭动画
  isTriggered.value = false;
};

/**
 * 删除订单
 */
const onOrderDelete = (id: string) => {
  uni.showModal({
    content: '你确定要删除该订单？',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        await $api.deleteMemberOrderApi({ ids: [id] });
        // 删除成功，界面中删除订单
        const index = orderList.value.findIndex((v) => v.id === id);
        orderList.value.splice(index, 1);
      }
    },
  });
};

// 确认收货
const onOrderConfirm = (id: string) => {
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        await $api.putMemberOrderReceiptByIdApi(id);
        uni.showToast({ icon: 'success', title: '确认收货成功' });
        // 确认成功，更新为待评价
        const order = orderList.value.find((v) => v.id === id);
        order!.orderState = OrderState.DaiPingJia;
      }
    },
  });
};

/**
 * 订单支付
 */
const onOrderPay = async (id: string) => {
  if (import.meta.env.DEV) {
    // 开发环境模拟支付
    await $api.getPayMockApi({ orderId: id });
  } else {
    // #ifdef MP-WEIXIN
    // 正式环境微信支付
    const res = await $api.getPayWxPayMiniPayApi({ orderId: id });
    await wx.requestPayment(res.result);
    // #endif

    // #ifdef H5 || APP-PLUS
    // H5端 和 App 端未开通支付-模拟支付体验
    await $api.getPayMockApi({ orderId: id });
    // #endif
  }
  // 成功提示
  uni.showToast({ title: '支付成功' });
  // 更新订单状态
  const order = orderList.value.find((v) => v.id === id);
  order!.orderState = OrderState.DaiFaHuo;
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
