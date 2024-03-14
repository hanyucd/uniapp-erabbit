<template>
  <!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="wrap">
      <navigator v-if="pages.length > 1" open-type="navigateBack" class="back icon-left" />
      <navigator v-else url="/pages/tabbar/index/index" open-type="switchTab" class="back icon-home" />
      <view class="title">订单详情</view>
    </view>
  </view>

  <scroll-view id="scroller" enable-back-to-top scroll-y class="viewport" @scrolltolower="onScrolltolowerEvt">
    <template v-if="order">
      <!-- 订单状态 -->
      <view class="overview" :style="{ paddingTop: safeAreaInsets!.top + 20 + 'px' }">
        <!-- 待付款状态:展示倒计时 -->
        <template v-if="order.orderState === OrderState.DaiFuKuan">
          <view class="status icon-clock">等待付款</view>
          <view class="tips">
            <text class="money">应付金额: ¥ {{ order.payMoney }}</text>
            <text class="time">支付剩余</text>
            <uni-countdown :second="order.countdown" color="#fff" splitor-color="#fff" :show-day="false" :show-colon="false" @timeup="onTimeup" />
          </view>
          <view class="button" @click="onOrderPay">去支付</view>
        </template>
        
        <!-- 其他订单状态:展示再次购买按钮 -->
        <template v-else>
          <!-- 订单状态文字 -->
          <view class="status"> {{ orderStateList[order.orderState].text }} </view>
          <view class="button-group">
            <navigator class="button" :url="`/pages/module-order/order-create/order-create?orderId=${query.id}`" hover-class="none">
              再次购买
            </navigator>
            <!-- 待发货状态：模拟发货,开发期间使用,用于修改订单状态为已发货 -->
            <view v-if="isDev && order.orderState == OrderState.DaiFaHuo" class="button" @click="onOrderSend">
              模拟发货
            </view>
            <!-- 待收货状态: 展示确认收货按钮 -->
            <view v-if="order.orderState === OrderState.DaiShouHuo" class="button" @click="onOrderConfirm">
              确认收货
            </view>
          </view>
        </template>
      </view>

      <!-- 配送状态 -->
      <view class="shipment">
        <!-- 订单物流信息 -->
        <view v-for="item in logisticList" :key="item.id" class="item">
          <view class="message">
            {{ item.text }}
          </view>
          <view class="date"> {{ item.time }} </view>
        </view>
        <!-- 用户收货地址 -->
        <view class="locate">
          <view class="user"> {{ order.receiverContact }} {{ order.receiverMobile }} </view>
          <view class="address"> {{ order.receiverAddress }} </view>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="goods">
        <view class="item">
          <navigator v-for="item in order.skus" :key="item.id" class="navigator" :url="`/pages/module-goods/goods/goods?id=${item.spuId}`" hover-class="none">
            <image class="cover" :src="item.image" />
            <view class="meta">
              <view class="name ellipsis">{{ item.name }}</view>
              <view class="type">{{ item.attrsText }}</view>
              <view class="price">
                <view class="actual">
                  <text class="symbol">¥</text>
                  <text>{{ item.curPrice }}</text>
                </view>
              </view>
              <view class="quantity">x{{ item.quantity }}</view>
            </view>
          </navigator>
          <!-- 待评价状态:展示按钮 -->
          <view v-if="order.orderState === OrderState.DaiPingJia" class="action">
            <view class="button primary">申请售后</view>
            <navigator url="" class="button"> 去评价 </navigator>
          </view>
        </view>
        <!-- 合计 -->
        <view class="total">
          <view class="row">
            <view class="text">商品总价: </view>
            <view class="symbol">{{ order.totalMoney }}</view>
          </view>
          <view class="row">
            <view class="text">运费: </view>
            <view class="symbol">{{ order.postFee }}</view>
          </view>
          <view class="row">
            <view class="text">应付金额: </view>
            <view class="symbol primary">{{ order.payMoney }}</view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="detail">
        <view class="title">订单信息</view>
        <view class="row">
          <view class="item">
            订单编号: {{ query.id }} <text class="copy" @click="onCopy(query.id)">复制</text>
          </view>
          <view class="item">下单时间: {{ order.createTime }}</view>
        </view>
      </view>

      <!-- 猜你喜欢 -->
      <GuessLike ref="guessLikeRef" />

      <!-- 底部操作栏 -->
      <view class="toolbar-height" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }" />
      <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
        <!-- 待付款状态:展示支付按钮 -->
        <template v-if="order.orderState === OrderState.DaiFuKuan">
          <view class="button primary" @click="onOrderPay"> 去支付 </view>
          <view class="button" @click="popup?.open?.()"> 取消订单 </view>
        </template>
        <!-- 其他订单状态:按需展示按钮 -->
        <template v-else>
          <navigator class="button secondary" :url="`/pages/module-order/order-create/order-create?orderId=${query.id}`" hover-class="none">
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view v-if="order.orderState === OrderState.DaiShouHuo" class="button primary" @click="onOrderConfirm">
            确认收货
          </view>
          <!-- 待评价状态: 展示去评价 -->
          <view v-if="order.orderState === OrderState.DaiPingJia" class="button"> 去评价 </view>
          <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
          <view v-if="order.orderState >= OrderState.DaiPingJia" class="button delete" @click="onOrderDelete">
            删除订单
          </view>
        </template>
      </view>
    </template>
  </scroll-view>

  <!-- 取消订单弹窗 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="popup-root">
      <view class="title">订单取消</view>
      <view class="description">
        <view class="tips">请选择取消订单的原因：</view>
        <view v-for="item in reasonList" :key="item" class="cell" @click="reason = item">
          <text class="text">{{ item }}</text>
          <text class="icon" :class="{ checked: item === reason }" />
        </view>
      </view>
      <view class="footer">
        <view class="button" @click="popup?.close?.()">取消</view>
        <view class="button primary" @click="onOrderCancel">确认</view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import { useGuessLikeHook } from '@/hooks/useGoodsHook';
import { OrderState, } from '@/enums';
import { orderStateList } from '@/consts';
import type { LogisticItem, OrderResult } from '@/types/order';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
// 获取页面栈
const pages = getCurrentPages();

const { guessLikeRef, onScrolltolowerEvt } = useGuessLikeHook();

// 基于小程序的 Page 类型扩展 uni-app 的 Page
type PageInstance = Page.PageInstance & WechatMiniprogram.Page.InstanceMethods<any>;

// #ifdef MP-WEIXIN
// 获取当前页面实例，数组最后一项
const pageInstance = pages.at(-1) as PageInstance;

// 页面渲染完毕，绑定动画效果
onReady(() => {
  // 动画效果,导航栏背景色
  pageInstance.animate(
    '.navbar',
    [{ backgroundColor: 'transparent' }, { backgroundColor: '#f8f8f8' }],
    1000,
    {
      scrollSource: '#scroller',
      timeRange: 1000,
      startScrollOffset: 0,
      endScrollOffset: 50,
    },
  );
  // 动画效果,导航栏标题
  pageInstance.animate('.navbar .title', [{ color: 'transparent' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  });
  // 动画效果,导航栏返回按钮
  pageInstance.animate('.navbar .back', [{ color: '#fff' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  });
});
// #endif

// 获取页面参数
const query = defineProps<{
  id: string;
}>();

// 是否为开发环境
const isDev = import.meta.env.DEV;
// 取消原因列表
const reasonList = ref([ '商品无货', '不想要了', '商品信息填错了', '地址信息填写错误', '商品降价', '其它' ]);
// 订单取消原因
const reason = ref('');

// 订单详情
const order = ref<OrderResult>();
// 物流信息
const logisticList = ref<LogisticItem[]>([]);

onLoad(() => {
  getMemberOrderByIdData();
});

/**
 * 获取订单详情
 */
const getMemberOrderByIdData = async () => {
  const res = await $api.getMemberOrderByIdApi(query.id);
  order.value = res.result;
  // if (
  //   [OrderState.DaiShouHuo, OrderState.DaiPingJia, OrderState.YiWanCheng].includes(
  //     order.value.orderState,
  //   )
  // ) {
  //   getMemberOrderLogisticsByIdData();
  // }
};

// 倒计时结束事件
const onTimeup = () => {
  // 修改订单状态为已取消
  order.value!.orderState = OrderState.YiQuXiao;
};

// 订单支付
const onOrderPay = async () => {};

// 模拟发货
const onOrderSend = async () => {};

// 确认收货
const onOrderConfirm = async () => {};

// 复制内容
const onCopy = (id: string) => {
  // 设置系统剪贴板的内容
  uni.setClipboardData({ data: id });
};

// 删除订单
const onOrderDelete = () => {
  // 二次确认
  uni.showModal({
    content: '是否删除订单',
    confirmColor: '#27BA9B',
    success: async (success) => {
      if (success.confirm) {
        // await deleteMemberOrderAPI({ ids: [query.id] });
        uni.redirectTo({ url: '/pagesOrder/list/list' });
      }
    },
  });
};

// 弹出层组件
const popup = ref<UniHelper.UniPopupInstance>();

// 取消订单
const onOrderCancel = async () => {
  // 发送请求
  // const res = await getMemberOrderCancelByIdAPI(query.id, { cancelReason: reason.value });
  // 更新订单信息
  // order.value = res.result;
  // 关闭弹窗
  popup.value?.close!();
  // 轻提示
  uni.showToast({ icon: 'none', title: '订单取消成功' });
};
</script>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
