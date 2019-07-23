import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';
const wxApi = require('./../utils/WxApi.js');
export default class AuthApi extends BaseApi {
  constructor() {
    super();
  }

  check() {
    const user = wx.getStorageSync('user');
    if (user == '') {
      wx.reLaunch({
        url: '/pages/customer/login/login',
      })
    }
  }  

  getCode() {
    return wxApi.wxLogin().then(res => {
      if (res.code == null || res.code == '') {
        return Promise.reject('登录失败');
      } else {
        return res.code;
      }
    });
  }

  login(code) {
    return this.get('member.wechat.login', { 'code': code });
  }

  saveAuthInfo(auth) {
    console.log(auth);
    wx.setStorageSync('auth', auth);
  }

  saveUserInfo(user) {
    let param = {
      'openid':user.openId,
      'nickname':user.nickName,
      'avatar':user.avatarUrl,
      'unionid':''
    };
    return this.post('member.wechat.register',param).then(user=>{
      if(user){
        wx.setStorageSync('user',user);
        wx.setStorageSync('token', user.token);
      }else{
        return Promise.reject('注册失败');
      }
    })
    
  }

  decryptUserInfo(encryptedData, iv) {
    const auth = wx.getStorageSync('auth');
    const openid = auth.openid;
    const param = {
      encryptedData: encryptedData,
      iv: iv,
      openid: openid
    };
    return this.post('member.wechat.decrypt', param);
  }

  cleanLoginStatus() {
    wx.removeStorageSync('user');
    wx.removeStorageSync('auth');
    wx.removeStorageSync('token');
  }
}