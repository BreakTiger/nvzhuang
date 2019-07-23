import Tips from '../../../class/utils/Tips.js';
const app = getApp();
Page({
  data: {
    datalist: []
  },

  page: {},

  // 进入退货详情
  onReturnTap: function (e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.page = app.orderApi.refundList();
    this.loadNextPage();
  },

  loadNextPage: function () {
    Tips.loading();
    this.page.next().then(data => {
      Tips.loaded();
      this.setData({
        datalist: data.list
      });
    });
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  }
})