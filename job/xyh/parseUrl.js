const url = 'http://www.xiyanghui.com/product/list?id=123456&sort=discount#title';

var obj = {};

// 主函数
function parseUrl(url) {
  var protocol = getProtocol(url);
  var host = getHost(url);
  var path = getPath(url);
  var query = getQuery(url);
  var hash = getHash(url);

  obj.protocol = protocol;
  obj.host = host;
  obj.path = path;
  obj.query =query;
  obj.hash = hash;
  return obj;
}

// 获取协议号
function getProtocol(url) {
  var arrUrl = url.split(':');
  var protocol = arrUrl[0];
  return protocol;
}

// 获取主机号
function getHost(url) {
  var arrUrl = url.split('/');
  var host = arrUrl[2];
  return host;
}

// 获取路径
function getPath(url) {
  var arrUrl = url.split('//');
  var start = arrUrl[1].indexOf('/');
  var relUrl = arrUrl[1].substring(start);

  if (relUrl.indexOf('?') != -1) relUrl = relUrl.split('?')[0];
  return relUrl;
}

// 获取参数
function getQuery(url) {
  var queryObj = {};

  if (url.indexOf('?') != -1) { // 判断是否有参数
    if (url.indexOf('#') != -1) { // 判断是否有哈希值
      url = url.split('#')[0];
    }
    var arrUrl = url.split('?');
    var arr = arrUrl[1].split('&');
    for (let i = 0; i < arr.length; i++) {
      var parm = arr[i].split('=');
      queryObj[parm[0]] = parm[1];
    }
  }
  return queryObj;
}

// 获取hash
function getHash(url) {
  var hash = url.indexOf('#') != -1 ? url.split('#')[1] : '';
  return hash;
}

// 执行方法
parseUrl(url);
console.log(parseUrl(url));