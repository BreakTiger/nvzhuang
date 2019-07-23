import Tips from './Tips.js';
//const baseURL = 'http://mall.didu.com/api/';
const baseURL = 'https://nz.didu86.com/api/';
export default class Http {
  constructor() {

  }

  /**
   * 
   */
  static request(method, url, data) {
    return new Promise((resolve, reject) => {
      const header = this.createAuthHeader();
      if (!data) {
        data = {};
      }
      data.store_id = 1;
      wx.request({
        url: baseURL + url,
        method: method,
        header: header,
        data: data,
        success: (res) => {
          const wxCode = res.statusCode;
          if (wxCode != 200) {
            reject(res)
          } else {
            const wxData = res.data;
            const code = wxData.code;
            if (code != 0) {
              if (code == 403) {
                wx.reLaunch({
                  url: '/pages/customer/login/login',
                })
              }
              reject(wxData);
            } else {
              const serverData = wxData.data;
              resolve(serverData);
            }
          }
        },
        fail: (res) => {
          reject(res);
        }
      })
    });
  }

  static createAuthHeader() {
    var header = {};
    if (wx.getStorageSync('token') != '') {
      header.Authorization = 'Bearer ' + wx.getStorageSync('token');
    }
    return header;
  }

  static get(url, data) {
    return this.request("GET", url, data);
  }

  static put(url, data) {
    return this.request("PUT", url, data);
  }

  static post(url, data) {
    return this.request("POST", url, data);
  }

  static patch(url, data) {
    return this.request("PATCH", url, data);
  }

  static delete(url, data) {
    return this.request("DELETE", url, data);
  }
}