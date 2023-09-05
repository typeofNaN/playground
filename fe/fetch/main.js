var tab = document.querySelector('#tab')
var html = ''

//  请求数据
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    // 先将数据按时间进行排序
    data.sort(function (a, b) {
      return Date.parse(a.time.replace(/-/g, '/')) - Date.parse(b.time.replace(/-/g, '/'))
    })

    //  将数据按时间进行分组,分组后插入res
    var res = {}

    for (var i = 0; i < data.length; i++) {
      var d = data[i].time.split(' ')[0]  // 只对日期进行分组
      var cur = res[d]
      if (cur === undefined) {
        res[d] = [data[i]]
      } else {
        var k = cur.find(t => t.phone === data[i].phone)
        if (!k) res[d].push(data[i])
        else k.gift = [].concat(k.gift, data[i].gift)
      }
    }
    for (var i in res) {
      var th = `<tr>
                <th>time</th>
                <th>phone</th>
                <th>gift</th>
              </tr>`
      html += th
      for (var j = 0; j < res[i].length; j++) {
        var td = `<tr>
                  <td>${res[i][j].time}</td>
                  <td>${res[i][j].phone}</td>
                  <td>${res[i][j].gift}</td>
                </tr>`
        html += td
      }
    }
    tab.innerHTML = html
  })