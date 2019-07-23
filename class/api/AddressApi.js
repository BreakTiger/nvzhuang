import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class AddressApi extends BaseApi {
  constructor() {
    super();
  }

  page() {
    return new Pagination('address.list');
  }

  getDefault(){
    return this.get('address.default.get');
  }

  save(address){
    return this.post('address.add',address);
  }

  update(address){
    return this.post('address.update',address)
  }

  remove(addressId) {
    return this.post('address.delete',{'address_id':addressId})
  }

  setDefault(addressId){
    return this.post('address.default', { 'address_id': addressId })
  }
}