import httpRequest from './httpRequest';
import type * as TypeHome from '@/types/home';
import type * as TypeCommon from '@/types/common';
import type * as TypeHot from '@/types/hot';
import type * as TypeCategory from '@/types/category';
import type * as TypeGoods from '@/types/goods';
import type * as TypeMember from '@/types/member';
import type * as TypeAddress from '@/types/address';
import type * as TypeCart from '@/types/cart';
import type * as TypeOrder from '@/types/order';

// 小程序登录参数
type LoginWxMinParams = {
  code: string;
  encryptedData?: string;
  iv?: string;
};

// 手机号+密码 登录参数
type LoginParams = {
  account: string;
  password: string;
};

export default {
  // 微信小程序登录
  postLoginWxMinApi: (param: LoginWxMinParams) => httpRequest<TypeMember.LoginResult>(`/login/wxMin`, param, 'post'),
  // 微信小程序登录-内测版
  postLoginWxMinSimpleApi: (param: { phoneNumber: string }) => httpRequest<TypeMember.LoginResult>(`/login/wxMin/simple`, param, 'post'),
  // 手机号 + 密码登录
  postLoginApi: (param: LoginParams) => httpRequest<TypeMember.LoginResult>(`/login`, param, 'post'),
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
  // 获取个人信息
  getMemberProfileApi: () => httpRequest<TypeMember.ProfileDetail>(`/member/profile`),
  // 更新个人信息
  putMemberProfileApi: (param: TypeMember.ProfileParams) => httpRequest<TypeMember.ProfileDetail>(`/member/profile`, param, 'put'),
  // 添加收货地址
  postMemberAddressApi: (param: TypeAddress.AddressParams) => httpRequest(`/member/address`, param, 'post'),
  // 获取收货地址
  getMemberAddressApi: () => httpRequest<TypeAddress.AddressItem[]>(`/member/address`),
  // 添加收货地址详情
  getMemberAddressByIdApi: (id: string) => httpRequest(`/member/address/${id}`),
  // 修改收货地址
  putMemberAddressByIdApi: (id: string, param: TypeAddress.AddressParams) => httpRequest(`/member/address/${id}`, param, 'put'),
  // 删除收货地址
  deleteMemberAddressByIdApi: (id: string) => httpRequest(`/member/address/${id}`, {}, 'delete'),
  // 加入购物车
  postMemberCartApi: (param: { skuId: string; count: number }) => httpRequest(`/member/cart`, param, 'post'),
  // 获取购物车列表
  getMemberCartApi: () => httpRequest<TypeCart.CartItem[]>(`/member/cart`),
  // 删除/清空购物车单品
  deleteMemberCartApi: (param: { ids: string[] }) => httpRequest(`/member/cart`, param, 'delete'),
  // 修改购物车单品
  putMemberCartBySkuIdApi: (skuId: string, param: { selected?: boolean; count?: number }) => httpRequest(`/member/cart/${skuId}`, param, 'put'),
  // 购物车全选/取消全选
  putMemberCartSelectedApi: (param: { selected: boolean }) => httpRequest(`/member/cart/selected`, param, 'put'),
  // 填写订单-获取预付订单
  getMemberOrderPreApi: () => httpRequest<TypeOrder.OrderPreResult>(`/member/order/pre`),
  // 填写订单-获取立即购买订单
  getMemberOrderPreNowApi: (param: { skuId: string; count: string; addressId?: string }) => httpRequest<TypeOrder.OrderPreResult>(`/member/order/pre/now`, param),
  // 提交订单
  postMemberOrderApi: (param: TypeOrder.OrderCreateParams) => httpRequest<{ id: string }>(`/member/order`, param, 'post'),
  // 删除订单
  deleteMemberOrderApi: (param: { ids: string[] }) => httpRequest(`/member/order`, param, 'delete'),
  // 取消订单
  getMemberOrderCancelByIdApi: (id: string, param: { cancelReason: string }) => httpRequest(`/member/order/${id}/cancel`, param, 'put'),
  // 获取订单列表
  getMemberOrderApi: (param: TypeOrder.OrderListParams) => httpRequest<TypeOrder.OrderListResult>(`/member/order`, param),
  // 填写订单-再次购买
  getMemberOrderRepurchaseByIdApi: (id: string) => httpRequest<TypeOrder.OrderPreResult>(`/member/order/repurchase/${id}`),
  // 获取订单详情
  getMemberOrderByIdApi: (id: string) => httpRequest<TypeOrder.OrderResult>(`/member/order/${id}`),
  // 获取微信支付参数
  getPayWxPayMiniPayApi: (param: { orderId: string }) => httpRequest<WechatMiniprogram.RequestPaymentOption>(`/pay/wxPay/miniPay`, param),
  // 模拟支付-内测版
  getPayMockApi: (param: { orderId: string }) => httpRequest(`/pay/mock`, param),
  // 模拟发货-内测版
  getMemberOrderConsignmentByIdApi: (id: string) => httpRequest(`/member/order/consignment/${id}`),
  // 确认收货
  putMemberOrderReceiptByIdApi: (id: string) => httpRequest<TypeOrder.OrderResult>(`/member/order/${id}/receipt`, {}, 'put'),
  // 获取订单物流
  getMemberOrderLogisticsByIdAPIApi: (id: string) => httpRequest<TypeOrder.OrderLogisticResult>(`/member/order/${id}/logistics`),
};
