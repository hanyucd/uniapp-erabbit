import { createPinia } from 'pinia';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createPersistedState } from 'pinia-plugin-persistedstate';

// 创建 pinia 实例
const pinia = createPinia();
// 使用持久化存储插件
// pinia.use(piniaPluginPersistedstate);
pinia.use(createPersistedState({
  storage: {
    getItem: uni.getStorageSync,
    setItem: uni.setStorageSync,
  }
}));

// 默认导出，给 main.ts 使用
export default pinia;

// 模块统一导出
export * from './modules/memberModule';
