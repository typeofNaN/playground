// 定义数据
const data = {
  'a': {
    'a1': 'a11,a12,a13',
    'a2': 'a21,a22,a23',
    'a3': 'a31,a32,a33'
  },
  'b': {
    'b1': 'b11,b12,b13',
    'b2': 'b21,b22,b23',
    'b3': 'b31,b32,b33'
  },
  'c': {
    'c1': 'c11,c12,c13',
    'c2': 'c21,c22,c23',
    'c3': 'c31,c32,c33'
  }
}

class Area {
  dt = data;
  curArr = [];
  aDom = document.getElementById('a');
  bDom = document.getElementById('b');
  cDom = document.getElementById('c');

  // 根据进度筛选数据
  getData(type) {
    let dataList = [];

    switch (type) {
      case 0:
        for (let i in this.dt) {
          dataList.push(i);
        }
        break;
      case 1:
        let data2 = this.dt[this.curArr[0]]
        for (let i in data2) {
          dataList.push(i);
        }
        break;
      case 2:
        dataList = this.dt[this.curArr[0]][this.curArr[1]].split(',');
        break;
    }

    return dataList;
  }

  // 渲染到页面节点
  render(dom, list) {
    let html = '<ul>';
    list.forEach(item => {
      html += `<li>${item}</li>`
    })
    html += '</ul>';

    dom.innerHTML = html;

    // 为所有新生成的元素添加事件监听
    document.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        let parentId = item.parentNode.parentNode.id;
        let step = parentId === 'a' ? 0 : parentId === 'b' ? 1 : 2;
        this.curArr[step] = item.innerText;
        this.liClick(step + 1, item);
      })
    })
  }

  // 点击之后触发
  liClick(step, curDom) {
    if (step === 1) {
      this.cDom.innerHTML = '';
    }

    this.curArr = this.curArr.slice(0, step);
    document.querySelector('#idx').innerHTML = this.curArr.join(',');

    // 点击之后添加类
    let domArr = Array.from(curDom.parentNode.children);
    domArr.forEach(item => {
      item.classList.remove('active')
    })
    curDom.classList.add('active');

    // 如果选择最后一项，不执行以下方法
    if (step > 2) {
      return;
    }

    let getAreas = this.getData(step);
    let idxDom = step === 0 ? this.aDom : step === 1 ? this.bDom : this.cDom;
    this.render(idxDom, getAreas);
  }

  // 初始化
  init() {
    this.render(this.aDom, this.getData(0));
  }
}

let aaa = new Area();
aaa.init();