/**
 * 闪电狗AI快聘 - 公司官网交互脚本
 * 纯前端静态页面，无后端依赖
 */

// ============ 导航栏 ============

// 移动端菜单切换
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

// 导航栏滚动效果
function handleNavScroll() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll);

// 点击页面其他区域关闭移动端菜单
document.addEventListener('click', function(e) {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  if (navLinks && navLinks.classList.contains('active')) {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  }
});


// ============ 滚动动画 ============

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
  });
}


// ============ 表单处理 ============

function handleSubmit(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = '提交中...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = '✓ 提交成功！';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    btn.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.35)';

    event.target.reset();

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.background = '';
      btn.style.boxShadow = '';
    }, 3000);
  }, 1200);
}


// ============ 数字滚动动画 ============

function animateNumbers() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();

          const match = text.match(/^([\d.]+)(.*)$/);
          if (match) {
            const target = parseFloat(match[1]);
            const suffix = match[2];
            const duration = 1500;
            const start = performance.now();

            function update(currentTime) {
              const elapsed = currentTime - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;

              if (Number.isInteger(target)) {
                el.textContent = Math.round(current) + suffix;
              } else {
                el.textContent = current.toFixed(1) + suffix;
              }

              if (progress < 1) {
                requestAnimationFrame(update);
              }
            }
            requestAnimationFrame(update);
          }

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stats-card .number, .stat-number').forEach((el) => {
    observer.observe(el);
  });
}


// ============ 在线编辑模式 ============

function initEditor() {
  let isEditing = false;

  // 创建浮动工具栏
  const toolbar = document.createElement('div');
  toolbar.id = 'editor-toolbar';
  toolbar.innerHTML = `
    <button id="editor-toggle" title="开启编辑模式">✏️ 编辑文字</button>
    <button id="editor-save" style="display:none;" title="下载修改后的页面">💾 保存下载</button>
    <button id="editor-cancel" style="display:none;" title="退出编辑">✕</button>
  `;
  document.body.appendChild(toolbar);

  // 工具栏样式
  const style = document.createElement('style');
  style.textContent = `
    #editor-toolbar {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    #editor-toolbar button {
      padding: 12px 20px;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
    #editor-toggle {
      background: #FFB800;
      color: #1a1a1a;
    }
    #editor-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255,184,0,0.4);
    }
    #editor-toggle.active {
      background: #1a1a1a;
      color: #FFB800;
    }
    #editor-save {
      background: #10b981;
      color: white;
    }
    #editor-save:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16,185,129,0.4);
    }
    #editor-cancel {
      background: #ef4444;
      color: white;
      padding: 12px 14px !important;
      border-radius: 50% !important;
    }
    #editor-cancel:hover {
      transform: translateY(-2px);
    }
    /* 编辑模式下可编辑元素的样式 */
    body.edit-mode [contenteditable="true"] {
      outline: 2px dashed rgba(255, 184, 0, 0.4);
      outline-offset: 4px;
      border-radius: 4px;
      transition: outline-color 0.2s;
      min-height: 1em;
    }
    body.edit-mode [contenteditable="true"]:hover {
      outline-color: rgba(255, 184, 0, 0.7);
    }
    body.edit-mode [contenteditable="true"]:focus {
      outline: 2px solid #FFB800;
      background: rgba(255, 184, 0, 0.05);
    }
    /* 顶部提示条 */
    #editor-banner {
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      z-index: 999;
      background: #FFB800;
      color: #1a1a1a;
      text-align: center;
      padding: 10px 16px;
      font-size: 0.85rem;
      font-weight: 600;
      display: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    body.edit-mode #editor-banner {
      display: block;
    }
  `;
  document.head.appendChild(style);

  // 提示条
  const banner = document.createElement('div');
  banner.id = 'editor-banner';
  banner.textContent = '📝 编辑模式已开启 — 点击任意文字即可直接修改，改完点右下角「保存下载」';
  document.body.appendChild(banner);

  // 可编辑的选择器（排除导航和脚本区域）
  const editableSelectors = [
    '.hero h1', '.hero p', '.hero-badge',
    '.hero-card-title', '.hero-card-subtitle',
    '.stat-number', '.stat-label',
    '.section-label', '.section-title', '.section-desc',
    '.feature-card h3', '.feature-card p',
    '.stats-card .number', '.stats-card .label',
    '.cta-section h2', '.cta-section p',
    '.page-hero h1', '.page-hero p',
    '.about-text h2', '.about-text p',
    '.about-image-content p',
    '.timeline-year', '.timeline-title', '.timeline-desc',
    '.team-card h4', '.team-card .role', '.team-card .bio',
    '.service-card h3', '.service-card p',
    '.service-tag',
    '.process-card h4', '.process-card p',
    '.contact-info h3', '.contact-info > p',
    '.info-card h4', '.info-card p',
    '.footer-brand p', '.footer-col h4', '.footer-col li a',
    '.footer-bottom p',
    '.contact-form h3', '.contact-form > p',
    'label', '.form-group input', '.form-group textarea',
  ].join(', ');

  const toggleBtn = document.getElementById('editor-toggle');
  const saveBtn = document.getElementById('editor-save');
  const cancelBtn = document.getElementById('editor-cancel');

  // 开启/关闭编辑
  toggleBtn.addEventListener('click', function () {
    isEditing = !isEditing;
    if (isEditing) {
      enableEditing();
    } else {
      disableEditing();
    }
  });

  // 保存下载
  saveBtn.addEventListener('click', function () {
    downloadPage();
  });

  // 取消退出
  cancelBtn.addEventListener('click', function () {
    isEditing = false;
    disableEditing();
  });

  function enableEditing() {
    document.body.classList.add('edit-mode');
    toggleBtn.textContent = '✏️ 编辑中...';
    toggleBtn.classList.add('active');
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';

    document.querySelectorAll(editableSelectors).forEach(el => {
      // 排除在 toolbar / banner 内的元素
      if (!el.closest('#editor-toolbar') && !el.closest('#editor-banner')) {
        el.setAttribute('contenteditable', 'true');
      }
    });
  }

  function disableEditing() {
    document.body.classList.remove('edit-mode');
    toggleBtn.textContent = '✏️ 编辑文字';
    toggleBtn.classList.remove('active');
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';

    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
    });
  }

  function downloadPage() {
    // 先临时关闭编辑属性和移除编辑器元素
    const editableEls = document.querySelectorAll('[contenteditable="true"]');
    editableEls.forEach(el => el.removeAttribute('contenteditable'));
    document.body.classList.remove('edit-mode');

    // 隐藏编辑器相关元素
    toolbar.style.display = 'none';
    banner.style.display = 'none';

    // 获取完整 HTML
    const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

    // 恢复编辑器
    toolbar.style.display = 'flex';
    banner.style.display = '';
    document.body.classList.add('edit-mode');
    editableEls.forEach(el => el.setAttribute('contenteditable', 'true'));

    // 清理掉 HTML 中的编辑器相关代码
    const cleanHTML = html
      .replace(/<div id="editor-toolbar">[\s\S]*?<\/div>/g, '')
      .replace(/<div id="editor-banner">[\s\S]*?<\/div>/g, '')
      .replace(/<style>[\s\S]*?#editor-toolbar[\s\S]*?<\/style>/g, '')
      .replace(/\s*contenteditable="true"/g, '')
      .replace(/\s*class="edit-mode"/g, '');

    // 触发下载
    const blob = new Blob([cleanHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // 根据当前页面生成文件名
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 提示
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✓ 已下载！';
    setTimeout(() => {
      saveBtn.textContent = originalText;
    }, 2000);
  }
}


// ============ 页面初始化 ============

document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  animateNumbers();
  handleNavScroll();
  // initEditor();
});
