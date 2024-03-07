import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useMemberStore = defineStore('memberModule', () => {
  
  // 会员信息
  const profile = ref<any>();
  
  // 保存会员信息，登录时使用
  const setProfile = (val: any) => {
    profile.value = val;
  };

  // 清理会员信息，退出时使用
  const clearProfile = () => {
    profile.value = undefined;
  };

  // 记得 return
  return {
    profile,
    setProfile,
    clearProfile,
  };
},
{
  persist: {
    key: 'member',
    // 调整多端持久化 API
    storage: {
      getItem(key) {
        return uni.getStorageSync(key);
      },
      setItem(key, value) {
        uni.setStorageSync(key, value);
      },
    },
  }
});
