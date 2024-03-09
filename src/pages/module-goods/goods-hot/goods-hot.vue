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
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
const title = ref('uniapp');


// setup 语法获取页面参数方式 之一
const query = defineProps<{
  type: string;
}>();

// 热门推荐页 标题和url
const urlMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
];

const currUrlMap = urlMap.find((v) => v.type === query.type);
// 动态设置标题
uni.setNavigationBarTitle<UniApp.SetNavigationBarTitleOptions>({ title: currUrlMap?.title || '' });

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
