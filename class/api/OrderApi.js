import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class OrderApi extends BaseApi {
  constructor() {
    super();

    this.statusDesc = {
      "10": "请于24小时内付款，超时订单自动关闭",
      "20": "您已完成付款，卖家准备发货中",
      "30": "请您耐心等待，到货后请确认收货",
      "40": "交易已完成"
    }
  }

  page() {
    return new Pagination('order.list');
  }

  /**
   * 获取订单信息
   */
  getInfo(orderId) {
    return this.get('order.detail', { 'order_id': orderId }).then(detail => {
      this._processOrderDetail(detail);
      return detail;
    });
  }

  _processOrderDetail(detail) {
    const status = detail.order_status;
    detail.statusDesc = this.statusDesc[status];
  }

  createCartTrade(goodsList) {
    const orderGoodsList = [];
    let price = 0;
    for (let i in goodsList) {
      const goods = goodsList[i];
      orderGoodsList.push(goods);
      price += goods.goods_price * goods.goods_num;
    }
    const trade = {
      dealPrice: price.toFixed(2),
      finalPrice: price.toFixed(2),
      paymentType: "1",
      paymentText: "微信支付",
      orderGoodsList: orderGoodsList
    };
    return trade;
  }

  createSingleTrade(goods, sku) {
    const price = goods.price * sku.num;
    const orderGoodsList =[];
    goods.sku_id = goods.id;
    goods.goods_price = goods.price;
    goods.goods_num = sku.num;
    orderGoodsList.push(goods);
    const trade = {
      dealPrice: price,
      finalPrice: price,
      paymentType: "1",
      paymentText: "微信支付",
      orderGoodsList: orderGoodsList
    };
    return trade;
  }

  queryPostPrice(address, goodsList) {
    const param = {
      address: address,
      goodsList: goodsList
    };
    return this.post('order.query.express', param);
  }

  /**
   * 创建订单
   */
  createOrder(trade) {
    return this.post('order.trade.create', trade);
  }

  prepayOrder(orderId) {
    return this.post('order.pay', { 'order_id': orderId });
  }

  closeOrder(orderId) {
    return this.post('order.close', { 'order_id': orderId })
  }

  /**
   * 申请退货
   */
  refundOrderGoods(orderId, goodsId) {

  }

  refundList() {
    return new Pagination('order.refund.return');
  }


  /**
   * 申请退单
   */
  refundOrder(orderId, refund) {
    return this.post('order.refund.return.apply', { 'order_id': orderId, 'refund': refund })
  }
  /**
   * 取消退单申请
   */
  cancelRefundOrder(orderId) {

  }
  /**
   * 确认收货
   */
  confirmOrder(orderId) {
    return this.post('order.confirm', { 'order_id': orderId });
  }
  /**
   * 评价订单
   */
  commentOrder(orderId, comments) {

  }
  /**
   * 评价列表
   */
  commentList(goodsId) {

  }
  /**
   * 评价数量
   */
  commentCount(goodsId) {

  }
}