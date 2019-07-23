import BaseApi from './BaseApi.js';
/**
 * 
 */
export default class ShopApi extends BaseApi {
  constructor() {
    super();
  }

  getSlide() {
    return this.get('store.slide.list');
  }

  getInfo() {
    return this.get('store.info');
  }

  getNewGoods(size) {
    return this.get('goods.search.list', { 'size': size });
  }

  getHotGoods(size) {
    return this.get('goods.search.list', { 'size': size, 'recommend': 1 });
  }

  getGoodsClassList() {
    return this.get('goods.class.list').then(data=>this._createClassTab(data));
  }

  _createClassTab(data) {
    const list = [];
    if(data.length>0){
      list.push(...data.map(item=>{
        return {
          id:item.id,
          title:item.gc_name
        };
      }));
    }
    const tab = {
      list:list,
      selectedId:list[0]['id'],
      scroll:true
    };
    return tab;
  }

}