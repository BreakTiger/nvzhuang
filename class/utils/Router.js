const notification = require("./WxNotificationCenter.js");
export default class Router {
  constructor() {
  }

  shopHome() {
    this.goto('/pages/index/shopInfo/shopInfo');
  }

  goodsDetail(goods_id) {
    this.goto('/pages/goods/index/index?goods_id=' + goods_id);
  }

  searchResult(keyword){
    this.goto('/pages/classify/search-detail/search-detail?keyword=' + keyword);
  }

  cartIndex() {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  }

  orderDetail(orderId) {
    this.goto(`/pages/order/detail/detail?orderId=${orderId}`);
  }

  orderDetailRedirect(orderId) {
    notification.postNotificationName("ON_ORDER_UPDATE");
    this.redirectTo(`/pages/order/detail/detail?orderId=${orderId}`);
  }

  orderIndexRefresh() {
    notification.postNotificationName("ON_ORDER_UPDATE");
    this.orderIndex();
  }

  orderIndex() {
    this.goto('/pages/order/index/index');
  }

  refundApply(orderId) {
    this.goto(`/pages/refund/apply/apply?orderId=${orderId}`);
  }

  refundDetail() {
    this.goto(`/pages/order/return-detail/return-detail`);
  }

  /**
     * 地址列表(跳转)
     */
  addressIndexRedirect(reload = false) {
    this.redirectTo(`/pages/address/index/index?reload=${reload}`);
  }

  addressIndex(mode) {
    this.goto(`/pages/address/index/index?mode=${mode}`);
  }

  /**
     * 地址详情页面
     */
  addressEdit(address) {
    this.goto(`/pages/address/edit/edit?addr=${address}`);
  }

  /**
   * 选择优惠券
   */
  couponsUse(coupons) {
    this.goto(`/pages/coupon/use/use?coupons=${coupons}`);
  }

  goto(url) {
    wx.navigateTo({
      url: url
    })
  }

  redirectTo(url) {
    wx.redirectTo({
      url: url,
    })
  }

  back() {
    wx.navigateBack({
      delta: 1
    })
  }
}