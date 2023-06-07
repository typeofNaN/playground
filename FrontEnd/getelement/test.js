var li = document.getElementsByClassName('nav-li')
var li1 = document.getElementsByClassName('li1')
var ul1 = document.getElementsByClassName('ul1')[0]
for (let i = 0; i < li.length; i++) {
  li[i].onclick = function () {
    addClass(this, 'red')
    ul1.slideDown()
  }
}

for (let i = 0; i < li1.length; i++) {
  li1[i].onclick = function () {
    removeClass(this, 'red')
  }
}

function show(element) {
  element.style.display = 'block'
}
// Object.prototype.show = function() {
//   this.style.display = "block"
//   return this
// }
function hide(element) {
  element.style.display = 'none'
}
// Object.prototype.hide = function() {
//   this.style.display = "none"
//   return this
// }
function hasClass(element, cName) {
  return !!element.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'))
}
function addClass(element, cName) {
  if (!hasClass(element, cName)) element.className += ' ' + cName
}
function removeClass(element, cName) {
  if (hasClass(element, cName)) element.className = element.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ')
}
function fadeIn(element, speed) {
  var speed = speed || 30
  var num = 0
  if (element.style.display == 'none') element.style.display = 'block'
  element.style.opacity = num
  var st = setInterval(function () {
    num++
    element.style.opacity = num / 10
    if (num >= 10) clearInterval(st)
  }, speed)
}
function fadeOut(element, speed) {
  var speed = speed || 30
  var num = 10
  var st = setInterval(function (hide) {
    num--
    element.style.opacity = num / 10
    if (num <= 0) {
      element.style.display = 'none'
      clearInterval(st)
    }
  }, speed)
}
// function slideDown(element, time) {
//   element.style.display = 'block'
//   var height = element.clientHeight
//   element.style.height = 0
//   element.style.overflow = 'hidden'

//   console.log(height)
//   var time = time || 5
//   element.style.height = height + 'px'
//   element.style.transition = 'height' + ' ' + time + 's'

// }
Object.prototype.slideDown = function () {
  this.style.display = 'block'
  if (this.clientHeight < this.scrollHeight) {
    this.style.height = 10 + this.clientHeight + "px";
    var _this = this;
    setTimeout(function () {
      _this.slideDown();
    }, 10000)
  } else {
    this.style.height = this.scrollHeight + "px";
  }
}