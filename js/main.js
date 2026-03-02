/**
 * 闪电狗AI快聘 - 官网交互脚本
 * 单页架构，锚点平滑滚动 + 滚动监听高亮导航
 */

(function () {
  'use strict';

  // ============ 导航栏 ============

  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const navAnchors = navLinks.querySelectorAll('a[data-section]');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('active');
  });

  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navLinks.classList.remove('active');
    }
  });

  // 点击导航链接时关闭移动菜单
  navAnchors.forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('active');
    });
  });

  // 导航栏滚动效果
  function handleNavScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ============ 滚动监听：自动高亮当前区域的导航项 ============

  const sectionMap = {
    home: document.getElementById('home'),
    about: document.getElementById('about'),
    faq: document.getElementById('faq'),
    contact: document.getElementById('contact'),
  };

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    // 从下往上检测，优先匹配更靠下的区域
    const entries = Object.entries(sectionMap).reverse();
    let activeId = 'home';

    for (const [id, el] of entries) {
      if (el && el.offsetTop <= scrollY) {
        activeId = id;
        break;
      }
    }

    navAnchors.forEach(function (a) {
      if (a.dataset.section === activeId) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  // 合并 scroll 事件，用 requestAnimationFrame 节流
  let scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        handleNavScroll();
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ============ 滚动入场动画 ============

  function initScrollAnimations() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============ 数字滚动动画 ============

  function animateNumbers() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;
          var text = el.textContent.trim();
          var match = text.match(/^([\d.]+)(.*)$/);

          if (match) {
            var target = parseFloat(match[1]);
            var suffix = match[2];
            var duration = 1500;
            var start = performance.now();

            function update(currentTime) {
              var elapsed = currentTime - start;
              var progress = Math.min(elapsed / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = target * eased;

              el.textContent = (Number.isInteger(target)
                ? Math.round(current)
                : current.toFixed(1)) + suffix;

              if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
          }

          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.stats-card .number, .stat-number').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============ 初始化 ============

  handleNavScroll();
  updateActiveNav();
  initScrollAnimations();
  animateNumbers();
})();
