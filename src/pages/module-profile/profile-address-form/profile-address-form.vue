<template>
  <view class="content">
    <uni-forms ref="formRef" :rules="rules" :model="form">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input v-model="form.receiver" class="input" placeholder="请填写收货人姓名">
      </uni-forms-item>

      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input v-model="form.contact" class="input" placeholder="请填写收货人手机号码" :maxlength="11">
      </uni-forms-item>

      <uni-forms-item name="countyCode" class="form-item">
        <text class="label">所在地区</text>
        <!-- #ifdef MP-WEIXIN -->
        <picker class="picker" mode="region" :value="form.fullLocation.split(' ')" @change="onRegionChange">
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
        <!-- #endif -->

        <!-- #ifdef H5 || APP-PLUS -->
        <uni-data-picker
          v-model="form.countyCode"
          placeholder="请选择地址"
          popup-title="请选择城市"
          collection="opendb-city-china"
          field="code as value, name as text"
          orderby="value asc"
          :step-searh="true"
          self-field="code"
          parent-field="parent_code"
          :clear-icon="false"
          @change="onCityChange"
        />
        <!-- #endif -->
      </uni-forms-item>

      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input v-model="form.address" class="input" placeholder="街道、楼牌号等信息">
      </uni-forms-item>

      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch class="switch" color="#27ba9b" :checked="form.isDefault === 1" @change="onSwitchChange" />
      </view>
    </uni-forms>
  </view>

  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, inject } from 'vue';
import type { ApiType } from '@/types/api';
const $api = inject('$api') as ApiType;

// 获取页面参数
const query = defineProps<{
  id?: string;
}>();

// 动态设置标题
uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' });

// 表单数据
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
});

// 定义校验规则
const rules: UniHelper.UniFormsRules = {
  receiver: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
  countyCode: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请选择详细地址' }],
  },
};

// 获取收货地址详情数据
const _getMemberAddressByIdData = async () => {
  if (query.id) {
    // 发送请求
    const res = await $api.getMemberAddressByIdApi(query.id);
    // 把数据合并到表单中
    Object.assign(form.value, res.result);
  }
};

// 页面加载
onLoad(() => {
  _getMemberAddressByIdData();
});

/**
 * 收集所在地区
 */
const onRegionChange: UniHelper.RegionPickerOnChange = (ev) => {
  // 省市区(前端展示)
  form.value.fullLocation = ev.detail.value.join(' ');
  // 省市区(后端参数)
  const [provinceCode, cityCode, countyCode] = ev.detail.code!;
  // form.value.provinceCode = provinceCode
  Object.assign(form.value, { provinceCode, cityCode, countyCode });
};

// #ifdef H5 || APP-PLUS
const onCityChange: UniHelper.UniDataPickerOnChange = (ev) => {
  // 省市区
  const [province, city, county] = ev.detail.value;
  // 收集后端所需的 code 数据
  Object.assign(form.value, {
    provinceCode: province.value,
    cityCode: city.value,
    countyCode: county.value,
  });
};
// #endif

// 收集是否默认收货地址
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0;
};

/**
 * 提交表单 & 添加/修改地址
 */
const onSubmit = async () => {
  try {
    // 表单校验
    // await formRef.value?.validate?.();
    // 校验通过后再发送请求
    if (query.id) {
      // 修改地址请求
      await $api.putMemberAddressByIdApi(query.id, form.value);
    } else {
      // 新建地址请求
      await $api.postMemberAddressApi(form.value);
    }
    // 成功提示
    uni.showToast({ icon: 'success', title: query.id ? '修改成功' : '添加成功' });
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 400);
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' });
  }
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
