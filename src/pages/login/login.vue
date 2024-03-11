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
    </view>
    
    <view class="tips">登录/注册即视为你同意《服务条款》和《小兔鲜儿隐私协议》</view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import type { LoginResult } from '@/types/member';
import type { ApiType } from '@/types/api';

const $api = inject('$api') as ApiType;

// #ifdef MP-WEIXIN
const code = ref('');

onLoad(async () => {
  const res = await wx.login();
  code.value = res.code;
});

// 获取用户手机号码
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  console.log(ev);
  const { encryptedData, iv } = ev.detail;

  const { result: loginResult } = await $api.postLoginWxMinApi({ code: code.value, encryptedData, iv });
  console.log(loginResult);
};
// #endif

/**
 * 登录成功后的操作
 */
const loginSuccess = (profile: LoginResult) => {
  console.log(profile);
  
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
