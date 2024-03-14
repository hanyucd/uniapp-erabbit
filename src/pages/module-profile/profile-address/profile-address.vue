<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view enable-back-to-top class="scroll-view" scroll-y>
      <view v-if="addressList.length" class="address">
        <uni-swipe-action class="address-list">
          <!-- 收货地址项 -->
          <uni-swipe-action-item v-for="item in addressList" :key="item.id" class="item">
            <view class="item-content" @click="onChangeAddress(item)">
              <view class="user">
                {{ item.receiver }}
                <text class="contact">{{ item.contact }}</text>
                <text v-if="item.isDefault" class="badge">默认</text>
              </view>
              <view class="locate">{{ item.fullLocation }} {{ item.address }}</view>
              <!-- H5 端需添加 .prevent 阻止链接的默认行为 -->
              <navigator class="edit" hover-class="none" :url="`/pages/module-profile/profile-address-form/profile-address-form?id=${item.id}`" @click.stop="() => {}" @click.prevent="() => {}">
                修改
              </navigator>
            </view>
            <!-- 右侧插槽 -->
            <template #right>
              <button class="delete-button" @click="onDeleteAddress(item.id)">删除</button>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <view v-else class="blank">暂无收货地址</view>
    </scroll-view>
    
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="/pages/module-profile/profile-address-form/profile-address-form">
        新建地址
      </navigator>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import { useAddressStore } from '@/stores/modules/addressModule';
import type { AddressItem } from '@/types/address';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;

const addressStore = useAddressStore();

// 获取收货地址列表数据
const addressList = ref<AddressItem[]>([]);
const _getMemberAddressData = async () => {
  const res = await $api.getMemberAddressApi();
  addressList.value = res.result;
};

// 初始化调用(页面显示)
onShow(() => {
  _getMemberAddressData();
});

/**
 * 修改收货地址
 */
const onChangeAddress = (item: AddressItem) => {
  // 修改地址
  addressStore.changeSelectedAddress(item);
  // 返回上一页
  uni.navigateBack();
};

/**
 * 删除收货地址
 */
const onDeleteAddress = (id: string) => {
  // 二次确认
  uni.showModal({
    content: '删除地址?',
    confirmColor: '#27BA9B',
    success: async (res) => {
      if (res.confirm) {
        // 根据id删除收货地址
        await $api.deleteMemberAddressByIdApi(id);
        // 重新获取收货地址列表
        _getMemberAddressData();
      }
    },
  });
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import './style.scss';
</style>
