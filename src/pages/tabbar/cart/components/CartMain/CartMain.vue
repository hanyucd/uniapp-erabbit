<template>
  <scroll-view enable-back-to-top scroll-y class="scroll-view" @scrolltolower="onScrolltolowerEvt">
    <!-- 已登录: 显示购物车 -->
    <template v-if="memberStore.profile">
      <!-- 购物车列表 -->
      <view v-if="showCartList" class="cart-list">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        <!-- 滑动操作分区 -->
        <uni-swipe-action>
          <!-- 滑动操作项 -->
          <uni-swipe-action-item v-for="item in cartList" :key="item.skuId" class="cart-swipe">
            <!-- 商品信息 -->
            <view class="goods">
              <!-- 选中状态 -->
              <text class="checkbox" :class="{ checked: item.selected }" @click="onChangeSelected(item)" />
              <navigator :url="`/pages/module-goods/goods/goods?id=${item.id}`" hover-class="none" class="navigator">
                <image mode="aspectFill" class="picture" :src="item.picture" />
                <view class="meta">
                  <view class="name ellipsis">{{ item.name }}</view>
                  <view class="attrsText ellipsis">{{ item.attrsText }}</view>
                  <view class="price">{{ item.nowPrice }}</view>
                </view>
              </navigator>
              <!-- 商品数量 -->
              <view class="count">
                <vk-data-input-number-box v-model="item.count" :min="1" :max="item.stock" :index="item.skuId" @change="onChangeCount" />
              </view>
            </view>
            <!-- 右侧删除按钮 -->
            <template #right>
              <view class="cart-swipe-right">
                <button class="button delete-button" @tap="onDeleteCart(item.skuId)">删除</button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <!-- 购物车空状态 -->
      <view v-else class="cart-blank">
        <image src="/static/images/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator url="/pages/tabbar/index/index" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>

      <!-- 吸底工具栏 -->
      <view v-if="showCartList" class="toolbar" :style="{ paddingBottom: safeAreaInsetBottom ? safeAreaInsets?.bottom + 'px' : 0 }">
        <text class="all" :class="{ checked: isSelectedAll }" @click="onChangeSelectedAll">全选</text>
        <text class="text">合计:</text>
        <text class="amount">{{ selectedCartListMoney }}</text>
        <view class="button-grounp">
          <view class="button payment-button" :class="{ disabled: selectedCartListCount === 0 }" @click="gotoPayment">
            去结算({{ selectedCartListCount }})
          </view>
        </view>
      </view>
    </template>

    <!-- 未登录: 提示登录 -->
    <view v-else class="login-blank">
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>

    <!-- 猜你喜欢 -->
    <GuessLike ref="guessLikeRef" />
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height" />
  </scroll-view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, computed, inject } from 'vue';
import { useMemberStore } from '@/stores';
import { useGuessLikeHook } from '@/hooks/useGoodsHook';
import type { InputNumberBoxEvent } from '@/components/vk-data-input-number-box/vk-data-input-number-box';
import type { CartItem } from '@/types/cart';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;


const { guessLikeRef, onScrolltolowerEvt } = useGuessLikeHook();
// 获取会员信息
const memberStore = useMemberStore();

// 是否适配底部安全区域
defineProps<{
  safeAreaInsetBottom?: boolean;
}>();

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();

onLoad(() => {
});

onShow(() => {
  if (memberStore.profile) {
    getMemberCartData();
  }
});

// 优化购物车空列表状态，默认展示列表
const showCartList = ref(true);
// 获取购物车数据
const cartList = ref<CartItem[]>([]);

// 计算全选状态
const isSelectedAll = computed(() => {
  return cartList.value.length && cartList.value.every((v) => v.selected);
});

// 计算选中单品列表
const selectedCartList = computed(() => {
  return cartList.value.filter((v) => v.selected);
});

// 计算选中总件数
const selectedCartListCount = computed(() => {
  return selectedCartList.value.reduce((sum, item) => sum + item.count, 0);
});

// 计算选中总金额
const selectedCartListMoney = computed(() => {
  return selectedCartList.value
    .reduce((sum, item) => sum + item.count * item.nowPrice, 0)
    .toFixed(2);
});

/**
 * 获取购物车列表
 */
const getMemberCartData = async () => {
  const res = await $api.getMemberCartApi();
  cartList.value = res.result;
  showCartList.value = res.result.length > 0;
};

// 修改选中状态-单品修改
const onChangeSelected = (item: CartItem) => {};

// 修改商品数量
const onChangeCount = (ev: InputNumberBoxEvent) => {};

// 点击删除按钮
const onDeleteCart = (skuId: string) => {
  // 弹窗二次确认
  uni.showModal({
    content: '是否删除',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        // 后端删除单品
        await $api.deleteMemberCartApi({ ids: [skuId] });
        // 重新获取列表
        getMemberCartData();
      }
    },
  });
};

// 修改选中状态-全选修改
const onChangeSelectedAll = () => {};

// 结算按钮
const gotoPayment = () => {
  if (selectedCartListCount.value === 0) {
    return uni.showToast({ icon: 'none', title: '请选择商品', });
  }
  // 跳转到结算页
  uni.navigateTo({ url: '/pagesOrder/create/create' });
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
