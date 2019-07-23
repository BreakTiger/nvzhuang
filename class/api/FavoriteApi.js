import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class FavoriteApi extends BaseApi {
  constructor() {
    super();
  }

  page() {
    return new Pagination('favorite.goods.list');
  }

  add(goodsId) {
    return this.post('favorite.goods', { 'goods_id': goodsId, 'status': 1 });
  }

  remove(goodsId) {
    return this.post('favorite.goods', { 'goods_id': goodsId, 'status': 0 });
  }
}