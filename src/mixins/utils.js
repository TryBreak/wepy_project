import wepy from 'wepy';

export default class utils extends wepy.mixin {
  data = {
    mixin: 'This is mixin data.'
  };
  methods = {
    $_log() {
      console.log('mixin method tap');
      console.log(this.mixin);
      this.mixin = 'mixin data was changedxxx';
    }
  };
  $_fromData = val => {
    var da = val;
    da = new Date(da);
    var year = da.getFullYear() + '年';
    var month = da.getMonth() + 1 + '月';
    var date = da.getDate() + '日';
    return [year, month, date].join('');
  };
  $_roundNum = (begin, end) => {
    const num = Math.round(Math.random() * (end - begin) + begin);
    return num;
  };
  $_pureData = data => {
    // 获取纯净的数组和对象
    return JSON.parse(JSON.stringify(data));
  };
  $_setTimeout = null; // 全局的
  $_roundNum = (begin, end) => {
    // 获取随机整数
    var num = Math.round(Math.random() * (end - begin) + begin);
    return num;
  };
  $_shuffle = arr => {
    // 数组洗牌
    let i = arr.length;
    while (i) {
      let j = Math.floor(Math.random() * i--);
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
  };
  $_filterNull = val => {
    // 将null转化为空字符串
    if (val) {
      return val;
    } else {
      return '';
    }
  };

  $_goDetail = (item, typeName, isPayRout) => {
    console.log(item);
    console.log('typeName', typeName);
    let tabName = '';
    if (typeName && typeof typeName === 'string') {
      tabName = typeName;
    }

    const token = wx.getStorageSync('token');
    const url = `/pages/webview/character?type=${item.name.length}&name=${
      item.name
    }&token=${token}&tabName=${tabName}`;
    if (isPayRout) {
      wx.redirectTo({
        url
      });
    } else {
      wx.navigateTo({
        url
      });
    }
  };
}
