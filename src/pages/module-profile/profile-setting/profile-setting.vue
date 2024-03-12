<template>
  <view class="viewport">
    <view v-if="memberStore.profile" class="list">
      <navigator url="/pages/module-profile/profile-address/profile-address" hover-class="none" class="item arrow">
        我的收货地址
      </navigator>
    </view>

    <!-- #ifdef MP-WEIXIN -->
    <view class="list">
      <button hover-class="none" class="item arrow" open-type="openSetting">授权管理</button>
      <button hover-class="none" class="item arrow" open-type="feedback">问题反馈</button>
      <button hover-class="none" class="item arrow" open-type="contact">联系我们</button>
    </view>
    <!-- #endif -->

    <view class="list">
      <button hover-class="none" class="item arrow">关于小兔鲜儿</button>
    </view>

    <view v-if="memberStore.profile" class="action">
      <view class="button" @click="onLogout">退出登录</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useMemberStore } from '@/stores';

const memberStore = useMemberStore();

// 退出登录
const onLogout = () => {
  uni.showModal({
    content: '是否退出登录？',
    confirmColor: '#27BA9B',
    success: (res) => {
      if (res.confirm) {
        // 清理用户信息
        memberStore.clearProfile();
        // 返回上一页
        uni.navigateBack();
      }
    },
  });
};
</script>

<style lang="scss">
page {
  background-color: #f4f4f4;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
