import BaseApi from './BaseApi.js';
const wxApi = require('../utils/WxApi.js');
/**
 * 
 */
export default class UserApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * 检查是否授权或登录
   */
  check() {
    const user = wx.getStorageSync('user');
    const loginCode = wx.getStorageSync('login_code');
    if (user == "" || loginCode == '') {
      //拉起登录
    }
  }

  getWxJsCode() {
    return wxApi.wxLogin().then(res => {
      if (res.code == null || res.code == '') {
        return Promise.reject('获取js_code失败');
      } else {
        return res.code;
      }
    });
  }

  getLoginCode(jsCode) {
  }

  getWxUserInfo() {
    return wxApi.wxGetUserInfo();
  }

  checkUserInfo(rawUser) {

  }

  /**
   * 解密用户数据
   */
  decodeUserInfo(rawUser) {

  }

  saveUserInfo(user) {
    wx.setStorageSync('user', user);
    this.app.globalData.user = user;
  }

  cleanLoginInfo() {
    wx.removeStorageSync('user');
    wx.removeStorageSync('login_code');
    wx.removeStorageSync('third_session');
  }
}