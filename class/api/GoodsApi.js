import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class GoodsApi extends BaseApi {
  constructor() {
    super();
  }

  page() {
    return new Pagination('goods.search.list');
  }
  /**
   * 获取商品分类列表
   */
  getCategoryList(pid = 0) {

  }

  /**
   * 获取商品信息
   */
  getInfo(goodsId) {
    return this.get('goods.detail',{'goods_id':goodsId});
  }
}