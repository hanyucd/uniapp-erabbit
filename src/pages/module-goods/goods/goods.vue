<template>
  <!-- SKU弹窗组件 -->
  <vk-data-goods-sku-popup
    ref="skuPopupRef"
    v-model="isShowSku"
    :localdata="localdata"
    :mode="mode"
    add-cart-background-color="#FFA868"
    buy-now-background-color="#27BA9B"
    :actived-style="{
      color: '#27BA9B',
      borderColor: '#27BA9B',
      backgroundColor: '#E9F8F5',
    }"
    @add-cart="onAddCart"
    @buy-now="onBuyNow"
  />
  
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper :style="{ height: '100%' }" circular @change="onChange">
          <swiper-item v-for="item in goods?.mainPictures" :key="item">
            <image class="image" mode="aspectFill" :src="item" @click="onTapImage(item)" />
          </swiper-item>
        </swiper>

        <view class="indicator">
          <text class="current">
            {{ currentIndex + 1 }}
          </text>
          <text class="split">
            /
          </text>
          <text class="total">
            {{ goods?.mainPictures.length }}
          </text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">
            ¥
          </text>
          <text class="number">
            {{ goods?.price }}
          </text>
        </view>
        <view class="name ellipsis">
          {{ goods?.name }}
        </view>
        <view class="desc">
          {{ goods?.desc }}
        </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view class="item arrow" @tap="openSkuPopup(SkuMode.Both)">
          <text class="label">
            选择
          </text>
          <text class="text ellipsis">
            {{ selectArrText }}
          </text>
        </view>
        <view class="item arrow" @tap="openPopup('address')">
          <text class="label">
            送至
          </text>
          <text class="text ellipsis">
            请选择收获地址
          </text>
        </view>
        <view class="item arrow" @tap="openPopup('service')">
          <text class="label">
            服务
          </text>
          <text class="text ellipsis">
            无忧退 快速退款 免费包邮
          </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view v-for="item in goods?.details.properties" :key="item.name" class="item">
            <text class="label">
              {{ item.name }}
            </text>
            <text class="value">
              {{ item.value }}
            </text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image v-for="item in goods?.details.pictures" :key="item" class="image" mode="widthFix" :src="item" />
        <!-- <view>
        </view> -->
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>

      <view class="content">
        <navigator v-for="item in goods?.similarProducts" :key="item.id" class="goods" hover-class="none" :url="`/pages/module-goods/goods/goods?id=${item.id}`">
          <image class="image" mode="aspectFill" :src="item.picture" />
          <view class="name ellipsis">
            {{ item.name }}
          </view>
          <view class="price">
            <text class="symbol">
              ¥
            </text>
            <text class="number">
              {{ item.price }}
            </text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view v-if="goods" class="toolbar" :style="{ paddingBottom: safeAreaInsets!.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart" />收藏</button>
      <!-- #ifdef MP-WEIXIN -->
      <button class="icons-button" open-type="contact">
        <text class="icon-handset" />客服
      </button>
      <!-- #endif -->
      <navigator class="icons-button" url="/pages/tabbar/cart/cart" open-type="switchTab">
        <text class="icon-cart" />购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="openSkuPopup(SkuMode.Cart)"> 加入购物车 </view>
      <view class="payment" @tap="openSkuPopup(SkuMode.Buy)"> 立即购买 </view>
    </view>
  </view>

  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <AddressPanel v-if="popupName === 'address'" @close="popup?.close()" />
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>
</template>

<script setup lang="ts">
import type { SkuPopupEvent, SkuPopupInstance, SkuPopupLocaldata, } from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup';
import AddressPanel from './components/AddressPanel/AddressPanel.vue';
import ServicePanel from './components/ServicePanel/ServicePanel.vue';

import { onLoad } from '@dcloudio/uni-app';
import { ref, computed, inject } from 'vue';
import type { GoodsResult } from '@/types/goods';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;

// 接收页面参数
const query = defineProps<{
  id: string;
}>();

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
// 商品详情信息
const goods = ref<GoodsResult>();
// 商品信息
const localdata = ref({} as SkuPopupLocaldata);

onLoad(() => {
  _getGoodsDetail();
});

/**
 * 获取商品详情
 */
const _getGoodsDetail = async () => {
  const { result: goodsResult } = await $api.getGoodsDetailApi({ id: query.id });
  goods.value = goodsResult;

  // SKU组件所需格式
  localdata.value = {
    _id: goodsResult.id,
    name: goodsResult.name,
    goods_thumb: goodsResult.mainPictures[0],
    spec_list: goodsResult.specs.map((v) => {
      return {
        name: v.name,
        list: v.values,
      };
    }),
    sku_list: goodsResult.skus.map((v) => {
      return {
        _id: v.id,
        goods_id: goodsResult.id,
        goods_name: goodsResult.name,
        image: v.picture,
        price: v.price * 100, // 注意：需要乘以 100
        stock: v.inventory,
        sku_name_arr: v.specs.map((vv) => vv.valueName),
      };
    }),
  };
};

// 轮播图变化时
const currentIndex = ref(0);
const onChange: UniHelper.SwiperOnChange = (ev) => {
  currentIndex.value = ev.detail.current;
};

// 点击图片时
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({ current: url, urls: goods.value!.mainPictures });
};

// SKU按钮模式
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}

// SKU组件实例
const skuPopupRef = ref<SkuPopupInstance>();
// 计算被选中的值
const selectArrText = computed(() => {
  return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格';
});

// sku 模式
const mode = ref<SkuMode>(SkuMode.Cart);
// 是否显示SKU组件
const isShowSku = ref(false);

/**
 * 打开SKU弹窗修改按钮模式
 */
const openSkuPopup = (val: SkuMode) => {
  // 显示SKU弹窗
  isShowSku.value = true;
  // 修改按钮模式
  mode.value = val;
};

/**
 * 加入购物车事件
 */
const onAddCart = async (ev: SkuPopupEvent) => {
  console.log(ev);
  await $api.postMemberCartApi({ skuId: ev._id, count: ev.buy_num });
  uni.showToast({ title: '添加成功' });
  isShowSku.value = false;
};

/**
 * 立即购买
 */
const onBuyNow = (ev: SkuPopupEvent) => {
  // uni.navigateTo({ url: `/pagesOrder/create/create?skuId=${ev._id}&count=${ev.buy_num}` })
};

// uni-ui 弹出层组件 ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType ) => void;
  close: () => void;
}>();

// 弹出层条件渲染
const popupName = ref<'address' | 'service'>();

// 弹出层条件渲染
const openPopup = (name: typeof popupName.value) => {
  popupName.value = name; // 修改弹出层名称
  popup.value?.open();
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
