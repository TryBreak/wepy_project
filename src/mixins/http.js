import wepy from 'wepy';
import { $_baseUrl } from '../base.js';

const success = (res, resolve, reject) => {
  let data = res.data;
  if (res.errMsg.indexOf('uploadFile') > -1) {
    data = JSON.parse(data);
  } else {
    if (res.header['Content-Type'].indexOf('audio') > -1) {
      resolve(res);
    }
  }
  if (data.code === 'OK') {
    resolve(data);
  } else {
    resolve(data);
    // reject(data);
  }
};

const fail = (err, resolve, reject) => {
  reject(err);
};
export default class http extends wepy.mixin {
  data = {
    token: 'Bearer ' + wx.getStorageSync('token')
  };
  $_get(url, data) {
    const _this = this;
    wx.showLoading({
      title: '加载中'
    });
    this.token = 'Bearer ' + wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wepy.request({
        url: $_baseUrl + url,
        data,
        header: {
          Authorization: _this.token
        },
        success(res) {
          wx.hideLoading();
          success(res, resolve, reject);
        },
        fail(res) {
          wx.hideLoading();
          fail(res, resolve, reject);
        }
      });
    });
  }
  $_post(url, data) {
    const _this = this;
    wx.showLoading({
      title: '加载中'
    });
    this.token = 'Bearer ' + wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wepy.request({
        url: $_baseUrl + url,
        data,
        header: {
          Authorization: _this.token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          wx.hideLoading();
          success(res, resolve, reject);
        },
        fail(err) {
          wx.hideLoading();
          fail(err, resolve, reject);
        }
      });
    });
  }
  $_recognition(callback) {
    const _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        _this
          .$_upload('/api/search/identification/image', tempFilePaths[0])
          .then(res => {
            callback(res);
          })
          .catch(res => {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            });
          });
      }
    });
  }
  $_upload(url, filePath) {
    const _this = this;
    wx.showLoading({
      title: '识别中'
    });
    this.token = 'Bearer ' + wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: $_baseUrl + url,
        filePath: filePath,
        name: 'image',
        header: {
          Authorization: _this.token
        },
        success: function(res) {
          wx.hideLoading();
          success(res, resolve, reject);
        },
        fail: function(err) {
          wx.hideLoading();
          fail(err, resolve, reject);
        }
      });
    });
  }
  $_uploadFile(url, filePath) {
    const _this = this;
    wx.showLoading({
      title: '识别中'
    });
    _this.token = 'Bearer ' + wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: $_baseUrl + '/api/ueditor?action=uploadfile',
        filePath: filePath,
        name: 'upfile',
        header: {
          Authorization: _this.token
        },
        success: function(res) {
          wx.hideLoading();
          success(res, resolve, reject);
        },
        fail: function(err) {
          wx.hideLoading();
          fail(err, resolve, reject);
        }
      });
    });
  }
}
