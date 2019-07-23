const app = getApp();
import Tips from "../../../class/utils/Tips";
const Tab = require('../../../templates/tab/index');

Page(Object.assign({}, Tab, {
  page: {},
  data: {    
    coupons: [],
    init: true
  },

  onLoad: function (options) {
    this.page = app.couponApi.page();
    this.loadNextPage();
  },

  /**
   * 重新加载
   */
  reload: function () {
    this.page.reset();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    Tips.loading();
    this.page.next().then(data => {
      Tips.loaded();
      this.setData({
        coupons: data.list,
        init: true
      });      
    });
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    this.reload();
  },

  /**
  * 上划加载
  */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /**
   * 长按删除卡券
   */
  onCouponDelete: function (event) {
    const acceptId = event.currentTarget.dataset.couponId;
    Tips.confirm('是否删除该卡券？')
      .then(() => app.couponApi.remove(acceptId))
      .then(() => Tips.toast('删除成功', () => this.reload()));
  }
}))