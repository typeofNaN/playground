!(function(doc) {
  var _data = {};  // 保存号码信息
  var ie = doc.all ? true : false;  // 判断是否IE
  var step = 0;  // 步骤进度
  var stepOption = ['3-1-10', '2-1-3', '2-1-3','2-1-4','1-1-1', '1-2-1', '1-3-1', '1-4-1', '1-5-1', '0-1-1', '0-2-1', '0-3-1', '4-1-10'];  // 抽奖模板
  var runing = true;  // 是否处于抽奖状态
  var selected;  //中奖结果
  var luckBoy = {};  // 总中奖结果
  var timer;
  
  var _xhr = new XMLHttpRequest();

  var app = doc.getElementById('app');

  doc.onkeydown = KeyPress;

  // 监听键盘事件
  function KeyPress() {
    var key = ie ? event.keyCode : KeyPress.arguments[0].keyCode;
    if (key === 39) {
      if (runing) {
        return;
      }
      step++;
      if (step > 12) {
        step = 0;
      }
      _renderItem(stepOption[step]);
      step > 3 && step < 12 ? _pushData('nd') : _pushData('yh');

      runing = true; // 重新开启
    }
    if (key === 13) {
      if (runing) {
        clearInterval(timer);
        selected = [];
        var lists = doc.getElementsByClassName('lottery-li');

        // 获取当前中奖号码
        for (let i = 0; i < lists.length; i++) {
          selected.push(lists[i].getAttribute('data-tel'));
        }

        // 将中奖号码从总号码中移出，防止再次中奖
        step > 3 && step < 12 ? _data['nd'] = _deleteArray(_data['nd'], selected) : _data['yh'] = _deleteArray(_data['yh'], selected);

        // 将当前中奖号码放入总中奖号码中
        luckBoy[stepOption[step].slice(0, 3)] = luckBoy[stepOption[step].slice(0, 3)] ? [...luckBoy[stepOption[step].slice(0, 3)], ...selected] : selected;
        console.log(luckBoy);
      } else {
        // 重新开启，进行下一轮抽奖
        step > 3 && step < 12 ? _pushData('nd') : _pushData('yh');
      }
      runing = !runing;
    }
  }

  // 获取请求数据
  function _getData() {
    _http({
      method: 'GET',
      url: 'tel.json',
      success: function(res) {
        var datas = res.data;
        _data['nd'] = datas.filter(item => item.type === 1);
        _data['yh'] = datas.filter(item => item.type === 0);
        _pushData('yh');
      }
    })
  }

  // 将数据展示到页面上
  function _pushData(type) {
    var li = doc.getElementsByClassName('lottery-li');
    function run() {
      for (let i = 0; i < li.length; i++) {
        var result = _getRandomArrayElements(_data[type], 1)[0];
        li[i].innerHTML = _formatterTel(result.tel) + `<span>${_formatterName(result.name)}</span>`;
        li[i].setAttribute('data-tel', result.tel);
      }
    }
    timer = setInterval(run, 50);
  }

  // 将页面布局图片展示到页面上
  function _renderItem(opt) {
    let arr = opt.indexOf('-') > -1 ? opt.split('-') : [opt];
    var lotteryLi = '';
    for (let i = 0; i < arr[2]; i++) {
      lotteryLi += `
        <li class="lottery-li lottery-${arr[2]}"></li>
      `
    }
    var template = `
      <div class="lottery-box lottery-box${arr[0]}" style="background: url(images/t${arr[0]}/t${arr[0]}-bg.jpg) top center no-repeat">
        <div class="lottery-tel">
          <ul class="lottery-ul">
            ${lotteryLi}
          </ul>
        </div>
        <div class="lottery-jp">
          <img src="images/t${arr[0]}/t${arr[0]}-${arr[1]}.png" alt="">
        </div>
      </div>
    `
    app.innerHTML = template;
  }

  // 格式化电话号码
  function _formatterTel(tel) {
    return tel.slice(0, 3) + '****' + tel.slice(7, 11);
  }

  // 格式化姓名
  function _formatterName(name) {
    return name.slice(0, 1) + '**';
  }

  // 移出已中奖号码
  function _deleteArray(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i].tel === arr2[j]) { 
          arr1.splice(i,1); 
          i--; 
        }
      }
    }
    return arr1;
  }

  // XHR方法
  function _http(options) {
    _xhr.onreadystatechange = function(evt) {
      if (_xhr.readyState === 4 && _xhr.status === 200) {
        var res = JSON.parse(_xhr.responseText);
        if (options.success) options.success(res);
      }
    };
    _xhr.open(options.method, options.url);
    for (var k in options.headers) {
      if (options.headers.hasOwnProperty(k)) {
        _xhr.setRequestHeader(k, options.headers[k]);
      }
    }
    _xhr.send(options.data || null);
  }

  // 随机生成显示号码
  function _getRandomArrayElements(arr, count) {
    var arr1 = arr.slice(0), i = arr.length, min = i - count, idx;
    while (i-- > min) {
      idx = Math.floor((i + 1) * Math.random());
      [arr1[i], arr1[idx]] = [arr1[idx], arr1[i]]
    }
    return arr1.slice(min);
  }

  // 初始化
  _renderItem(stepOption[step]);
  _getData();
})(document);