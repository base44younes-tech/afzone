/*!
 * ترمه — تعاملات صفحه محصول (Vanilla JS)
 * اسکوپ: فقط صفحه محصول فعلی
 * احترام به prefers-reduced-motion
 */
(function () {
  'use strict';

  /* ===== تنظیمات ===== */
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = RM.matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* فقط در صفحه محصول اجرا شود */
  var productPage = document.querySelector('.product');
  if (!productPage) {
    document.documentElement.classList.remove('js-loading');
    return;
  }

  /* ابزار: تبدیل عدد به فارسی */
  function faNum(n) {
    var m = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, function (d) { return m[d]; });
  }

  /* ابزار: پاک‌سازی کلاس بعد از مدت */
  function tempClass(el, cls, ms) {
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, ms);
  }

  /* ================================================================
     ۱. معرفی صفحه + ۲. سیستم اسکرول ریویل
     ================================================================ */
  var revealSelectors = [
    '.gallery',
    '.summary',
    '.summary__eyebrow',
    '.summary__title',
    '.meta',
    '.summary__lead',
    '.highlights',
    '.price',
    '.stock',
    '.buy-form',
    '.tabs-section',
    '.related'
  ];

  var revealEls = [];

  revealSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add('js-reveal');
      revealEls.push(el);
    });
  });

  /* کارت‌های محصولات مشابه */
  document.querySelectorAll('.product-card').forEach(function (el) {
    el.classList.add('js-reveal');
    revealEls.push(el);
  });

  if (reducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    document.documentElement.classList.remove('js-loading');
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i * 50) + 'ms';
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
          /* پاک‌سازی delay بعد از اتمام */
          setTimeout(function () {
            entry.target.style.transitionDelay = '';
          }, 700);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) { io.observe(el); });

    /* معرفی صفحه — حذف کلاس loading با rAF برای جلوگیری از فلش */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('js-loading');
      });
    });
  }

  /* ================================================================
     ۳. پالایش گالری محصول
     ================================================================ */
  var galleryFrame = document.querySelector('.gallery__frame');
  var thumbs = document.querySelectorAll('.thumb');

  if (galleryFrame && thumbs.length) {
    var currentArt = galleryFrame.querySelector('.art');

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        /* به‌روزرسانی حالت فعال */
        thumbs.forEach(function (t) {
          t.classList.remove('thumb--active');
          t.setAttribute('aria-current', 'false');
        });
        thumb.classList.add('thumb--active');
        thumb.setAttribute('aria-current', 'true');

        /* انیمیشن تصویر کوچک فعال */
        if (!reducedMotion) {
          tempClass(thumb, 'is-activating', 300);
        }

        /* تعویض تصویر اصلی */
        var thumbArt = thumb.querySelector('.art');
        if (!thumbArt || !currentArt) return;

        if (reducedMotion) {
          currentArt.replaceWith(cloneArt(thumbArt, thumb));
          currentArt = galleryFrame.querySelector('.art');
          return;
        }

        /* محو → تعویض → ظاهر شدن */
        currentArt.classList.add('is-fading');
        setTimeout(function () {
          var newArt = cloneArt(thumbArt, thumb);
          newArt.classList.add('is-fading');
          currentArt.replaceWith(newArt);
          currentArt = newArt;
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              currentArt.classList.remove('is-fading');
            });
          });
        }, 300);
      });
    });

    /* زوم دسکتاپ با دنبالک ماوس — بسیار ملایم */
    if (canHover && !reducedMotion) {
      var mx = 0, my = 0, rafZoom = null;

      galleryFrame.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        if (rafZoom) return;
        rafZoom = requestAnimationFrame(function () {
          rafZoom = null;
          var art = galleryFrame.querySelector('.art');
          if (!art) return;
          var r = galleryFrame.getBoundingClientRect();
          var x = (mx - r.left) / r.width - 0.5;
          var y = (my - r.top) / r.height - 0.5;
          art.style.transform = 'scale(1.06) translate(' + (x * -10) + 'px, ' + (y * -10) + 'px)';
        });
      }, { passive: true });

      galleryFrame.addEventListener('mouseleave', function () {
        if (rafZoom) { cancelAnimationFrame(rafZoom); rafZoom = null; }
        var art = galleryFrame.querySelector('.art');
        if (art) art.style.transform = '';
      }, { passive: true });
    }
  }

  function cloneArt(src, thumb) {
    var art = src.cloneNode(true);
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', thumb.getAttribute('aria-label') || '');
    art.removeAttribute('aria-hidden');
    return art;
  }

  /* ================================================================
     ۴. بازخورد تنوع کالا
     ================================================================ */
  /* اندازه و رنگ — تغییر انتخاب */
  document.querySelectorAll('.chips__input, .swatches__input').forEach(function (input) {
    input.addEventListener('change', function () {
      if (input.disabled) return;
      var label = document.querySelector('label[for="' + input.id + '"]');
      var field = input.closest('.field');
      if (!reducedMotion) {
        if (label) tempClass(label, 'is-selected', 300);
        if (field) tempClass(field, 'is-highlight', 500);
      }
    });
  });

  /* گزینه ناموجود — کلیک روی گزینه غیرفعال */
  document.querySelectorAll('.chips__input:disabled, .swatches__input:disabled').forEach(function (input) {
    var label = document.querySelector('label[for="' + input.id + '"]');
    if (label) {
      label.addEventListener('click', function () {
        if (reducedMotion) return;
        tempClass(label, 'is-unavailable', 350);
      });
    }
  });

  /* بازنشانی انتخاب‌ها */
  var resetBtn = document.querySelector('.reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (reducedMotion) return;
      var form = resetBtn.closest('.buy-form');
      if (!form) return;
      form.querySelectorAll('.chips__label, .swatches__label').forEach(function (label, i) {
        setTimeout(function () {
          tempClass(label, 'is-resetting', 300);
        }, i * 30);
      });
    });
  }

  /* ================================================================
     ۵. میکروتعامل تعداد
     ================================================================ */
  var stepper = document.querySelector('.stepper');
  var stepperValue = document.querySelector('.stepper__value');
  var stepperBtns = document.querySelectorAll('.stepper__btn');

  if (stepper && stepperValue && stepperBtns.length) {
    var qty = 1;
    var QTY_MIN = 1;
    var QTY_MAX = 99;

    stepperBtns.forEach(function (btn) {
      /* فشردن لمسی */
      if (!reducedMotion) {
        btn.addEventListener('pointerdown', function () {
          btn.classList.add('is-pressed');
        }, { passive: true });
        var release = function () { btn.classList.remove('is-pressed'); };
        btn.addEventListener('pointerup', release, { passive: true });
        btn.addEventListener('pointerleave', release, { passive: true });
        btn.addEventListener('pointercancel', release, { passive: true });
      }

      btn.addEventListener('click', function () {
        var isMinus = btn.getAttribute('aria-label') === 'کاهش تعداد';
        if (isMinus) {
          if (qty > QTY_MIN) qty--;
        } else {
          if (qty < QTY_MAX) qty++;
        }

        stepperValue.textContent = faNum(qty);

        if (!reducedMotion) {
          tempClass(stepperValue, 'is-changing', 250);
        }
      });
    });
  }

  /* ================================================================
     ۶. تب‌های محصول
     ================================================================ */
  var tabRadios = document.querySelectorAll('.tabs__radio');
  var tabLabels = document.querySelectorAll('.tabs__tab');
  var tabPanels = document.querySelectorAll('.tabs__panel');

  /* همگام‌سازی aria — بدون تغییر HTML */
  tabLabels.forEach(function (label) {
    label.setAttribute('role', 'tab');
    var forId = label.getAttribute('for');
    var radio = document.getElementById(forId);
    var active = radio && radio.checked;
    label.setAttribute('aria-selected', active ? 'true' : 'false');
    label.setAttribute('tabindex', active ? '0' : '-1');
    label.setAttribute('aria-controls', forId.replace('tab-', 'panel-'));
  });

  tabPanels.forEach(function (panel) {
    panel.setAttribute('role', 'tabpanel');
  });

  tabRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;

      /* انتقال محتوای پنل */
      var panelId = radio.id.replace('tab-', '');
      var panel = document.querySelector('.tabs__panel--' + panelId);

      if (panel && !reducedMotion) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth; /* force reflow برای ری‌استارت انیمیشن */
        panel.classList.add('is-entering');
      }

      /* همگام‌سازی aria */
      tabLabels.forEach(function (label) {
        var active = label.getAttribute('for') === radio.id;
        label.setAttribute('aria-selected', active ? 'true' : 'false');
        label.setAttribute('tabindex', active ? '0' : '-1');
      });
    });
  });

  /* پشتیبانی از کیبورد بین تب‌ها */
  var tabNav = document.querySelector('.tabs__nav');
  if (tabNav) {
    tabNav.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var labels = Array.prototype.slice.call(tabLabels);
      var current = labels.indexOf(document.activeElement);
      if (current === -1) return;
      /* RTL: ArrowLeft = بعدی، ArrowRight = قبلی */
      var next = e.key === 'ArrowLeft' ? current + 1 : current - 1;
      next = (next + labels.length) % labels.length;
      labels[next].focus();
      labels[next].click();
      e.preventDefault();
    });
  }

  /* ================================================================
     ۷. کارت‌های محصولات مشابه
     ورود از طریق سیستم اسکرول ریویل (بالا) انجام شده است.
     زوم تصویر و بالارفتن کارت از طریق CSS موجود فعال است.
     ================================================================ */

  /* ================================================================
     پشتیبانی از تغییر prefers-reduced-motion در زمان اجرا
     ================================================================ */
  RM.addEventListener('change', function (e) {
    if (e.matches) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
        el.style.transitionDelay = '';
      });
    }
  });

})();
