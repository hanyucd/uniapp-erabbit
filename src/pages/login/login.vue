<template>
  <view class="viewport">
    <view class="logo">
      <image src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo_icon.png" />
    </view>

    <view class="login">
      <!-- 小程序端授权登录 -->
      <!-- #ifdef MP-WEIXIN -->
      <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">
        <text class="icon icon-phone" />
        手机号快捷登录
      </button>
      <!-- #endif -->

      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        
        <view class="options">
          <!-- 通用模拟登录 -->
          <button @click="onGetphonenumberSimple">
            <text class="icon icon-phone">模拟快捷登录</text>
          </button>
        </view>
      </view>
    </view>

    
    <view class="tips">登录/注册即视为你同意《服务条款》和《小兔鲜儿隐私协议》</view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import { useMemberStore } from '@/stores';

import type { LoginResult } from '@/types/member';
import type { ApiType } from '@/types/api';

const $api = inject('$api') as ApiType;

// 保存会员信息
const memberStore = useMemberStore();

// #ifdef MP-WEIXIN
const code = ref(''); // 微信小程序 临时登录凭证code

onLoad(async () => {
  const res = await wx.login();
  code.value = res.code;
});

// 获取用户手机号码
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  const { encryptedData, iv } = ev.detail;
  const { result: loginResult } = await $api.postLoginWxMinApi({ code: code.value, encryptedData, iv });
  console.log(loginResult);
};
// #endif

// 模拟手机号码快捷登录（开发练习）
const onGetphonenumberSimple = async () => {
  const res = await $api.postLoginWxMinSimpleApi({ phoneNumber: '13123456789' });
  _loginSuccess(res.result);
};

/**
 * 登录成功后的操作
 */
const _loginSuccess = (profile: LoginResult) => {
  console.log(profile);
  memberStore.setProfile(profile);
  // 成功提示
  uni.showToast({ icon: 'success', title: '登录成功' });
  setTimeout(() => {
    uni.navigateBack();
  }, 500);
};
</script>

<style lang="scss">
page {
  height: 100%;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
