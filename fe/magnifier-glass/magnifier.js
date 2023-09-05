class Magnifier {
  magnifierBox = document.querySelector('#magnifierBox') || null;
  magnifier = document.querySelector('#magnifier') || null;
  floatBox = document.querySelector('#floatBox') || null;
  bigBox = document.querySelector('#bigBox') || null;
  bigImg = document.querySelector('#bigImg') || null;

  constructor() {
    if (!this.magnifierBox || !this.magnifier || !this.floatBox || !this.bigBox || !this.bigImg) {
      return;
    }

    this.mouseEnter();
    this.mouseLeave();
    this.mouseMove();
  }

  mouseEnter() {
    this.magnifier.addEventListener('mouseenter', () => {
      this.floatBox.style.display = 'block';
      this.bigBox.style.display = 'block';
    })
  }

  mouseLeave() {
    this.magnifier.addEventListener('mouseleave', () => {
      this.floatBox.style.display = 'none';
      this.bigBox.style.display = 'none';
    })
  }

  mouseMove() {
    this.magnifier.addEventListener('mousemove', evt => {
      let _event = evt || window.event;
      let left = _event.clientX - this.magnifierBox.offsetLeft - this.floatBox.offsetWidth / 2;
      let top = _event.clientY - this.magnifierBox.offsetTop - this.floatBox.offsetHeight / 2;
      // 设置边界处理，防止移出小图片
      if (left < 0) {
        left = 0;
      } else if (left > (this.magnifier.offsetWidth - this.floatBox.offsetWidth)) {
        left = this.magnifier.offsetWidth - this.floatBox.offsetWidth;
      }
      if (top < 0) {
        top = 0;
      } else if (top > (this.magnifier.offsetHeight - this.floatBox.offsetHeight)) {
        top = this.magnifier.offsetHeight - this.floatBox.offsetHeight;
      }
      // 将left值和top值传给放大镜
      this.floatBox.style.left = left + 'px';
      this.floatBox.style.top = top + 'px';

      // 比例计算
      let percentX = left / (this.magnifier.offsetWidth - this.floatBox.offsetWidth);
      let percentY = top / (this.magnifier.offsetHeight - this.floatBox.offsetHeight);

      this.bigImg.style.left = -percentX * (this.bigImg.offsetWidth - this.bigBox.offsetWidth) + 'px';
      this.bigImg.style.top = -percentY * (this.bigImg.offsetHeight - this.bigBox.offsetHeight) + 'px';
    })
  }
}