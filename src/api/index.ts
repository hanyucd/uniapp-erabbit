import httpRequest from './httpRequest';
import type * as TypeHome from '@/types/home';
import type * as TypeCommon from '@/types/common';

export default {
  // 获取banner 图片
  getBannerApi: (param: { distributionSite: number }) => httpRequest<TypeHome.BannerItem[]>(`/home/banner`, param),
  // 获取首页分类列表
  getHomeCategoryBannerApi: () => httpRequest<TypeHome.CategoryItem[]>(`/home/category/mutli`),
  // 获取首页热门推荐
  getHomeHotApi: () => httpRequest<TypeHome.HotItem[]>(`/home/hot/mutli`),
  // 获取商品猜你喜欢
  getGoodsGuessLikeApi: (param?: TypeCommon.PageParams) => httpRequest<TypeCommon.PageResult<TypeHome.GuessItem>>(`/home/goods/guessLike`, param),
  // 获取热门推荐商品
  getHotRecommendAPIApi: (reqUrl: string, param: TypeCommon.PageParams & { subType?: string } ) => httpRequest(`${ reqUrl }`, param),
};
