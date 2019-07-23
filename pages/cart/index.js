import Tips from "../../class/utils/Tips";
import Cart from "../../class/entity/Cart.js";
const app = getApp();
const Quantity = require('../..//templates/quantity/index');
Page(Object.assign({}, Quantity, {
  cart: {},
  page: {},
  data: {
    cart: {},
    init: false,
    delBtnWidth: 60,
    shopName: ''
  },
  onLoad: function (options) {

    const that = this;
    this.cart = new Cart();
    this.page = app.cartApi.page();
    //this.loadNextPage();
  },

  onShow: function () {
    this.reload();
  },

  reload: function () {
    this.page.reset();
    this.loadNextPage();
  },

  loadNextPage: function () {
    let that = this;
    Tips.loading();
    that.page.next().then(data => {
      Tips.loaded();
      that.cart.setCarts(data.list);
      that.cart.selectAll();
      that.render();
    });
  },
  render: function () {
    const cart = this.cart.export();
    this.setData({
      cart: cart,
      init: true
    })
  },

  onReachBottom: function () {
    this.loadNextPage();
  },
  /**
   * 删除订单的商品
   */
  removeOrderGoods: function (goodsList) {
    const carts = [];
    goodsList.forEach(goods => {
      const cart = this.cart.find(goods.goodsId, goods.goodsSku);
      carts.push(cart);
    });
    if (carts.length > 0) {
      //cartService.removeBatch(carts);
    }
    this.reload();
  },

  /***********************操作***********************/

  /**
   * 点击多选事件
   */
  onCheckTap: function (e) {
    const cartId = e.currentTarget.dataset.cartId;
    this.cart.toggleCartCheck(cartId);
    this.render();
  },

  /**
   * 点击多选按钮
   */
  onCheckAllTap: function (e) {
    this.cart.toggleAllCheck();
    this.render();
  },

  /**
   * 点击项目
   */
  onCartTap: function (e) {
    const goodsId = e.currentTarget.dataset.goodsId;
    app.router.goodsDetail(goodsId);
  },

  onDeleteTap: function (e) {
    let that = this;
    const cartId = e.currentTarget.dataset.cartId;
    Tips.confirm('是否从购物车中删除该商品').then(() => {
      that.cart.removeCart(cartId);
      that.render();
      return app.cartApi.remove(cartId);
    });
  },

  /**
   * 点击购买
   */
  onBuyTap: function (e) {
    if (this.cart.empty()) {
      Tips.alert("请选择商品");
      return;
    }
    if (this.cart.limit()) {
      Tips.alert("未达到起送金额");
      return;
    }
    if (!this.cart.open) {
      Tips.modal(app.globalData.shop.closeTips);
      return;
    }
    const message = this.cart.checkGoodsStock();
    if (message) {
      Tips.alert(message);
      return;
    }
    const carts = this.cart.getCheckedCarts();
    console.log(carts);
    const trade = app.orderApi.createCartTrade(carts);
    const param = JSON.stringify(trade);
    app.router.goto('/pages/order/trade/trade?trade=' + param);
  },

  /**
   * 处理数量选择器请求
   */
  handleZanQuantityChange(e) {
    var cartId = e.componentId;
    var num = e.quantity;
    this.cart.updateCartNum(cartId, num);
    this.render();
    app.cartApi.update(cartId, num);
  }
}));