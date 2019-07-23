import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class CartApi extends BaseApi {
  constructor() {
    super();
  }

  page() {
    return new Pagination('cart.goods.list');
  }

  count() {
    return this.get('cart.goods.count');
  }

  add(goods_id, sku_id, goods_num) {
    let params = { 'goods_id': goods_id, 'sku_id': sku_id, 'goods_num': goods_num };
    return this.post('cart.goods.add', params);
  }

  remove(cartId) {
    return this.post('cart.goods.delete', { 'cart_id': cartId });
  }

  update(cartId, num) {
    return this.post('cart.goods.update', { 'cart_id': cartId, 'goods_num': num });
  }
}