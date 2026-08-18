// カーソルアニメーション
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;
const lerpFactor = 0.15;

if (dot && ring) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`; 
  });

  function render() {
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(render);
  }

  render();
}


document.addEventListener('DOMContentLoaded', () => {

  // 1. ふわっと出す演出（fade-up）
  const fadeUpElements = document.querySelectorAll('.fade-up');
  if (fadeUpElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-show');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -100px 0px',
      threshold: 0
    });

    fadeUpElements.forEach(el => fadeObserver.observe(el));
  }


  // 2. 御見積もりについての黄色マーカー
  const markerElements = document.querySelectorAll('.marker-animation');
  if (markerElements.length > 0) {
    const markerObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-show');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px'
    });

    markerElements.forEach(el => markerObserver.observe(el));
  }


  // 3. 文字がバラバラに出てくるアニメーション（stagger-text）
  const staggerTargets = document.querySelectorAll('.stagger-text');
  if (staggerTargets.length > 0) {
    staggerTargets.forEach(target => {
      const spans = target.querySelectorAll('span');
      spans.forEach((span, index) => {
        span.style.transitionDelay = `${index * 0.08}s`;
      });
    });

    const staggerObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-show');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px'
    });

    staggerTargets.forEach(el => staggerObserver.observe(el));
  }


  // 4. ハンバーガーボタン & PCナビの表示切替制御
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.hamburger-navigation');
  const firstSection = document.querySelector('.section'); // 監視対象を .section に変更！
  const areaGnav = document.querySelector('.area-gnav');

  if (firstSection && hamburger) {
    const menuObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // .section が画面に入ってきたら（見え始めたら）
        if (entry.isIntersecting) {
          hamburger.classList.add('is-show'); // ハンバーガー表示
          if (areaGnav) areaGnav.classList.add('is-hidden'); // PCナビ非表示
        } else {
          // ファーストビュー（メインビジュアルのみ）に戻ったら
          hamburger.classList.remove('is-show'); // ハンバーガー非表示
          if (areaGnav) areaGnav.classList.remove('is-hidden'); // PCナビ表示
        }
      });
    }, {
      // .section が画面の下から少し（約100px）入ってきたタイミングで発動
      rootMargin: '0px 0px -500px 0px',
      threshold: 0
    });

    menuObserver.observe(firstSection);
  }

  // メニュー開閉処理
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

});
