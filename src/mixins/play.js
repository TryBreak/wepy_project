import wepy from 'wepy';
import { $_baseUrl } from '../base.js';
export default class playMixin extends wepy.mixin {
  data = {
    status: ''
  };
  $_toPlay = (str, callback) => {
    const _this = this;
    if (!_this.status) {
      _this.$_start(str);
      callback('播放');
    } else {
      wx.getBackgroundAudioPlayerState({
        success(res) {
          _this.status = res;
          if (res.dataUrl.indexOf('?text=') > 1) {
            if (res.status === 1) {
              wx.pauseBackgroundAudio();
              callback('暂停');
            } else {
              wx.playBackgroundAudio();
              callback('播放');
            }
          } else {
            _this.$_start(str);
            callback('播放');
          }
        }
      });
    }
  };
  $_start = str => {
    str = str.replace(/\n/g, '');
    if (str.length > 250) {
      this.$_loop_Fun(str);
    } else {
      this.$_readText(str);
    }
  };
  $_readText = (str, callback) => {
    const _this = this;
    wx.playBackgroundAudio({
      title: '听故事',
      dataUrl: $_baseUrl + '/api/home/voice?text=' + str
    });
    _this.status = 'true';
    wx.onBackgroundAudioStop(() => {
      if (callback) {
        callback();
      }
    });
  };
  $_loop_Fun(str) {
    const _this = this;
    const strSplitOflength = str => {
      let rs = [];
      const strArr = str.match(/.{250}/gi);
      if (strArr) {
        rs = strArr;
        rs.push(str.substring(rs.join('').length));
      } else {
        rs[0] = str;
        return rs;
      }
      return rs;
    };
    const strarr = strSplitOflength(str);
    // loop
    let i = 0;
    const loog_fn = () => {
      _this.$_readText(strarr[i], () => {
        i++;
        if (i < strarr.length) {
          loog_fn();
        }
      });
    };
    loog_fn(strarr);
  }
}
