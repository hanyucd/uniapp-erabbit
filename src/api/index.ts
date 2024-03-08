import httpRequest from './httpRequest';
import type * as TypeHome from '@/types/home';

export default {
  // 获取banner 图片
  getBannerApi: (param: { distributionSite: number }) => httpRequest<TypeHome.BannerItem[]>(`/home/banner`, param),
  // 获取首页分类列表
  getHomeCategoryBannerApi: () => httpRequest<TypeHome.CategoryItem[]>(`/home/category/mutli`),
  // 获取首页热门推荐
  getHomeHotApi: () => httpRequest<TypeHome.HotItem[]>(`/home/hot/mutli`),
};
