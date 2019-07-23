import Tips from '../../class/utils/Tips.js';
const app = getApp()

Page({
  data: {
    goods_new_list: [],
    goods_hot_list: [],
    lunboimg: [],
    shop: {},
    swiperCurrent: 0,
    init: false,
    // 隐藏区域条件
    alert: 0,
    coupon: null
  },

  /**
   * 关闭面板
   */
  onPanelClose: function () {
    this.sku.display = false;
    this.setData({ sku: this.sku.export() });
  },

  // 弹出时间的数值更新
  goAlert: function () {
    let that = this;
    that.setData({
      alert: 1
    })
  },
  onPanelClose: function (e) {
    let that = this
    that.setData({
      alert: 0
    })
  },

  pickCoupon: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    Tips.loading();
    app.couponApi.pick(id).then(res => {
      Tips.loaded();
      Tips.toast('领取成功');
      console.log(res)
      if (res == true) {
        that.setData({
          alert: 0
        });
      }
    }, res => {
      Tips.toast(res.message);
      that.setData({
        alert: 0
      });
    });
  },

  // 指示点的改变事件
  changDot: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  onSlideTap: function (e) {
    let path = e.currentTarget.dataset.path;
    if (path.length > 0) {
      app.router.goto(path);
    }
  },

  onLoad: function (options) {
    this.loadData();
  },

  loadData: function () {
    let that = this;
    Tips.loading();
    app.shopApi.getSlide().then(data => {
      Tips.loaded();
      that.setData({
        home_img: data,
        init: true
      });
    });

    app.couponApi.canPickList().then(data => {
      if (data.length > 0) {
        that.setData({
          coupon: data[0]
        });
      }
    });

    app.shopApi.getInfo().then(data => {
      that.setData({
        shop: data
      });
    });

    app.shopApi.getNewGoods(12).then(data => {
      that.setData({
        goods_new_list: data
      });
    });

    app.shopApi.getHotGoods(9).then(data => {
      that.setData({
        goods_hot_list: data
      });
    });
  },

  onPullDownRefresh: function () {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  // 店铺详情页面进入事件
  onshopInfoTap: function (e) {
    app.router.shopHome();
  },


  /**
   * 点击商品
   */
  onGoodsItemTap: function (e) {
    app.router.goodsDetail(e.currentTarget.dataset.id);
  },

  onKefuTap: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.shop.store_phone
    })
  },
  onShareAppMessage: function (options) {
    return {
      'title': this.data.shop.store_name + '-每个女孩心中的衣橱',
      'path': '/pages/index/index'
    };
  }
})
