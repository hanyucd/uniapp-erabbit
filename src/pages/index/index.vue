<template>
  <view class="content">
    <image lass="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">
        {{ title }}
      </text>
    </view>
  </view>

  <uni-badge />
  <uni-badge text="2" type="success" />
  <uni-badge text="3" type="primary" :inverted="true" />

  <uni-fav :checked="false" @click="onClick" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const title = ref('uniapp');


uni.$emit('e', { name: 'hanu' });
// getCurrentPages();


const onClick = async () => {
  console.log('fff');
  // uni.request({
  //   method: 'GET',
  //   url: '/home/banner'
  // })
};

</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }
  .text-area {
    display: flex;
    justify-content: center;
    .title {
      font-size: 36rpx;
      color: red;
    }
  }
}



</style>
