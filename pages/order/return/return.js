import Tips from '../../../class/utils/Tips.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alert: 0,
    alertLlist: [
      '拍多了',
      '拍错了',
      '质量问题',
      '大小不合适',
      '不想要了'
    ],
    selected: 0,
    index: 0,
    switch: 0,
    value: ''
  },

  // 点击事件
  goAlert: function () {
    let that = this
    that.setData({
      alert: 1
    })
  },

  // 选择
  selected: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let value = e.currentTarget.dataset.item
    that.setData({
      value: value,
      switch: 1
    })
    console.log(value)
    if (index == 0) {
      that.setData({
        selected: 0,
        alert: 0
      })
    } else if (index == 1) {
      that.setData({
        selected: 1,
        alert: 0
      })
    } else if (index == 2) {
      that.setData({
        selected: 2,
        alert: 0
      })
    } else if (index == 3) {
      that.setData({
        selected: 3,
        alert: 0
      })
    } else if (index == 4) {
      that.setData({
        selected: 4,
        alert: 0
      })
    } else {
      that.setData({
        selected: 5,
        alert: 0
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderId = options.orderId;
    Tips.loading();
    app.orderApi.getInfo(orderId).then(data => {
      Tips.loaded();
      this.setData({
        datalist: data
      });
    });
  }
})