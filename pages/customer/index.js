import Tips from '../../class/utils/Tips.js';

const app = getApp();

Page({
  data:{
    userInfo:{}
  },
  onLoad:function(options){
    app.authApi.check(); 
    this.setData({
      userInfo:wx.getStorageSync('user')
    });   
  }
});