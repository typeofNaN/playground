const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//封装类似wx.login、wx.request等方法
function promisify(fn) {
  return async function (args) {
    return new Promise((resolve, reject) => {
      fn({
        ...(args || {}),
        success: async res => resolve(res),
        fail: err => reject(err)
      })
    })
  }
}

// 批量封装
function toAsync(...names) {
  return (names || [])
    .map(name => ({
      name,
      member: wx[name]
    }))
    .filter(t => typeof t.member === "function")
    .reduce((r, t) => {
      r[t.name] = promisify(wx[t.name]);
      return r;
    }, {});
}
//要转化的方法
const awx = toAsync("login", "request", "uploadFile");

//从居民身份证取出出生年月日、性别
function onGetBirthDayASex(idNo) {
  let [ret, birthday, sex] = [true, "", 0];
  if (idNo.length !== 18) {
    ret = false;
    return {
      ret,
      birthday,
      sex
    };
  } else {
    birthday = `${idNo.substr(6,4)}-${idNo.substr(10,2)}-${idNo.substr(12,2)}`;
    sex = parseInt(idNo.substr(-2, 1)) % 2;
    return {
      ret,
      birthday,
      sex
    };
  }
}

const idCardValid = function (id) {
  let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if (!format.test(id)) {
    return false
  }
  //区位码校验
  //出生年月日校验   前正则限制起始年份为1900;
  let year = id.substr(6, 4), //身份证年
    month = id.substr(10, 2), //身份证月
    date = id.substr(12, 2), //身份证日
    time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
    now_time = Date.parse(new Date()), //当前时间戳
    dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
  if (time > now_time || date > dates) {
    return false
  }
  //校验码判断
  let c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
  let b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
  let id_array = id.split("");
  let sum = 0;
  for (let k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k]);
  }
  if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
    return false
  }
  return true
}

module.exports = {
  formatTime,
  awx,
  onGetBirthDayASex,
  idCardValid
}