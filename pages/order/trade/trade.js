import Tips from "../../../class/utils/Tips";
const app = getApp();

Page({
  data: {
    trade: {},
    address: null,
    message: "",
    delilveries: [],
    seletedDelilvery: null,
    coupons: [],
    selectedCoupon: null,
    shop_name: '',
    init: false
  },

  onLoad: function (options) {
    Tips.loading();
    const trade = JSON.parse(options.trade);
    console.log('trade',trade);

    this.setData({ trade: trade });

    app.addressApi.getDefault().then(data => {
      Tips.loaded();
      this.setData({
        address: data
      });
      return data;
    }).then(data => this.initPostType(data)).then(data=>{
      this.initCoupon(trade);
      this.setData({
        init: true
      });
    });


    //注册事件监听器
    const that = this;
    app.notification.addNotification("ON_ADDRESS_CHOICE", that.updateAddress, that);
  },

  onShow: function (options) {
  },

  /**
   * 捕捉备注文本
   */
  onMessageInput: function (event) {
    this.setData({ message: event.detail.value });
  },

  //******************* 订单操作 ******************/

  /**
   * 提交订单
   */
  onConfirmTap: function (event) {
    if (!this.data.address) {
      Tips.alert('请选择收货地址');
      return;
    }
    if (!this.data.seletedDelilvery) {
      Tips.alert('不满足配送条件');
      return;
    }

    //准备交易对象
    const trade = this.data.trade;
    const address = this.data.address;
    trade.message = this.data.message;
    trade.address = address;
    Tips.loading('订单创建中');

    //订单创建成功后直接拉起支付页面
    app.orderApi.createOrder(trade).then(data => {
      //清理购物车
      app.notification.postNotificationName("ON_CART_ORDER", trade.orderGoodsList);
      return data;
    }).then(orderId => {
      if (trade.paymentType == 1 && trade.finalPrice > 0) {
        //在线支付
        return this.wxPay(orderId);
      }
      else {
        //线下支付 & 金额不足0元
        Tips.toast('订单创建成功', () =>app.router.orderIndexRefresh());
      }
    }).catch(() => {
      Tips.toast('订单创建失败');
    });
  },



  /**
 * 微信支付
 */
  wxPay: function (orderId) {
    Tips.loading('支付加载中');
    app.orderApi.prepayOrder(orderId).then(payment => {
      Tips.loaded();
      return app.wxApi.wxPay(payment);
    }).then(res => {
      //字符成功，跳转到订单列表页面
      Tips.toast('支付成功', () => app.router.orderIndexRefresh());
    }).catch(() => {
      //支付取消，跳转到订详情页面
      Tips.toast('支付已取消', () => {
        app.router.orderDetailRedirect(orderId);
      });
    });
  },

  onPayTypeTap: function (event) {
    const trade = this.data.trade;
    Tips.actionWithFunc(['微信支付', '线下支付'],
      () => {
        trade.paymentText = '微信支付';
        trade.paymentType = 1;
        this.setData({ trade: trade });
      },
      () => {
        trade.paymentText = '微信支付';
        trade.paymentType = 0;
        this.setData({ trade: trade });
      });
  },

  //******************* 运费操作 ******************/


  initPostType: function (address) {
    return app.orderApi.queryPostPrice(address, this.data.trade.orderGoodsList).then(delilveryList => {
      if (delilveryList.length > 0) {
        const seletedDelilvery = delilveryList[0];
        const trade = this.updateTradePostFee(seletedDelilvery);
        this.setData({
          delilveries: delilveryList,
          seletedDelilvery: seletedDelilvery,
          trade: trade
        });
      }
    });
  },

  /**
   * 更新订单的运费信息
   */
  updateTradePostFee: function (delilvery) {
    const trade = this.data.trade;

    //运费属性
    //trade.deliveryType = delilvery.type;
    trade.postFee = delilvery.fee;

    return this.refreshTradePrice(trade);
  },


  /**
   * 选择运费
   */
  onPostFeeTap: function () {
    if (!this.data.address) {
      //尚未选择地址
      return;
    }
    if (!this.data.seletedDelilvery) {
      return;
    }
    const actions = this.data.delilveries.map(item => `${item.express_name} ￥${item.fee}`);
    Tips.action(actions).then(res => {
      const seletedDelilvery = this.data.delilveries[res.index];
      const trade = this.updateTradePostFee(seletedDelilvery);
      this.setData({
        seletedDelilvery: seletedDelilvery,
        trade: trade
      });
    });
  },

  //******************* 价格计算 ******************/
  refreshTradePrice: function (trade) {
    trade.finalPrice = 0;
    trade.finalPrice += trade.dealPrice ? parseFloat(trade.dealPrice) : 0;
    trade.finalPrice += trade.postFee ? parseFloat(trade.postFee) : 0;
    trade.finalPrice -= trade.couponPrice ? parseFloat(trade.couponPrice) : 0;
    trade.finalPrice = trade.finalPrice.toFixed(2);
    return trade;
  },

  //******************* 优惠券操作 ******************/

  initCoupon: function (trade){
    app.couponApi.available(trade.dealPrice).then(data=>{
      if(data.length==0){
        return;
      }
      this.setData({
        coupons:data
      });
    });
  },

  /**
   * 点击优惠券 
   */
  onCouponTap: function () {
    if (this.data.coupons.length < 1) {
      return;
    }
    const coupons = this.data.coupons;

    Tips.action(this.__funCouponAction(coupons)).then(res=>{
      this.updateCoupon(coupons[res.index]);
    });
  },

  __funCouponAction:function(coupons){
    let couponList = [];
    for(let i=0;i<coupons.length;i++){
      couponList.push(coupons[i].title);
    }
    return couponList;
  },

  /**
   * 优惠券修改回调函数
   */
  updateCoupon: function (coupon) {
    const trade = this.data.trade;
    trade.couponUsedId = coupon.id;
    trade.couponPrice = coupon.amount;

    this.setData({
      trade: this.refreshTradePrice(trade),
      selectedCoupon: coupon
    });
  },

  //******************* 地址操作 ******************/

  /**
   * 切换地址
   */
  onAddressTap: function (event) {
    app.router.addressIndex('choice');
  },

  /**
   * 地址修改回调函数
   */
  updateAddress: function (address) {
    Tips.loading('加载中');
    this.initPostType(address).then(() => {
      Tips.loaded();
      this.setData({
        address: address
      });
    });
  }
});