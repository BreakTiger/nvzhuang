
import Tips from "../../../class/utils/Tips";
const app = getApp();
Page({
  data: {
    order: {},
    express: {},
    init: false
  },

  onLoad: function (options) {
    Tips.loading();
    const orderId = options.orderId;
    //获取订单信息
    app.orderApi.getInfo(orderId).then(data => {
      this.setData({
        order: data,
        init: true
      });
      Tips.loaded();
    });
  },

  /**
   * 关闭订单
   */
  onOrderClose: function (event) {
    const orderId = this.data.order.order_id;
    Tips.confirm('您确认取消该订单吗？').then(() => {
      Tips.loading('订单关闭中');
      return app.orderApi.closeOrder(orderId);
    }).then(data => {
      Tips.toast('订单关闭成功', () => app.router.orderIndexRefresh());
    }).catch(e => {
      Tips.error('关闭失败请联系客服', () => this.reload());
    });
  },

  /**
  * 订单退款
  */
  onOrderRefund: function (event) {
    const order = this.data.order;
    if (Number(order.order_amount) == 0) {
      Tips.alert('￥0 订单无需退款');
      return;
    }
    const refund = app.orderApi.createOrderRefund(order);
    const refundStr = JSON.stringify(refund);
    Tips.confirm('您确认要申请退款吗？').then(() => {
      return app.router.refundApply(refundStr);
    });
  },

  /**
   * 确认收货
   */
  onOrderConfirm: function (event) {
    const orderId = this.data.order.order_id;
    Tips.confirm('您确认已收到货品？').then(() => {
      Tips.loading('确认收货中');
      return app.orderApi.confirmOrder(orderId);
    }).then(data => {
      Tips.toast('确认收货成功', () => app.router.orderIndexRefresh());
    });
  },

  /**
   * 微信支付
   */
  onWxPay: function (event) {
    const orderId = this.data.order.order_id;
    Tips.loading('支付加载中');
    app.orderApi.prepayOrder(orderId).then(payment => {
      Tips.loaded();
      console.log(payment);
      return app.wxApi.wxPay(payment);
    }).then(res => {
      Tips.toast('支付成功', () => app.router.orderIndexRefresh());
    }).catch((error) => {
      if (error.data) {
        Tips.error('支付失败请联系客服');
      } else {
        Tips.toast('支付已取消');
      }
    });
  }
});