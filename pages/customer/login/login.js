import Tips from "../../../class/utils/Tips";
const app = getApp();
Page({
  data: {
    shop: {}
  },

  onLoad: function (options) {
    let that = this;
    app.shopApi.getInfo().then(data => {
      that.setData({
        shop: data
      });
    });
  },

  confirm: function ({ detail }) {
    console.log(detail);
    Tips.loading();
    const rawUser = detail;
    app.authApi.getCode()
      .then(code => app.authApi.login(code))
      .then(auth => app.authApi.saveAuthInfo(auth))
      .then(() => app.authApi.decryptUserInfo(rawUser.encryptedData, rawUser.iv))
      .then(user => app.authApi.saveUserInfo(user))
      .then(() => {
        Tips.loaded();
        Tips.toast('授权成功', () => {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        });
      }).catch(() => {
        Tips.loaded();
        Tips.error('授权失败');
      }).finally(() => {
        Tips.loaded();
      });
  }
})