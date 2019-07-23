
import Tips from '../../../class/utils/Tips.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lables: [],
    types: 0,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 数据绑定
    this.setData({
      lables: ['上衣', '2018夏季']
    })

  },

  onSearchTap: function ({ detail }) {
    let keyword = detail.value.keyword;
    if (keyword == '') {
      Tips.error('请输入关键词');
    } else {
      app.router.searchResult(keyword);
    }
  },

  // 标签点击事件
  onLableTap: function (e) {
    app.router.searchResult(e.currentTarget.dataset.keyword);
  }
})