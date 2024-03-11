import httpRequest from './httpRequest';
import type * as TypeHome from '@/types/home';
import type * as TypeCommon from '@/types/common';
import type * as TypeHot from '@/types/hot';
import type * as TypeCategory from '@/types/category';
import type * as TypeGoods from '@/types/goods';
import type * as TypeMember from '@/types/member';

type LoginWxMinParams = {
  code: string;
  encryptedData?: string;
  iv?: string;
};

export default {
  // 获取banner 图片
  postLoginWxMinApi: (param: LoginWxMinParams) => httpRequest<TypeMember.LoginResult>(`/login/wxMin`, param, 'post'),
  // 获取banner 图片
  getBannerApi: (param: { distributionSite: number }) => httpRequest<TypeHome.BannerItem[]>(`/home/banner`, param),
  // 获取首页分类列表
  getHomeCategoryBannerApi: () => httpRequest<TypeHome.CategoryItem[]>(`/home/category/mutli`),
  // 获取首页热门推荐
  getHomeHotApi: () => httpRequest<TypeHome.HotItem[]>(`/home/hot/mutli`),
  // 获取商品猜你喜欢
  getGoodsGuessLikeApi: (param?: TypeCommon.PageParams) => httpRequest<TypeCommon.PageResult<TypeHome.GuessItem>>(`/home/goods/guessLike`, param),
  // 获取热门推荐商品
  getHotRecommendAPIApi: (reqUrl: string, param: TypeCommon.PageParams & { subType?: string } ) => httpRequest<TypeHot.HotResult>(`${ reqUrl }`, param),
  // 获取分类列表
  getCategoryTopApi: () => httpRequest<TypeCategory.CategoryTopItem[]>(`/category/top`),
  // 获取商品详情
  getGoodsDetailApi: (param: { id: string }) => httpRequest<TypeGoods.GoodsResult>(`/goods`, param),
};
