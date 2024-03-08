import api from '@/api';

export type ApiType = {
  // 对象类型映射
  [prop in keyof typeof api]: typeof api[prop];
};

