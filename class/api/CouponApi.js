import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class CouponApi extends BaseApi {
  constructor() {
    super();
  }

  page() {
    return new Pagination('coupon.me.list');
  }

  remove(id) {
    return this.post('coupon.delete', { 'id': id });
  }

  pick(id) {
    return this.post('coupon.pick', { 'coupon_id': id });
  }

  canPickList() {
    return this.get('coupon.available.list');
  }

  available(goods_amount) {
    return this.get('coupon.me.available', { 'goods_amount': goods_amount});
  }

  count() {

  }
}