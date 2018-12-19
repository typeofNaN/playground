var btn = document.getElementById('btn')
var btn1 = document.getElementById('btn1')
var elnum = document.getElementsByClassName('num')
var numb = document.getElementsByClassName('numb')
var num = 0
var qian, bai, shi, ge
var arr9 = [9, 9, 9, 9]

var aa = btn.addEventListener('click', function() {
  num++
  tran(numb[3])
  getNumbers(num)

  if (num != 0 && num != 10 && ge === 0) tran(numb[2])
  if (num != 0 && num != 100 && ge === 0 && shi === 0) tran(numb[1])
  if (num != 0 && num != 1000 && ge ===0 && shi === 0 && bai ===0) tran(numb[0])
  
  if (num > 9 && num < 100) show(elnum[2])
  if (num > 99 && num < 1000) show(elnum[1])
  if (num > 999 && num <= 9999) show(elnum[0])
  if (num > 9999) {
    var nums = document.getElementsByClassName('num')
    for (let i = 0; i < nums.length; i++) {
      nums[i].children[0].innerHTML = arr9[i]
      nums[i].children[1].innerHTML = arr9[i]
    }
  }
})

var aa1 = btn1.addEventListener('click', function() {
  var val = parseInt(document.getElementById('inp').value)
  var i = 0
  var speed

  if (val >= 1000) speed = 5
  if (val < 999 && val > 500) speed = 10
  if (val <= 500 && val > 100) speed = 30
  if (val <= 99) speed = 50

  var st1 = setInterval(function() {
    if (i < val) {
      i++
      num++
      tran(numb[3])
      getNumbers(num)

      if (num != 0 && num != 10 && ge === 0) tran(numb[2])
      if (num != 0 && num != 100 && ge === 0 && shi === 0) tran(numb[1])
      if (num != 0 && num != 1000 && ge ===0 && shi === 0 && bai ===0) tran(numb[0])

      if (num > 9 && num < 100) show(elnum[2])
      if (num > 99 && num < 1000) show(elnum[1])
      if (num > 999 && num <= 9999) show(elnum[0])
      if (num > 9999) {
        var nums = document.getElementsByClassName('num')
        for (let i = 0; i < nums.length; i++) {
          nums[i].children[0].innerHTML = arr9[i]
          nums[i].children[1].innerHTML = arr9[i]
        }
      }
    } else {
      clearInterval(st1)
    }
  }, speed)
})

// 卡片翻转
function tran(el) {
  var i = 0
  var st = setInterval(function() {
    i++;
    el.style.transform = 'rotateX(' + 18 * i + 'deg)'
    if (i === 10) {
      i = 0
      clearInterval(st)
      el.style.transform = 'rotateX(' + 0 + 'deg)'
      sc(qian, bai, shi, ge)
    }
  }, 30)
}

// 卡片显示
function show(el) {
  el.style.opacity = 1
}

// 获取数字
function getNumbers(curnum) {
  qian = parseInt(curnum / 1000)
  bai = parseInt((curnum % 1000) / 100)
  shi = parseInt((curnum % 100) / 10)
  ge = parseInt(curnum % 10)
  return (qian, bai, shi, ge)
}

// 数字输出到页面
function sc(a, b, c, d) {
  var nums = document.getElementsByClassName('num')
  var arr = [a, b, c, d]
  for (let i = 0; i < nums.length; i++) {
    nums[i].children[0].innerHTML = arr[i]
    nums[i].children[1].innerHTML = arr[i]
  }
}

