<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 收货地址 -->
    <navigator v-if="selecteAddress" class="shipment" hover-class="none" url="/pages/module-profile/profile-address/profile-address?from=order">
      <view class="user"> {{ selecteAddress.receiver }} {{ selecteAddress.contact }} </view>
      <view class="address"> {{ selecteAddress.fullLocation }} {{ selecteAddress.address }} </view>
      <text class="icon icon-right" />
    </navigator>
    <navigator v-else class="shipment" hover-class="none" url="/pages/module-profile/profile-address/profile-address?from=order">
      <view class="address">请选择收货地址</view>
      <text class="icon icon-right" />
    </navigator>
    
    <!-- 商品信息 -->
    <view class="goods">
      <navigator v-for="item in orderPre?.goods" :key="item.skuId" :url="`/pages/module-goods/goods/goods?id=${item.id}`" class="item" hover-class="none">
        <image class="picture" :src="item.picture" />
        <view class="meta">
          <view class="name ellipsis"> {{ item.name }} </view>
          <view class="attrs">{{ item.attrsText }}</view>
          <view class="prices">
            <view class="pay-price symbol">{{ item.payPrice }}</view>
            <view class="price symbol">{{ item.price }}</view>
          </view>
          <view class="count">x{{ item.count }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">配送时间</text>
        <picker :range="deliveryList" range-key="text" @change="onChangeDelivery">
          <view class="icon-fonts picker">{{ activeDelivery.text }}</view>
        </picker>
      </view>
      <view class="item">
        <text class="text">订单备注</text>
        <input v-model="buyerMessage" class="input" :cursor-spacing="30" placeholder="选题，建议留言前先与商家沟通确认">
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <text class="number symbol">{{ orderPre?.summary.totalPrice.toFixed(2) }}</text>
      </view>
      <view class="item">
        <text class="text">运费: </text>
        <text class="number symbol">{{ orderPre?.summary.postFee.toFixed(2) }}</text>
      </view>
    </view>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="total-pay symbol">
      <text class="number">{{ orderPre?.summary.totalPayPrice.toFixed(2) }}</text>
    </view>
    <view class="button" :class="{ disabled: !selecteAddress?.id }" @cick="onOrderSubmit">
      提交订单
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, computed, inject } from 'vue';
import { useAddressStore } from '@/stores/modules/addressModule';
import type { OrderPreResult } from '@/types/order';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();

const addressStore = useAddressStore();

// 页面参数
const query = defineProps<{
  skuId?: string;
  count?: string;
  orderId?: string;
}>();

// 配送时间
const deliveryList = ref([
  { type: 1, text: '时间不限 (周一至周日)' },
  { type: 2, text: '工作日送 (周一至周五)' },
  { type: 3, text: '周末配送 (周六至周日)' },
]);
// 订单备注
const buyerMessage = ref('');

// 当前配送时间下标
const activeIndex = ref(0);
// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value]);
// 修改配送时间
const onChangeDelivery: UniHelper.SelectorPickerOnChange = (ev) => {
  activeIndex.value = ev.detail.value;
};

const orderPre = ref<OrderPreResult>();

onLoad(() => {
  getMemberOrderPreData();
});
/**
 * 获取订单信息
 */
const getMemberOrderPreData = async () => {
  if (query.count && query.skuId) {
    const res = await $api.getMemberOrderPreNowApi({ count: query.count, skuId: query.skuId, });
    orderPre.value = res.result;
  } else if (query.orderId) {
    // 再次购买
    const res = await $api.getMemberOrderRepurchaseByIdApi(query.orderId);
    orderPre.value = res.result;
  } else {
    const res = await $api.getMemberOrderPreApi();
    orderPre.value = res.result;
  }
};

// 收货地址
const selecteAddress = computed(() => {
  return addressStore.selectedAddress || orderPre.value?.userAddresses.find((v) => v.isDefault);
});

// 提交订单
const onOrderSubmit = async () => {

};
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
