import Tips from "../../../class/utils/Tips";
const app = getApp();
Page({
  page: {},
  data: {
    favorites: [],
    init: true
  },

  onLoad: function (options) {
    Tips.loading();
    //初始化分页参数
    this.page = app.favoriteApi.page();
    this.loadNextPage();
  },

  reload: function () {
    this.page.reset();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      Tips.loaded();
      this.setData({
        favorites: data.list,
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

  /***********************操作事件***********************/

  /**
   * 点击商品
   */
  onGoodsTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    app.router.goodsDetail(goodsId);
  },


  /**
   * 操作
   */
  onMoreTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    Tips.actionWithFunc(['查看商品', '取消收藏'],
      () => app.router.goodsDetail(goodsId),
      () => {
        Tips.loading();
        app.favoriteApi.remove(goodsId).then(() => this.reload())
      });
  }
});