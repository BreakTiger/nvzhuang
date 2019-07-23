import Tips from "../../../class/utils/Tips";
const app = getApp();

Page({
  page: {},
  data: {
    orders: [],
    status: '',
    tabbar: {},
    init: false,
    loading: false,
    nomore: false
  },

  /**
   * 页面加载
   */
  onLoad: function (options) {
    Tips.loading();
    //authService.check();
    this.page = app.orderApi.page();
    this.iniOrderTabBar()
    this.loadNextPage();

    //事件监听
    const that = this;
    app.notification.addNotification("ON_ORDER_UPDATE", that.reload, that);
  },

  /**
   * 页面展现
   */
  onShow: function () {

  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next({ status: this.data.status }).then(data => {
      Tips.loaded();
      this.setData({
        orders: data.list,
        nomore: data.list.length == this.data.orders.length,
        loading: false,
        init: true
      });
    });
  },

  /**
   * 上划加载
   */
  onReachBottom: function (event) {
    if (this.data.nomore) {
      return;
    }
    this.loadNextPage();
    this.setData({ loading: true });
  },

  /**
    * 下拉刷新
    */
  onPullDownRefresh: function () {
    this.reload();
  },

  /**
   * 重新加载
   */
  reload: function () {
    this.page.reset();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 点击单个订单 
   */
  onOrderTap: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    app.router.orderDetail(orderId);
  },


  //******************* TAB页 ******************/


  iniOrderTabBar: function () {
    const tabbar = {
      tabs: [
        { "value": "", "name": "全部" },
        { "value": "10", "name": "待付款" },
        { "value": "20", "name": "待发货" },
        { "value": "30", "name": "待收货" },
        { "value": "40", "name": "已完成" },
      ],
      selected: this.data.status
    };

    this.setData({ tabbar: tabbar });
  },

  //点击TAB页的事件
  onOrderTabTap: function (event) {
    const status = event.currentTarget.dataset.status;
    const tabbar = this.data.tabbar;
    tabbar.selected = status;
    Tips.loading();
    //更新/初始化页面数据
    this.setData({
      status: status,
      tabbar: tabbar,
    });

    //初始化分页数据
    this.page.reset();

    //刷新页面
    this.loadNextPage();
  },

  //******************* 订单操作 ******************/

  /**
   * 确认收货
   */
  onOrderConfirm: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    Tips.confirm('您确认已收到货品？').then(() => {
      Tips.loading('确认收货中');
      return app.orderApi.confirmOrder(orderId);
    }).then(data => {
      Tips.toast('确认收货成功', () => this.reload());
    });
  },

  /**
   * 微信支付
   */
  onWxPay: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    Tips.loading('支付加载中');
    app.orderApi.prepayOrder(orderId).then(payment => {
      Tips.loaded();
      console.log(payment);
      return app.wxApi.wxPay(payment);
    }).then(res => {
      Tips.toast('支付成功', () => this.reload());
    }).catch((error) => {
      if (error.data) {
        Tips.error('支付失败请联系客服');
      } else {
        console.log(error)
        Tips.toast('支付已取消');
      }
    });
  },

  onOrderRefund:function(e){
    app.router.refundApply(e.currentTarget.dataset.orderId);
  },

  /**
  * 关闭订单
  */
  onOrderClose: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    Tips.confirm('您确认取消该订单吗？').then(() => {
      Tips.loading('订单关闭中');
      return app.orderApi.closeOrder(orderId);
    }).then(data => {
      Tips.toast('订单关闭成功', () => this.reload());
    }).catch(e => {
      if (e.data != null) {
        Tips.error('关闭失败请联系客服', () => this.reload());
      }
    });
  },

  /**
   * 物流查询
   */
  onOrderTrace: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    const order = this.data.orders.find(order => order.orderId == orderId);
    const preview = expressService.createExpressOrderPreview(order);
    const previewStr = JSON.stringify(preview);
    Router.orderTrace(previewStr);
  },

  /**
   * 评论订单
   */
  onOrderComment: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    const order = this.data.orders.find(order => order.orderId == orderId);

    const scores = order.orderGoodsInfos.map(item => {
      return {
        goodsId: item.goodsId,
        orderId: orderId,
        sku: item.goodsSku,
        preview: item.imageUrl,
        star: 5,
        starArr: [1, 1, 1, 1, 1],
        comment: ''
      };
    });

    const data = JSON.stringify(scores);

    Router.goto(`/pages/goods/score/score?orderId=${orderId}&data=${data}`);
  },

  // 点击进入详情页面
  onDetailTap: function (e) {
  
  },


  // 点击申请退货

  onOrderReturn: function (e) {
    wx.navigateTo({
      url: '/pages/order/return/return',

    })
  }



})