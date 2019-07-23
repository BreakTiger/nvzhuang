const wxApi = require('/class/utils/WxApi.js');
import AuthApi from '/class/api/AuthApi';
import ShopApi from '/class/api/ShopApi.js';
import GoodsApi from '/class/api/GoodsApi.js';
import Router from '/class/utils/Router.js';
import CartApi from '/class/api/CartApi.js';
import OrderApi from '/class/api/OrderApi.js';
import AddressApi from '/class/api/AddressApi.js';
import FavoriteApi from '/class/api/FavoriteApi.js';
import CouponApi from '/class/api/CouponApi.js';

const authApi = new AuthApi();
const shopApi = new ShopApi();
const goodsApi = new GoodsApi();
const cartApi = new CartApi();
const orderApi = new OrderApi();
const addressApi = new AddressApi();
const favoriteApi = new FavoriteApi();
const couponApi = new CouponApi();
const router = new Router();
const notification = require("/class/utils/WxNotificationCenter.js");

App({
  onLaunch: function (options) {
    this.globalData.init = true;
  },
  wxApi: wxApi,
  authApi: authApi,
  shopApi:shopApi,
  goodsApi:goodsApi,
  cartApi:cartApi,
  orderApi:orderApi,
  addressApi:addressApi,
  favoriteApi:favoriteApi,
  couponApi:couponApi,
  router:router,  
  notification: notification,
  globalData: {
    init: false,
    cart: { num: 0 },
    user: null,
    auth: {},
    publicUrl: "",
    apiUrl: ""
  }
})