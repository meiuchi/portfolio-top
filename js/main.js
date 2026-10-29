// ===== カーソルアニメーション =====
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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. ふわっと出す演出（fade-up）
  //    同時に画面に入った要素だけ 0.12秒ずつずらす（nth-child の遅延は使わない）
  const fadeUpElements = document.querySelectorAll('.fade-up');
  if (fadeUpElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, obs) => {
      let n = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${n++ * 0.12}s`;
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
  const firstSection = document.querySelector('.section');
  const areaGnav = document.querySelector('.area-gnav');

  if (firstSection && hamburger) {
    const menuObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hamburger.classList.add('is-show');
          if (areaGnav) areaGnav.classList.add('is-hidden');
        } else {
          hamburger.classList.remove('is-show');
          if (areaGnav) areaGnav.classList.remove('is-hidden');
        }
      });
    }, {
      rootMargin: '0px 0px -500px 0px',
      threshold: 0
    });

    menuObserver.observe(firstSection);

  } else if (hamburger) {
    // .section が無いページ（詳細ページなど）：少しスクロールしたらナビ→ハンバーガーに切り替え
    const SWITCH_Y = 120;
    const toggleMenu = () => {
      const past = window.scrollY > SWITCH_Y;
      hamburger.classList.toggle('is-show', past);
      if (areaGnav) areaGnav.classList.toggle('is-hidden', past);
    };
    window.addEventListener('scroll', toggleMenu, { passive: true });
    toggleMenu();
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


  // 5. パララックス（トップページ：メインビジュアル・装飾イラスト）
  //    data-speed：プラス=手前で速い / マイナス=奥で遅い
  const mv = document.querySelector('.mainvisual');
  const logoArea = document.querySelector('.logo-area');
  const items = [...document.querySelectorAll('[data-speed]')].map(el => ({
    el, speed: parseFloat(el.dataset.speed), ty: 0
  }));

  // 6. 詳細ページ：canele-photo（楕円が中心から開く＋全体がゆっくりズレる）
  const frame = document.querySelector('.canele-photo');

  if (frame) {
    // 開く演出は動きを減らす設定でも、表示自体は必ず行う
    setTimeout(() => frame.classList.add('is-show'), reduceMotion ? 0 : 200);
    // スクロールで全体をゆっくり動かす（マイナス=奥っぽく遅い。数字を大きくすると動きも大きい）
    items.push({ el: frame, speed: -0.06, ty: 0 });
  }

  if (!reduceMotion && (mv || logoArea || items.length)) {
    let ticking = false;

    const update = () => {
      const y = Math.max(0, window.scrollY);
      const vh = window.innerHeight;

      if (mv) {
        mv.style.visibility = y > vh ? 'hidden' : 'visible';
        mv.style.transform = `translate3d(0, ${-y * 0.2}px, 0)`;
      }
      if (logoArea) {
        logoArea.style.translate = `0 ${-y * 0.2}px`;
        logoArea.style.opacity = Math.max(0, 1 - y / (vh * 0.7));
      }

      items.forEach(it => {
        const r = it.el.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) return;
        const center = r.top - it.ty + r.height / 2 - vh / 2;
        it.ty = center * it.speed;
        it.el.style.translate = `0 ${it.ty}px`;
      });
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }


  // 7. 詳細ページ：PC・SPモックアップの画面スクロール演出
  //    AUTO_SCROLL_MODE を切り替えて使う
  //      'off'   … 何もしない（自分で触ったときだけスクロール）
  //      'hover' … マウスを乗せている間だけ、ゆっくり下へ流れる（SPの画面タッチでは動かない）
  //      'view'  … 画面に入ったら勝手に最後まで流れる（触ったら止まる）
  const AUTO_SCROLL_MODE = 'hover';

  const screens = document.querySelectorAll('.screen-pc, .screen-sp');

  // マウスを乗せている間だけ流れる
  const hoverScroll = (screen) => {
    const SPEED = 1.2; // 1フレームあたりのpx（大きいほど速い）
    let raf = null;
    let pos = 0;

    const step = () => {
      const max = screen.scrollHeight - screen.clientHeight;
      pos = Math.min(max, pos + SPEED);
      screen.scrollTop = pos;
      if (pos < max) raf = requestAnimationFrame(step);
    };

    screen.addEventListener('mouseenter', () => {
      pos = screen.scrollTop;
      raf = requestAnimationFrame(step);
    });
    screen.addEventListener('mouseleave', () => cancelAnimationFrame(raf));
    // 自分でスクロールし始めたら、自動は止める
    ['wheel', 'touchstart'].forEach(ev =>
      screen.addEventListener(ev, () => cancelAnimationFrame(raf), { passive: true }));
  };

  // 画面に入ったら自動で最後まで流れる
  const autoScroll = (screen, duration = 20000) => {
    let stop = false;
    ['wheel', 'touchstart', 'pointerdown'].forEach(ev =>
      screen.addEventListener(ev, () => { stop = true; }, { passive: true }));

    const t0 = performance.now();
    const step = (now) => {
      if (stop) return;
      const t = Math.min((now - t0) / duration, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOut
      screen.scrollTop = (screen.scrollHeight - screen.clientHeight) * e;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!reduceMotion && screens.length > 0) {
    if (AUTO_SCROLL_MODE === 'hover') {
      screens.forEach(hoverScroll);
    } else if (AUTO_SCROLL_MODE === 'view') {
      const screenObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            autoScroll(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      screens.forEach(el => screenObserver.observe(el));
    }
  }

});
