import { createSSRApp } from 'vue';
import App from './App.vue';
import pinia from '@/stores';
import api from '@/api';

export function createApp() {
  // 创建 vue 实例
  const app = createSSRApp(App);

  // 使用 pinia
  app.use(pinia);
  // app.config.globalProperties.$api = api;
  app.provide('$api', api);

  return {
    app,
  };
}

// console.log('当前环境：', import.meta.env);

