<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaTop + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none" />
      <view class="title">个人信息</view>
    </view>

    <!-- 头像 -->
    <view class="avatar">
      <view class="avatar-content" @click="onAvatarChange">
        <image class="image" :src="profile?.avatar" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>

    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account placeholder">{{ profile?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input v-model="profile!.nickname" class="input" type="text" placeholder="请填写昵称">
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="onGenderChange">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="profile?.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="profile?.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker mode="date" class="picker" :value="profile?.birthday" start="1900-01-01" :end="formatDate(new Date())" @change="onBirthdayChange">
            <view v-if="profile?.birthday">{{ profile?.birthday }}</view>
            <view v-else class="placeholder">请选择日期</view>
          </picker>
        </view>
        <!-- 只有微信小程序端内置了省市区数据 -->
        <!-- #ifdef MP-WEIXIN -->
        <view class="form-item">
          <text class="label">城市</text>
          <picker mode="region" class="picker" :value="profile?.fullLocation?.split(' ')" @change="onFullLocationChange">
            <view v-if="profile?.fullLocation">{{ profile.fullLocation }}</view>
            <view v-else class="placeholder">请选择城市</view>
          </picker>
        </view>
        <!-- #endif -->
        <view class="form-item">
          <text class="label">职业</text>
          <input class="input" type="text" placeholder="请填写职业" :value="profile?.profession">
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="onSubmit">保 存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, computed, inject } from 'vue';
import { formatDate } from '@/utils';
import { useMemberStore } from '@/stores';
import type { Gender, ProfileDetail } from '@/types/member';
import type { ApiType } from '@/types/api';


const memberStore = useMemberStore();
const $api = inject('$api') as ApiType;

// 系统信息
const systemInfo = ref<UniApp.GetSystemInfoResult>(uni.getSystemInfoSync());
// 顶部安全距离
const safeAreaTop = computed(() => systemInfo.value.safeAreaInsets!.top);

// 个人信息
const profile = ref<ProfileDetail>({} as ProfileDetail);

onLoad(() => {
  _getMemberProfileData();
});

/**
 * 获取个人信息
 */
const _getMemberProfileData = async () => {
  const res = await $api.getMemberProfileApi();
  profile.value = res.result;

  // 同步 Store 的头像和昵称，用于我的页面展示
  memberStore.profile!.avatar = res.result.avatar;
  memberStore.profile!.nickname = res.result.nickname;
};

/**
 * 修改头像
 */
const onAvatarChange = () => {
  // 调用拍照/选择图片
  // 选择图片条件编译
  // #ifdef H5 || APP-PLUS
  // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替
  uni.chooseImage({
    count: 1,
    success: (res) => {
      // 文件路径
      const tempFilePaths = res.tempFilePaths;
      // 上传
      _uploadFile(tempFilePaths[0]);
    },
  });
  // #endif

  // #ifdef MP-WEIXIN
  // uni.chooseMedia 仅支持微信小程序端
  uni.chooseMedia({
    count: 1, // 文件个数
    mediaType: ['image'], // 文件类型
    success: (res) => {
      // 本地路径
      const { tempFilePath } = res.tempFiles[0];
      // 上传
      _uploadFile(tempFilePath);
    },
  });
  // #endif
};

/**
 * 文件上传-兼容小程序端、H5端、App端
 */
const _uploadFile = (file: string) => {
  console.log(file);
  // 文件上传
  uni.uploadFile({
    url: '/member/profile/avatar',
    name: 'file',
    filePath: file,
    success: (res) => {
      if (res.statusCode === 200) {
        const avatar = JSON.parse(res.data).result.avatar;
        // 个人信息页数据更新
        profile.value!.avatar = avatar;
        // Store头像更新
        memberStore.profile!.avatar = avatar;
        uni.showToast({ icon: 'success', title: '更新成功' });
      } else {
        uni.showToast({ icon: 'error', title: '出现错误' });
      }
    },
  });
};

/**
 * 修改性别
 */
const onGenderChange: UniHelper.RadioGroupOnChange = (ev) => {
  profile.value.gender = ev.detail.value as Gender;
};


/**
 * 修改生日
 */
const onBirthdayChange: UniHelper.DatePickerOnChange = (ev) => {
  profile.value.birthday = ev.detail.value;
};

let fullLocationCode = ref<[string, string, string]>(['', '', '']);
/**
 * 修改城市
 */
const onFullLocationChange: UniHelper.RegionPickerOnChange = (ev) => {
  profile.value.fullLocation = ev.detail.value.join(' ');
  fullLocationCode.value = ev.detail.code!;
};

/**
 * 点击保存提交表单
 */
const onSubmit = async () => {
  const { nickname, gender, birthday } = profile.value;

  const res = await $api.putMemberProfileApi({
    nickname,
    gender,
    birthday,
    provinceCode: fullLocationCode.value[0],
    cityCode: fullLocationCode.value[1],
    countyCode: fullLocationCode.value[2],
  });

  // 更新Store昵称
  memberStore.profile!.nickname = res.result.nickname;
  uni.showToast({ icon: 'success', title: '保存成功' });

  setTimeout(() => {
    uni.navigateBack();
  }, 400);
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
