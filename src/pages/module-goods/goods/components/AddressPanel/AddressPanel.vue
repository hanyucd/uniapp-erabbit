<template>
  <view class="address-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @click="emit('close')">关闭</text>
    <!-- 标题 -->
    <view class="title">
      配送至
    </view>
    <!-- 内容 -->
    <view class="content">
      <view class="item">
        <view class="user">
          李明 13824686868
        </view>
        <view class="address">
          北京市顺义区后沙峪地区安平北街6号院
        </view>
        <text class="icon icon-checked" />
      </view>

      <view class="item">
        <view class="user">
          王东 13824686868
        </view>
        <view class="address">
          北京市顺义区后沙峪地区安平北街6号院
        </view>
        <text class="icon icon-ring" />
      </view>

      <view class="item">
        <view class="user">
          张三 13824686868
        </view>
        <view class="address">
          北京市朝阳区孙河安平北街6号院
        </view>
        <text class="icon icon-ring" />
      </view>
    </view>
    
    <view class="footer">
      <view class="button primary">新建地址</view>
      <view v-if="false" class="button primary">确定</view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'close'): void;
}>();
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
