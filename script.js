/*!
 * ترمه — تعاملات صفحه محصول (Vanilla JS)
 * اسکوپ: فقط صفحه محصول فعلی
 * احترام به prefers-reduced-motion
 * گام ۲: پولیش پیشرفته (اسپات‌لایت، مگنتیک CTA، حالت‌ها، چسبنده، بازگشت به بالا)
 */
(function () {
  'use strict';

  /* ===== تنظیمات ===== */
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = RM.matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktopMQ = window.matchMedia('(min-width: 1100px)');

  /* فقط در صفحه محصول اجرا شود */
  var productPage = document.querySelector('.product');
  if (!productPage) {
    document.documentElement.classList.remove('js-loading');
    return;
  }

  /* ===== ابزارها ===== */
  function faNum(n) {
    var m = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, function (d) { return m[d]; });
  }

  function tempClass(el, cls, ms) {
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, ms);
  }

  /* سیستم بازخورد میکرو — کمک‌تابع‌های قابل‌استفاده مجدد (بدون تکرار کد انیمیشن) */
  var FX = {
    press: function (el, ms) { if (el && !reducedMotion) tempClass(el, 'is-pressed', ms || 180); },
    flash: function (el, cls, ms) { if (el && !reducedMotion) tempClass(el, cls || 'is-selected', ms || 320); },
    shake: function (el) { if (el && !reducedMotion) tempClass(el, 'is-unavailable', 350); },
    emphasize: function (el) { if (el && !reducedMotion) tempClass(el, 'is-selected', 300); }
  };

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
        thumbs.forEach(function (t) {
          t.classList.remove('thumb--active');
          t.setAttribute('aria-current', 'false');
        });
        thumb.classList.add('thumb--active');
        thumb.setAttribute('aria-current', 'true');

        if (!reducedMotion) {
          tempClass(thumb, 'is-activating', 300);
        }

        var thumbArt = thumb.querySelector('.art');
        if (!thumbArt || !currentArt) return;

        if (reducedMotion) {
          currentArt.replaceWith(cloneArt(thumbArt, thumb));
          currentArt = galleryFrame.querySelector('.art');
          return;
        }

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

    /* ۴. افکت اشاره‌گر پیشرفته گالری — تمرکز ملایم با transform-origin (فقط دسکتاپ) */
    if (canHover && !reducedMotion) {
      var gmx = 0, gmy = 0, gRaf = null, gRect = null;

      galleryFrame.addEventListener('pointerenter', function () {
        gRect = galleryFrame.getBoundingClientRect();
      }, { passive: true });

      galleryFrame.addEventListener('pointermove', function (e) {
        gmx = e.clientX;
        gmy = e.clientY;
        if (gRaf) return;
        gRaf = requestAnimationFrame(function () {
          gRaf = null;
          var art = galleryFrame.querySelector('.art');
          if (!art) return;
          if (!gRect) gRect = galleryFrame.getBoundingClientRect();
          var x = (gmx - gRect.left) / gRect.width - 0.5;
          var y = (gmy - gRect.top) / gRect.height - 0.5;
          /* حرکت ملایم نقطه تمرکز + زوم بسیار کم */
          art.style.transformOrigin = (50 + x * 22) + '% ' + (50 + y * 22) + '%';
          art.style.transform = 'scale(1.045)';
        });
      }, { passive: true });

      var galleryReset = function () {
        if (gRaf) { cancelAnimationFrame(gRaf); gRaf = null; }
        gRect = null;
        var art = galleryFrame.querySelector('.art');
        if (art) { art.style.transform = ''; art.style.transformOrigin = ''; }
      };
      galleryFrame.addEventListener('pointerleave', galleryReset, { passive: true });
      window.addEventListener('blur', galleryReset);
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
     ۵. بازخورد تنوع کالا
     ================================================================ */
  document.querySelectorAll('.chips__input, .swatches__input').forEach(function (input) {
    input.addEventListener('change', function () {
      if (input.disabled) return;
      var label = document.querySelector('label[for="' + input.id + '"]');
      var field = input.closest('.field');
      FX.emphasize(label);
      if (field && !reducedMotion) tempClass(field, 'is-highlight', 500);
    });
  });

  document.querySelectorAll('.chips__input:disabled, .swatches__input:disabled').forEach(function (input) {
    var label = document.querySelector('label[for="' + input.id + '"]');
    if (label) {
      label.addEventListener('click', function () { FX.shake(label); });
    }
  });

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
     ۶. میکروتعامل تعداد
     ================================================================ */
  var stepper = document.querySelector('.stepper');
  var stepperValue = document.querySelector('.stepper__value');
  var stepperBtns = document.querySelectorAll('.stepper__btn');

  if (stepper && stepperValue && stepperBtns.length) {
    var qty = 1;
    var QTY_MIN = 1;
    var QTY_MAX = 99;

    stepperBtns.forEach(function (btn) {
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
     ۷. تب‌های محصول
     ================================================================ */
  var tabRadios = document.querySelectorAll('.tabs__radio');
  var tabLabels = document.querySelectorAll('.tabs__tab');
  var tabPanels = document.querySelectorAll('.tabs__panel');

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

      var panelId = radio.id.replace('tab-', '');
      var panel = document.querySelector('.tabs__panel--' + panelId);

      if (panel && !reducedMotion) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }

      tabLabels.forEach(function (label) {
        var active = label.getAttribute('for') === radio.id;
        label.setAttribute('aria-selected', active ? 'true' : 'false');
        label.setAttribute('tabindex', active ? '0' : '-1');
      });
    });
  });

  var tabNav = document.querySelector('.tabs__nav');
  if (tabNav) {
    tabNav.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var labels = Array.prototype.slice.call(tabLabels);
      var current = labels.indexOf(document.activeElement);
      if (current === -1) return;
      var next = e.key === 'ArrowLeft' ? current + 1 : current - 1;
      next = (next + labels.length) % labels.length;
      labels[next].focus();
      labels[next].click();
      e.preventDefault();
    });
  }

  /* ================================================================
     ۸. اسپات‌لایت اشاره‌گر (دسکتاپ) — یک لیسنر واگذارشده + rAF
     ================================================================ */
  var SPOT_SEL = '.summary, .buy-form, .installment, .product-card';
  document.querySelectorAll(SPOT_SEL).forEach(function (el) {
    el.classList.add('js-spotlight');
  });

  if (canHover && !reducedMotion) {
    var spotEl = null;
    var smx = 0, smy = 0, sRaf = null;

    var clearSpot = function () {
      if (spotEl) spotEl.classList.remove('is-spot');
      spotEl = null;
      if (sRaf) { cancelAnimationFrame(sRaf); sRaf = null; }
    };

    document.addEventListener('pointermove', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('.js-spotlight') : null;
      if (!el) { clearSpot(); return; }
      if (el !== spotEl) {
        if (spotEl) spotEl.classList.remove('is-spot');
        spotEl = el;
        el.classList.add('is-spot');
      }
      smx = e.clientX;
      smy = e.clientY;
      if (sRaf) return;
      sRaf = requestAnimationFrame(function () {
        sRaf = null;
        if (!spotEl) return;
        var r = spotEl.getBoundingClientRect();
        spotEl.style.setProperty('--mx', ((smx - r.left) / r.width * 100) + '%');
        spotEl.style.setProperty('--my', ((smy - r.top) / r.height * 100) + '%');
      });
    }, { passive: true });

    window.addEventListener('blur', clearSpot);
    document.addEventListener('pointerleave', clearSpot, { passive: true });
  }

  /* ================================================================
     ۹. CTA — مگنتیک + ریپل + حالت‌ها (idle/loading/success/disabled)
     بازخورد بصری است و هیچ رفتار واقعی سبد را شبیه‌سازی نمی‌کند.
     ================================================================ */
  var CHECK_SVG = '<svg class="cta-check" viewBox="0 0 24 24" aria-hidden="true">' +
                  '<path d="M5 12.5l4.2 4.2L19 7"/></svg>';

  function ripple(btn, x, y) {
    if (reducedMotion) return;
    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2;
    var s = document.createElement('span');
    s.className = 'cta-ripple';
    s.style.width = s.style.height = size + 'px';
    s.style.left = (x - r.left - size / 2) + 'px';
    s.style.top = (y - r.top - size / 2) + 'px';
    s.addEventListener('animationend', function () { s.remove(); });
    btn.appendChild(s);
  }

  function enhanceCta(btn) {
    if (!btn || btn.classList.contains('js-cta')) return null;
    btn.classList.add('js-cta');

    /* برچسب را در یک span می‌پیچیم تا حالت‌ها بتوانند آن را محو کنند (حفظ ارتفاع/عرض) */
    var icon = btn.querySelector('.btn__icon');
    var label = document.createElement('span');
    label.className = 'btn__label';
    Array.prototype.slice.call(btn.childNodes).forEach(function (nd) {
      if (nd === icon) return;
      label.appendChild(nd);
    });
    btn.appendChild(label);

    var state = document.createElement('span');
    state.className = 'btn__state';
    state.setAttribute('aria-hidden', 'true');
    state.innerHTML =
      '<span class="btn__state--load"><span class="cta-spinner"></span></span>' +
      '<span class="btn__state--ok">' + CHECK_SVG + '</span>';
    btn.appendChild(state);

    var timer = null;

    function setState(s) {
      btn.classList.remove('is-loading', 'is-success');
      if (s === 'loading') {
        btn.classList.add('is-loading');
        btn.setAttribute('aria-busy', 'true');
      } else if (s === 'success') {
        btn.classList.add('is-success');
        btn.removeAttribute('aria-busy');
      } else {
        btn.removeAttribute('aria-busy');
      }
    }

    btn.addEventListener('click', function (e) {
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
      ripple(btn, e.clientX, e.clientY);

      if (timer) { clearTimeout(timer); timer = null; }

      if (reducedMotion) {
        /* تغییر حالت فوری، بدون انیمیشن */
        setState('success');
        timer = setTimeout(function () { setState('idle'); timer = null; }, 900);
        return;
      }

      setState('loading');
      timer = setTimeout(function () {
        setState('success');
        timer = setTimeout(function () { setState('idle'); timer = null; }, 1400);
      }, 900);
    });

    /* مگنتیک — فقط دسکتاپ/هاور، بدون حرکت در حالت لمسی */
    if (canHover && !reducedMotion) {
      var mRaf = null, mrect = null, mx = 0, my = 0, active = false;

      btn.addEventListener('pointerenter', function () {
        active = true;
        mrect = btn.getBoundingClientRect();
      });

      btn.addEventListener('pointermove', function (e) {
        if (!active) return;
        mx = e.clientX;
        my = e.clientY;
        if (mRaf) return;
        mRaf = requestAnimationFrame(function () {
          mRaf = null;
          if (!mrect) mrect = btn.getBoundingClientRect();
          var dx = (mx - (mrect.left + mrect.width / 2)) / (mrect.width / 2);
          var dy = (my - (mrect.top + mrect.height / 2)) / (mrect.height / 2);
          dx = Math.max(-1, Math.min(1, dx));
          dy = Math.max(-1, Math.min(1, dy));
          btn.style.setProperty('--cta-tx', (dx * 4).toFixed(2) + 'px');
          btn.style.setProperty('--cta-ty', (dy * 3).toFixed(2) + 'px');
        });
      }, { passive: true });

      var magReset = function () {
        active = false;
        mrect = null;
        if (mRaf) { cancelAnimationFrame(mRaf); mRaf = null; }
        btn.style.setProperty('--cta-tx', '0px');
        btn.style.setProperty('--cta-ty', '0px');
        btn.style.setProperty('--cta-s', '1');
      };
      btn.addEventListener('pointerleave', magReset, { passive: true });
      window.addEventListener('blur', magReset);

      btn.addEventListener('pointerdown', function () {
        btn.style.setProperty('--cta-s', '.97');
      }, { passive: true });
      btn.addEventListener('pointerup', function () {
        btn.style.setProperty('--cta-s', '1');
      }, { passive: true });
      btn.addEventListener('pointercancel', function () {
        btn.style.setProperty('--cta-s', '1');
      }, { passive: true });
    }

    return btn;
  }

  var mainCta = enhanceCta(document.querySelector('.buy-form .btn--primary'));

  /* ================================================================
     ۱۰. نوار خرید چسبنده هوشمند (فقط دسکتاپ، بدون شبیه‌سازی سبد)
     ================================================================ */
  var stickyBuy = null;
  var ctaPast = false;

  function updateSticky() {
    if (!stickyBuy) return;
    var show = desktopMQ.matches && ctaPast;
    stickyBuy.classList.toggle('is-visible', show);
  }

  (function buildStickyBuy() {
    var priceEl = document.querySelector('.price__current');
    if (!priceEl || !mainCta) return;

    var bar = document.createElement('div');
    bar.className = 'sticky-buy';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'خرید سریع');

    var inner = document.createElement('div');
    inner.className = 'sticky-buy__inner';

    var price = document.createElement('p');
    price.className = 'sticky-buy__price';
    price.innerHTML = priceEl.innerHTML;

    var btn = document.createElement('button');
    btn.className = 'btn btn--primary sticky-buy__cta';
    btn.type = 'button';
    btn.textContent = 'افزودن به سبد خرید';

    inner.appendChild(price);
    inner.appendChild(btn);
    bar.appendChild(inner);
    document.body.appendChild(bar);
    enhanceCta(btn);

    /* دکمه نوار چسبنده همان چرخه بازخورد CTA اصلی را اجرا می‌کند */
    btn.addEventListener('click', function () { mainCta.click(); });

    stickyBuy = bar;

    /* نمایش فقط وقتی دکمه اصلی از بالای صفحه خارج شده باشد */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        var e = entries[0];
        ctaPast = !e.isIntersecting && e.boundingClientRect.top < 0;
        updateSticky();
      }, { threshold: 0 });
      io.observe(mainCta);
    }
  })();

  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', updateSticky);

  /* ================================================================
     ۱۱. بازگشت به بالا (RTL-safe، بدون تداخل با نوار پایین)
     ================================================================ */
  (function buildToTop() {
    var tabsSection = document.querySelector('.tabs-section');
    if (!tabsSection) return;

    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'بازگشت به بالا');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V6M6.5 11.5 12 6l5.5 5.5"/></svg>';

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    document.body.appendChild(btn);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        btn.classList.toggle('is-visible', entries[0].isIntersecting);
      }, { threshold: 0 });
      io.observe(tabsSection);
    }
  })();

  /* ================================================================
     ۱۲/۱۳. حرکت کاهش‌یافته در زمان اجرا
     ================================================================ */
  var onRmChange = function (e) {
    reducedMotion = e.matches;
    if (reducedMotion) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
        el.style.transitionDelay = '';
      });
      document.querySelectorAll('.js-spotlight.is-spot').forEach(function (el) {
        el.classList.remove('is-spot');
      });
    }
  };
  if (RM.addEventListener) RM.addEventListener('change', onRmChange);

})();
