
import Tips from "../../../class/utils/Tips";
import Sku from "../../../class/entity/Sku";
const Quantity = require('../../../templates/quantity/index');
const app = getApp();

Page(Object.assign({}, Quantity, {
  sku: {},
  data: {
    goods: {},
    shop: {},
    sku: {},
    isFav: false,
    cartNum: 0,
    shelf: {},
    init: false,
    commentNum: 0,
    status: {},
    swiperCurrent: 0,
    index: 0
  },
  onLoad: function (options) {
    Tips.loading();
    let that = this;
    const goodsId = options.goods_id;
    app.goodsApi.getInfo(goodsId).then(data => {
      Tips.loaded();
      that.sku = new Sku(data);
      that.setData({
        init: true,
        goods: data,
        isFav:data.is_fav,
        sku: this.sku.export()
      })
    });
  },

  // 指示点的改变事件
  changDot: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    });
  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    app.router.shopHome();
  },

  /**
   * 查看图片
   */
  preview: function (event) {
    const urls = this.data.goods.slide_goods_image.map(item => item.goods_image);
    wx.previewImage({
      urls: urls
    });
  },

  /**
   * 查看详情的所有图片
   */
  previewDetails: function (event) {
    const current = event.currentTarget.dataset.url;
    const urls = this.data.goods.goods_weapp_body.map(item => item);
    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  /***********************购买栏事件***********************/

  /**
   * 点击加入购物车
   */
  onAddCartTap: function (event) {
    this.sku.display = true;
    this.sku.action = "cart";
    console.log(this.sku.export())
    this.setData({ sku: this.sku.export() });
  },

  /**
   * 跳转到购物车
   */
  onToCartTap: function (event) {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },

  onCloseTap: function () {
    Tips.modal(app.globalData.shop.closeTips);
  },

  /**
   * 购买
   */
  onBuyTap: function (event) {
    this.sku.display = true;
    this.sku.action = "buy";
    this.setData({ sku: this.sku.export() });
  },

  /**
   * private 设置购物车商品数量
   */
  setCartNumFromApp: function (num) {
    if (num) {
      cache.num += num;
    }
    this.setData({ cartNum: cache.num });
  },

  /***********************购买面板事件***********************/

  /**
   * 关闭面板
   */
  onPanelClose: function () {
    this.sku.display = false;
    this.setData({ sku: this.sku.export() });
  },

  /**
   * 点击规格
   */
  onSkuTap: function (event) {
    const key = event.currentTarget.dataset.skuKey;
    const value = event.currentTarget.dataset.skuValue;
    //屏蔽禁止点击
    if (this.sku.disabledSkuValues[value]) {
      return;
    }
    const sku = this.sku;
    //console.log(key+value)
    sku.select(key, value);
    this.setData({ sku: sku.export() });
  },


  /**
   * 确定购买
   */
  onConfirmBuyTap: function (event) {
    if (!this.isValidSku()) {
      return;
    }
    //请求服务端
    const goods = this.data.goods;
    const sku = this.sku;
    //Tips.loading('数据加载中');
    if (sku.detail) {
      let detail = sku.detail;
      console.log(sku)

      const trade = app.orderApi.createSingleTrade(detail,sku);
      const param = JSON.stringify(trade);
      app.router.goto('/pages/order/trade/trade?trade=' + param);

      /*
      app.cartApi.add(detail.goods_id, detail.id, sku.num).then(res => {
        Tips.toast('加入购物成功');
        sku.num = 1;
        this.onPanelClose();
        app.router.cartIndex();
      });
      */
    }



  },

  /**
   * 确定加入购物车
   */
  onConfirmCartTap: function (event) {
    if (!this.isValidSku()) {
      return;
    }
    //请求服务端
    const goods = this.data.goods;
    const sku = this.sku;
    //Tips.loading('数据加载中');
    if (sku.detail) {
      let detail = sku.detail;
      app.cartApi.add(detail.goods_id, detail.id, sku.num).then(res => {
        Tips.toast('加入购物成功');
        sku.num = 1;
        this.onPanelClose();
      });
    }
  },

  /**
   * 校验库存和SKU选择情况
   */
  isValidSku: function () {
    if (this.sku.exists && !this.sku.isReady) {
      Tips.alert('请选择商品规格');
      return false;
    }
    if (this.sku.stock < 1) {
      Tips.alert('该商品无货');
      return false;
    }

    return true;
  },

  /**
   * 点击收藏
   */
  onLikeTap: function (event) {
    const isFav = event.currentTarget.dataset.fav;
    if (isFav) {
      app.favoriteApi.remove(this.data.goods.id);
    }
    else {
      app.favoriteApi.add(this.data.goods.id);
    }
    this.setData({ isFav: !isFav });
  },

  /**
  * 处理数量选择器请求
  */
  handleZanQuantityChange(e) {
    this.sku.setNum(e.quantity);
    this.setData({ sku: this.sku.export() });
  },
  /**********************卡券面板事件***********************/
  onCouponPanelShow: function () {
    const shelf = this.data.shelf;
    shelf.display = true;
    this.setData({ shelf: shelf });
  },

  onCouponPanelClose: function () {
    const shelf = this.data.shelf;
    shelf.display = false;
    this.setData({ shelf: shelf });
  },

  /**
   * 领取卡券
   */
  onCouponPick: function (event) {
    const couponId = event.currentTarget.dataset.couponId;
    Tips.loading();
    couponService.pick(couponId).then(data => {
      const shelf = this.data.shelf;
      const currentCoupon = shelf.pickList.find(item => item.id == couponId);
      currentCoupon.own = true;
      this.setData({ shelf: shelf });
      Tips.toast('领取成功！');
    });
  },

  /**********************分享事件***********************/

  /**
   * 分享
   */
  onShareAppMessage: function () {
    const title = app.globalData.shop.name;
    const desc = this.data.goods.name;
    const url = `/pages/goods/index/index?goodsId=${this.data.goods.id}`;
    return Tips.share(title, url, desc);
  },
  onScoreTap: function () {
    const goodsId = this.data.goods.id;
    app.router.goto(`/pages/goods/score/list?goodsId=${goodsId}`);
  }
}));