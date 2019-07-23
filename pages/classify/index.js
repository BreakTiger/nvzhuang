import Tips from '../../class/utils/Tips.js';
const app = getApp();
const Tab = require('../../templates/tab/index');


Page(Object.assign({}, Tab, {
  data: {
    tab: {},
    goods: [],
    loading: false,
    nomore: false,
    fixed: false,
    init: false
  },
  page: {},
  // 搜索框进入搜索页面
  onSearchTap: function (e) {
    wx.navigateTo({
      url: '/pages/classify/search/search',
    })
  },

  onGoodsItemTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    app.router.goodsDetail(goodsId);
  },

  loadClass: function () {
    let that = this;
    Tips.loading();
    app.shopApi.getGoodsClassList().then(data => {
      console.log(data)
      that.setData({
        tab: data
      });

      that.page = app.goodsApi.page();
      that.loadNextPage();
    });
  },


  onLoad: function (options) {
    let that = this;
    //Tips.loading();
    this.loadClass();
  },
  loadNextPage: function () {
    let that = this;
    const param = {
      cid: this.data.tab.selectedId
    };
    
    this.page.next(param).then(data=>{
      Tips.loaded();
      that.setData({
        goods:data.list,
        nomore:data.list.length==that.data.goods.length,
        loading:false,
        init:true
      });
    });
  },
  onPullDownRefresh: function () {
    this.reload();
    wx.stopPullDownRefresh();
  },
  reload: function () {
    Tips.loading();
    this.page.reset();
    this.loadNextPage();
  },
  onReachBottom: function (event) {
    if (this.data.nomore) {
      return;
    }
    this.loadNextPage();
    this.setData({ loading: true });
  },
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    this.page = app.goodsApi.page();
    this.reload();
  }
}));