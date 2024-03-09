import type GuessLike from '@/components/GuessLike/GuessLike.vue';
import { ref } from 'vue';


export const useGuessLikeHook = () => {
  // 猜你喜欢组件引用
  const guessLikeRef = ref<InstanceType<typeof GuessLike> | null>(null);
  
  // scroll-view 滚动到底部事件
  const onScrolltolowerEvt = () => {
    guessLikeRef.value?.getMoreGuessLike();
  };

  return {
    guessLikeRef,
    onScrolltolowerEvt
  };
};
