import Carousel from './Carousel';
import './carousel-page.less';

window.addEventListener('DOMContentLoaded', function () {
  const carousels = document.getElementsByClassName('carousel');
  const carousel = new Carousel(<HTMLElement>carousels[0], {
    loop: true,
    onInit() {
      console.log('onInit');
    },
    onTransitionEnd(index: number) {
      console.log('onTransitionEnd：' + index);
    }
  });
  console.log(carousel);

  const carousel2 = new Carousel(<HTMLElement>carousels[1], {
    loop: true,
    autoplay: true,
    delay: 1000
  });
  // carousel2.on('transitionEnd', function (index: number) {
  //   console.log('transitionEnd：' + index);
  // });
  console.log(carousel);
});