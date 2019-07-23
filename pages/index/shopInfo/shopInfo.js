import Tips from '../../../class/utils/Tips.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    lunboimg: [],
    shop: {},
    swiperCurrent: 0,
    init: false
  },

  page: {},

  // 指示点的改变事件
  changDot: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  // 点击进入商品详情页面
  onGoodsTap: function (e) {
    app.router.goodsDetail(e.currentTarget.dataset.id);
  },

  slideClick: function (e) {
    let path = e.target.dataset.path;
    if (path.length > 0) {
      app.router.goto(path);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    Tips.loading();
    app.shopApi.getSlide().then(data => {
      Tips.loaded();
      that.setData({
        home_img: data,
        init: true
      });
    });

    app.shopApi.getInfo().then(data => {
      that.setData({
        shop: data
      });
    });

    that.page = app.goodsApi.page();
    that.loadNextPage();
  },

  loadNextPage: function () {
    let that = this;

    this.page.next().then(data => {
      Tips.loaded();
      that.setData({
        goodsList: data.list,
        nomore: data.list.length == that.data.goodsList.length,
        loading: false,
        init: true
      });
    });
  },
  onPullDownRefresh: function () {
    this.reload();
    wx.stopPullDownRefresh();
  },
  reload: function () {
    Tips.loading();
    this.loadNextPage();
  },
  onReachBottom: function (event) {
    if (this.data.nomore) {
      return;
    }
    this.loadNextPage();
    this.setData({ loading: true });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})