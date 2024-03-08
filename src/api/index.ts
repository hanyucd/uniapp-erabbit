import httpRequest from './httpRequest';
import type * as TypeHome from '@/types/home';

export default {
  // 获取banner 图片
  getBannerApi: (param: { distributionSite: number }) => httpRequest<TypeHome.BannerItem[]>(`/home/banner`, param),
};
