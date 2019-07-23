import Tips from '../../../class/utils/Tips.js';
const app = getApp();
Page({

  page: {},
  data: {
    goods: [],
    keyword: '',
    nomore: false,
    loading: false,
    init: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let keyword = options.keyword;
    this.setData({
      keyword: keyword
    });

    this.page = app.goodsApi.page();
    this.loadNextPage();
  },

  onSearchTap: function ({ detail }) {
    let keyword = detail.value.keyword;
    if (keyword == '') {
      Tips.error('请输入关键词');
    } else {
      this.setData({
        keyword: keyword
      });
      this.reload();
    }
  },

  loadNextPage: function () {
    let that = this;
    const param = {
      keyword: this.data.keyword
    };

    this.page.next(param).then(data => {
      Tips.loaded();
      that.setData({
        goods: data.list,
        nomore: data.list.length == that.data.goods.length,
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
    this.page.reset();
    this.loadNextPage();
  },

  onReachBottom: function (event) {
    if (this.data.nomore) {
      return;
    }
    this.loadNextPage();
    this.setData({ loading: true });
  }
})