/*!
 * ترمه — تعاملات صفحه محصول (Vanilla JS — بدون وابستگی)
 * اسکوپ: فقط صفحه محصول · احترام کامل به prefers-reduced-motion
 * معماری: ماژول‌های کوچک init* — هر کدام یک‌بار اجرا می‌شوند
 * گام ۳: پولیش موبایل‌محور (لمس، ریپل، سوایپ گالری، CTA چسبنده موبایل،
 *        پولیش آگاه به سرعت اسکرول)
 */
(function () {
  'use strict';

  /* ===== تنظیمات و وضعیت مشترک ===== */
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = RM.matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktopMQ = window.matchMedia('(min-width: 1100px)');
  var mobileMQ = window.matchMedia('(max-width: 1099px)');

  /* فقط در صفحه محصول اجرا شود */
  var productPage = document.querySelector('.product');
  if (!productPage) {
    document.documentElement.classList.remove('js-loading');
    return;
  }

  var state = {
    ctaPast: false,        /* دکمه اصلی از بالای صفحه خارج شده است */
    mobileStickyOK: false, /* تشخیص ارتفاع تولبار پایین موبایل قابل اعتماد است */
    cta: null,
    sticky: null,
    toTop: null
  };

  /* ===== ابزارها ===== */
  function on(target, type, fn) {
    target.addEventListener(type, fn, { passive: true });
  }

  function faNum(n) {
    var m = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, function (d) { return m[d]; });
  }

  function tempClass(el, cls, ms) {
    if (!el) return;
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, ms);
  }

  /* ریپل سبک و قابل استفاده مجدد — از نقطه لمس/کلیک آغاز می‌شود */
  function spawnRipple(host, x, y, cls) {
    if (!host || reducedMotion) return;
    var r = host.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2;
    var s = document.createElement('span');
    s.className = cls;
    s.style.width = s.style.height = size + 'px';
    s.style.left = (x - r.left - size / 2) + 'px';
    s.style.top = (y - r.top - size / 2) + 'px';
    on(s, 'animationend', function () { s.remove(); });
    host.appendChild(s);
  }

  /* بازخورد میکرو — کمک‌تابع‌های قابل‌استفاده مجدد */
  var FX = {
    flash: function (el, cls, ms) { tempClass(el, cls || 'is-selected', ms || 320); },
    emphasize: function (el) { tempClass(el, 'is-selected', 300); },
    shake: function (el) { tempClass(el, 'is-unavailable', 350); }
  };

  /* ================================================================
     ۱. معرفی صفحه + اسکرول‌ریویل
     ================================================================ */
  function initRevealEffects() {
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
      '.installment',
      '.assurance',
      '.tabs-section',
      '.related'
    ];

    var revealEls = [];

    revealSelectors.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        el.classList.add('js-reveal');
        revealEls.push(el);
      });
    });

    /* کارت‌های محصولات مشابه — ریویل یک‌باره با استگر کوتاه */
    Array.prototype.forEach.call(document.querySelectorAll('.product-card'), function (el) {
      el.classList.add('js-reveal');
      revealEls.push(el);
    });

    if (reducedMotion) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      document.documentElement.classList.remove('js-loading');
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        /* استگر کوتاه و محدود — کاربر هرگز منتظر محتوا نمی‌ماند */
        entry.target.style.transitionDelay = (Math.min(i, 4) * 45) + 'ms';
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
        setTimeout(function () { entry.target.style.transitionDelay = ''; }, 700);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) { io.observe(el); });

    /* معرفی صفحه: تصویر → اطلاعات → کنترل‌های خرید (بدون CLS) */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('js-loading');
      });
    });
  }

  /* ================================================================
     ۲. پالایش گالری — تصاویر کوچک، شمارنده، سوایپ لمسی
     ================================================================ */
  function cloneArt(src, thumb) {
    var art = src.cloneNode(true);
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', thumb.getAttribute('aria-label') || '');
    art.removeAttribute('aria-hidden');
    return art;
  }

  function initGalleryEffects() {
    var galleryFrame = document.querySelector('.gallery__frame');
    var thumbs = document.querySelectorAll('.thumb');
    if (!galleryFrame || !thumbs.length) return;

    var currentArt = galleryFrame.querySelector('.art');
    var activeIndex = 0;
    var i;

    for (i = 0; i < thumbs.length; i++) {
      if (thumbs[i].classList.contains('thumb--active')) activeIndex = i;
    }

    /* شمارنده تصویر — افزوده‌ای سبک، بدون تغییر مارک‌آپ */
    var counter = document.createElement('span');
    counter.className = 'gallery__count';
    counter.setAttribute('aria-hidden', 'true');
    galleryFrame.appendChild(counter);

    function paintCounter() {
      counter.textContent = faNum(activeIndex + 1) + ' / ' + faNum(thumbs.length);
    }
    paintCounter();

    function showThumb(index) {
      var thumb = thumbs[index];
      if (!thumb || index === activeIndex) return;

      Array.prototype.forEach.call(thumbs, function (t) {
        t.classList.remove('thumb--active');
        t.setAttribute('aria-current', 'false');
      });
      thumb.classList.add('thumb--active');
      thumb.setAttribute('aria-current', 'true');
      activeIndex = index;
      paintCounter();

      if (!reducedMotion) tempClass(thumb, 'is-activating', 300);

      var thumbArt = thumb.querySelector('.art');
      if (!thumbArt || !currentArt) return;

      if (reducedMotion) {
        currentArt.replaceWith(cloneArt(thumbArt, thumb));
        currentArt = galleryFrame.querySelector('.art');
        return;
      }

      /* تصویر قبلی محو → تصویر جدید با نشستن نرم مقیاس */
      currentArt.classList.add('is-fading');
      setTimeout(function () {
        var newArt = cloneArt(thumbArt, thumb);
        newArt.classList.add('is-fading', 'is-settling');
        currentArt.replaceWith(newArt);
        currentArt = newArt;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            newArt.classList.remove('is-fading', 'is-settling');
          });
        });
      }, 280);
    }

    for (i = 0; i < thumbs.length; i++) {
      (function (thumb, index) {
        thumb.addEventListener('click', function () { showThumb(index); });
      })(thumbs[i], i);
    }

    /* سوایپ افقی لمسی — اسکرول عمودی هرگز قفل نمی‌شود (touch-action: pan-y) */
    var SWIPE_MIN = 44; /* آستانه افقی؛ پایین‌تر از آن نادیده گرفته می‌شود */
    var swipe = null;

    on(galleryFrame, 'pointerdown', function (e) {
      if (e.pointerType === 'mouse') { swipe = null; return; }
      swipe = { id: e.pointerId, x: e.clientX, y: e.clientY };
    });

    on(galleryFrame, 'pointerup', function (e) {
      if (!swipe || e.pointerId !== swipe.id) return;
      var dx = e.clientX - swipe.x;
      var dy = e.clientY - swipe.y;
      swipe = null;
      /* ژست افقی باید بر ژست عمودی غلبه کند، وگرنه اسکرول صفحه است */
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      /* RTL: کشیدن به سمت چپ → تصویر بعدی */
      var next = (activeIndex + (dx < 0 ? 1 : -1) + thumbs.length) % thumbs.length;
      showThumb(next);
    });

    on(galleryFrame, 'pointercancel', function () { swipe = null; });

    /* افکت اشاره‌گر پیشرفته گالری (فقط دسکتاپ با اشاره‌گر دقیق) */
    if (canHover && !reducedMotion) {
      var gmx = 0, gmy = 0, gRaf = null, gRect = null;

      on(galleryFrame, 'pointerenter', function () {
        gRect = galleryFrame.getBoundingClientRect();
      });

      on(galleryFrame, 'pointermove', function (e) {
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
          art.style.transformOrigin = (50 + x * 22) + '% ' + (50 + y * 22) + '%';
          art.style.transform = 'scale(1.045)';
        });
      });

      var galleryReset = function () {
        if (gRaf) { cancelAnimationFrame(gRaf); gRaf = null; }
        gRect = null;
        var art = galleryFrame.querySelector('.art');
        if (art) { art.style.transform = ''; art.style.transformOrigin = ''; }
      };
      on(galleryFrame, 'pointerleave', galleryReset);
      on(window, 'blur', galleryReset);
    }
  }

  /* ================================================================
     ۳. بازخورد تنوع کالا (منطق WooCommerce دست‌نخورده)
     ================================================================ */
  function initVariationEffects() {
    Array.prototype.forEach.call(document.querySelectorAll('.chips__input, .swatches__input'), function (input) {
      on(input, 'change', function () {
        if (input.disabled) return;
        var label = document.querySelector('label[for="' + input.id + '"]');
        var field = input.closest('.field');
        FX.emphasize(label);
        if (field && !reducedMotion) tempClass(field, 'is-highlight', 500);
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.chips__input:disabled, .swatches__input:disabled'), function (input) {
      var label = document.querySelector('label[for="' + input.id + '"]');
      if (!label) return;
      on(label, 'click', function () { FX.shake(label); });
    });

    var resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
      on(resetBtn, 'click', function () {
        if (reducedMotion) return;
        var form = resetBtn.closest('.buy-form');
        if (!form) return;
        Array.prototype.forEach.call(form.querySelectorAll('.chips__label, .swatches__label'), function (label, i) {
          setTimeout(function () { tempClass(label, 'is-resetting', 300); }, i * 30);
        });
      });
    }
  }

  /* ================================================================
     ۴. میکروتعامل تعداد (min/max/step دست‌نخورده)
     ================================================================ */
  function initQuantityEffects() {
    var stepper = document.querySelector('.stepper');
    var value = document.querySelector('.stepper__value');
    var btns = document.querySelectorAll('.stepper__btn');
    if (!stepper || !value || !btns.length) return;

    var qty = 1;
    var QTY_MIN = 1;
    var QTY_MAX = 99;
    var bumpTimer = null;

    Array.prototype.forEach.call(btns, function (btn) {
      on(btn, 'click', function () {
        var isMinus = btn.getAttribute('aria-label') === 'کاهش تعداد';
        if (isMinus) {
          if (qty > QTY_MIN) qty--;
        } else if (qty < QTY_MAX) {
          qty++;
        }

        value.textContent = faNum(qty);

        if (reducedMotion) return;
        /* لغزش کوتاه هم‌جهت + بازگشت سریع (تپ‌های پشت‌سرهم پایدار) */
        value.classList.remove('is-up', 'is-down', 'is-changing');
        void value.offsetWidth;
        value.classList.add('is-changing', isMinus ? 'is-down' : 'is-up');
        if (bumpTimer) clearTimeout(bumpTimer);
        bumpTimer = setTimeout(function () {
          value.classList.remove('is-changing', 'is-up', 'is-down');
          bumpTimer = null;
        }, 260);
      });
    });
  }

  /* ================================================================
     ۵. تب‌های محصول (منطق CSS دست‌نخورده + بهبود دسترسی/اسکرول)
     ================================================================ */
  function initTabsEffects() {
    var radios = document.querySelectorAll('.tabs__radio');
    var labels = document.querySelectorAll('.tabs__tab');
    var panels = document.querySelectorAll('.tabs__panel');
    var nav = document.querySelector('.tabs__nav');
    if (!radios.length || !labels.length) return;

    function panelFor(radioId) {
      return document.querySelector('.tabs__panel--' + radioId.replace('tab-', ''));
    }

    /* اتصال aria بدون تغییر مارک‌آپ */
    Array.prototype.forEach.call(labels, function (label) {
      var forId = label.getAttribute('for');
      var radio = document.getElementById(forId);
      var panel = panelFor(forId);
      var active = !!(radio && radio.checked);

      label.setAttribute('role', 'tab');
      if (!label.id) label.id = 'tablabel-' + forId.replace('tab-', '');
      label.setAttribute('aria-selected', active ? 'true' : 'false');
      label.setAttribute('tabindex', active ? '0' : '-1');

      if (panel) {
        if (!panel.id) panel.id = 'panel-' + forId.replace('tab-', '');
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', label.id);
        label.setAttribute('aria-controls', panel.id);
      }
    });

    Array.prototype.forEach.call(panels, function (panel) {
      if (!panel.getAttribute('role')) panel.setAttribute('role', 'tabpanel');
    });

    /* تب فعال را فقط زمانی به مرکز می‌بریم که سرریز افقی واقعی وجود دارد */
    function bringIntoView(label) {
      if (!nav || !label) return;
      if (nav.scrollWidth <= nav.clientWidth + 2) return;
      try {
        label.scrollIntoView({
          block: 'nearest',
          inline: 'center',
          behavior: reducedMotion ? 'auto' : 'smooth'
        });
      } catch (err) {
        /* مرورگرهای قدیمی — بی‌خیال اسکرول خودکار */
      }
    }

    Array.prototype.forEach.call(radios, function (radio) {
      on(radio, 'change', function () {
        if (!radio.checked) return;

        var panel = panelFor(radio.id);
        if (panel && !reducedMotion) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }

        var activeLabel = null;
        Array.prototype.forEach.call(labels, function (label) {
          var active = label.getAttribute('for') === radio.id;
          label.setAttribute('aria-selected', active ? 'true' : 'false');
          label.setAttribute('tabindex', active ? '0' : '-1');
          if (active) activeLabel = label;
        });

        bringIntoView(activeLabel);
      });
    });

    if (nav) {
      on(nav, 'keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        var list = Array.prototype.slice.call(labels);
        var current = list.indexOf(document.activeElement);
        if (current === -1) return;
        var next = e.key === 'ArrowLeft' ? current + 1 : current - 1;
        next = (next + list.length) % list.length;
        list[next].focus();
        list[next].click();
        e.preventDefault();
      });
    }
  }

  /* ================================================================
     ۶. CTA — حالت‌ها (idle/loading/success) + مگنتیک دسکتاپ
     بازخورد بصری است و هیچ رفتار واقعی سبد را شبیه‌سازی نمی‌کند.
     ================================================================ */
  var CHECK_SVG = '<svg class="cta-check" viewBox="0 0 24 24" aria-hidden="true">' +
                  '<path d="M5 12.5l4.2 4.2L19 7"/></svg>';

  function enhanceCta(btn) {
    if (!btn || btn.classList.contains('js-cta')) return btn;
    btn.classList.add('js-cta');

    /* برچسب در یک span می‌پیچد تا حالت‌ها بتوانند فقط آن را محو کنند
       (عرض و ارتفاع دکمه دقیقاً حفظ می‌شود) */
    var icon = btn.querySelector('.btn__icon');
    var label = document.createElement('span');
    label.className = 'btn__label';
    Array.prototype.slice.call(btn.childNodes).forEach(function (nd) {
      if (icon && nd === icon) return;
      label.appendChild(nd);
    });
    btn.appendChild(label);

    var stateEl = document.createElement('span');
    stateEl.className = 'btn__state';
    stateEl.setAttribute('aria-hidden', 'true');
    stateEl.innerHTML =
      '<span class="btn__state--load"><span class="cta-spinner"></span></span>' +
      '<span class="btn__state--ok">' + CHECK_SVG + '</span>';
    btn.appendChild(stateEl);

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

    btn.addEventListener('click', function () {
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
      if (timer) { clearTimeout(timer); timer = null; }

      if (reducedMotion) {
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

    /* فشردن لمسی/ماوس — بدون تأخیر، با همان متغیر CTA */
    if (!reducedMotion) {
      var press = function (v) { return function () { btn.style.setProperty('--cta-s', v); }; };
      on(btn, 'pointerdown', press('.975'));
      on(btn, 'pointerup', press('1'));
      on(btn, 'pointercancel', press('1'));
      on(btn, 'pointerleave', press('1'));
    }

    /* مگنتیک — فقط دسکتاپ با اشاره‌گر دقیق؛ روی لمسی هرگز فعال نمی‌شود */
    if (canHover && !reducedMotion) {
      var mRaf = null, mrect = null, mx = 0, my = 0, active = false;

      btn.addEventListener('pointerenter', function () {
        active = true;
        mrect = btn.getBoundingClientRect();
      });

      on(btn, 'pointermove', function (e) {
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
      });

      var magReset = function () {
        active = false;
        mrect = null;
        if (mRaf) { cancelAnimationFrame(mRaf); mRaf = null; }
        btn.style.setProperty('--cta-tx', '0px');
        btn.style.setProperty('--cta-ty', '0px');
        btn.style.setProperty('--cta-s', '1');
      };
      on(btn, 'pointerleave', magReset);
      on(window, 'blur', magReset);
    }

    return btn;
  }

  function initCartEffects() {
    var mainCta = document.querySelector('.buy-form .btn--primary');
    if (!mainCta) return;
    enhanceCta(mainCta);
    state.cta = mainCta;

    var priceEl = document.querySelector('.price__current');
    if (!priceEl) return;

    /* نوار خرید چسبنده (همان چرخه بازخورد CTA اصلی) */
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

    btn.addEventListener('click', function () { mainCta.click(); });
    state.sticky = bar;

    /* نمایش نوار چسبنده از موقعیت واقعی دکمه اصلی تعیین می‌شود و
       در همان حلقه اسکرول (rAF) به‌روز می‌شود؛ بنابراین پرش‌های تند
       و «بازگشت به بالا» هم حالت درست را نشان می‌دهند. */

    if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', updateSticky);
    if (mobileMQ.addEventListener) mobileMQ.addEventListener('change', updateSticky);
  }

  /* ================================================================
     ۷. اسپات‌لایت اشاره‌گر (دسکتاپ) — یک لیسنر واگذارشده + rAF
     ================================================================ */
  function initPointerSpotlight() {
    var SPOT_SEL = '.summary, .buy-form, .installment, .product-card';
    Array.prototype.forEach.call(document.querySelectorAll(SPOT_SEL), function (el) {
      el.classList.add('js-spotlight');
    });

    if (!canHover || reducedMotion) return;

    var spotEl = null;
    var smx = 0, smy = 0, sRaf = null;

    function clearSpot() {
      if (spotEl) spotEl.classList.remove('is-spot');
      spotEl = null;
      if (sRaf) { cancelAnimationFrame(sRaf); sRaf = null; }
    }

    on(document, 'pointermove', function (e) {
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
    });

    on(window, 'blur', clearSpot);
    on(document, 'pointerleave', clearSpot);
  }

  /* ================================================================
     ۸. سیستم بازخورد لمسی — فشردن سبک + ریپل + درخشش لمسی
     یک واگذاری رویداد در سطح سند؛ هیچ لیسنری به ازای هر عنصر
     ================================================================ */
  var TAP_SEL = '.chips__label, .swatches__label, .stepper__btn, .thumb, .tabs__tab,' +
                ' .product-card, .reset-btn, .btn--ghost, .wish-btn, .icon-btn';
  var RIPPLE_SEL = '.chips__label, .swatches__label, .stepper__btn, .btn--primary';
  var TOUCH_GLOW_SEL = '.summary, .buy-form, .installment';

  function initTouchFeedback() {
    if (reducedMotion) return;

    var pressed = null;
    var safety = null;
    var glowEl = null;
    var glowTimer = null;

    function releasePress() {
      if (pressed) { pressed.classList.remove('is-tap'); pressed = null; }
      if (safety) { clearTimeout(safety); safety = null; }
    }

    on(document, 'pointerdown', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      /* ریپل از نقطه لمس (کنترل‌های انتخابی) */
      var host = t.closest(RIPPLE_SEL);
      if (host && host.tagName === 'LABEL') {
        var ctl = host.getAttribute('for') ? document.getElementById(host.getAttribute('for')) : null;
        if (ctl && ctl.disabled) host = null; /* تنوع ناموجود ریپل نمی‌گیرد */
      }
      if (host) {
        spawnRipple(host, e.clientX, e.clientY,
          host.classList.contains('js-cta') ? 'cta-ripple' : 'tap-ripple');
      }

      /* درخشش لمسی: جایگزین موبایلی اسپات‌لایت دسکتاپ (فقط لمسی) */
      if (!canHover) {
        var area = t.closest(TOUCH_GLOW_SEL);
        if (area) {
          var r = area.getBoundingClientRect();
          area.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          area.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
          if (glowEl && glowEl !== area) glowEl.classList.remove('is-spot');
          glowEl = area;
          area.classList.add('is-spot');
          if (glowTimer) clearTimeout(glowTimer);
          glowTimer = setTimeout(function () {
            if (glowEl) glowEl.classList.remove('is-spot');
            glowEl = null;
            glowTimer = null;
          }, 460);
        }
      }

      /* فشردن سبک ۰.۹۷۵ — بازگشت نرم با easing فنری در CSS */
      var el = t.closest(TAP_SEL);
      if (!el) return;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      releasePress();
      pressed = el;
      el.classList.add('is-tap');
      safety = setTimeout(releasePress, 700);
    });

    on(document, 'pointerup', releasePress);
    on(document, 'pointercancel', releasePress);
    on(window, 'blur', releasePress);
  }

  /* ================================================================
     ۹. بازگشت به بالا (RTL-safe، سازگار با safe-area)
     ================================================================ */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'بازگشت به بالا');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V6M6.5 11.5 12 6l5.5 5.5"/></svg>';

    on(btn, 'click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    document.body.appendChild(btn);
    state.toTop = btn;
  }

  /* ================================================================
     ۱۰. پولیش آگاه به سرعت اسکرول + نمایان شدن «بازگشت به بالا»
     یک لیسنر passive + استخوان‌بندی rAF؛ بدون محاسبه سنگین هر فریم
     ================================================================ */
  function initScrollPolish() {
    var root = document.documentElement;
    var lastY = window.pageYOffset || 0;
    var lastT = Date.now();
    var ticking = false;
    var idleTimer = null;

    function frame() {
      ticking = false;
      var now = Date.now();
      var y = window.pageYOffset || 0;
      var dt = Math.max(now - lastT, 16);
      var v = Math.abs(y - lastY) / dt * 1000; /* پیکسل بر ثانیه */
      lastY = y;
      lastT = now;

      /* خواندن هندسی پیش از نوشتن کلاس‌ها — یک اندازه‌گیری در هر فریم */
      if (state.cta) {
        var ctaRect = state.cta.getBoundingClientRect();
        var ctaPast = ctaRect.bottom < 0;
        if (ctaPast !== state.ctaPast) {
          state.ctaPast = ctaPast;
          updateSticky();
        }
      }

      if (state.toTop) {
        state.toTop.classList.toggle('is-visible', y > window.innerHeight * 0.9);
      }

      if (reducedMotion) return;

      /* اسکرول سریع → تزئینات کم شود؛ توقف → بازگشت ظرافت‌ها */
      if (v > 1200) root.classList.add('is-fast-scroll');
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        idleTimer = null;
        root.classList.remove('is-fast-scroll');
      }, 160);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    on(window, 'scroll', onScroll);
    on(window, 'resize', onScroll);
    onScroll();
  }

  /* ================================================================
     ۱۱. نوار خرید چسبنده — ارتفاع تولبار پایین پوسته را می‌سنجد
     اگر تشخیص قابل اعتماد نباشد، روی موبایل فعال نمی‌شود (امنیت مهم‌تر)
     ================================================================ */
  function updateSticky() {
    if (!state.sticky) return;
    var show = state.ctaPast && (desktopMQ.matches || (mobileMQ.matches && state.mobileStickyOK));
    state.sticky.classList.toggle('is-visible', show);
  }

  function initMobileSticky() {
    var root = document.documentElement;
    var TOOLBAR_SEL = [
      '.woodmart-sticky-nav', '.wd-sticky-nav', '.woodmart-mobile-nav', '.woodmart-toolbar',
      '.wd-mobile-nav', '.wd-bottom-nav', '.wd-toolbar', '.mobile-nav-bar', '.mobile-bottom-bar',
      '.mobile-toolbar', '.bottom-bar', '[class*="mobile-bottom"]', '[class*="bottom-bar"]',
      '[class*="mobile-toolbar"]'
    ].join(',');

    function candidates() {
      var list = Array.prototype.slice.call(document.querySelectorAll(TOOLBAR_SEL));
      var body = document.body;
      for (var i = 0; i < body.children.length; i++) {
        var child = body.children[i];
        if (list.indexOf(child) === -1) list.push(child);
        for (var j = 0; j < child.children.length; j++) {
          if (list.indexOf(child.children[j]) === -1) list.push(child.children[j]);
        }
      }
      return list;
    }

    function detect() {
      if (!mobileMQ.matches) {
        state.mobileStickyOK = true;
        root.style.setProperty('--mobile-toolbar-height', '0px');
        updateSticky();
        return;
      }

      var vh = window.innerHeight;
      var nodes = candidates();
      var height = 0;
      var reliable = true;

      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (!el || el.nodeType !== 1 || !el.tagName) continue;
        var tag = el.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'TEMPLATE') continue;
        if (el.classList && (el.classList.contains('sticky-buy') || el.classList.contains('to-top'))) continue;

        var cs = window.getComputedStyle(el);
        if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;

        var r = el.getBoundingClientRect();
        if (r.height < 8 || r.width < 40) continue;
        if (r.top < vh * 0.55) continue;   /* فقط عناصر چسبیده به لبه پایین */
        if (r.bottom < vh - 40) continue;  /* باید تا پایین صفحه امتداد داشته باشند */

        if (r.height > vh * 0.4) {         /* پوشش تقریباً تمام‌صفحه → تولبار نیست */
          reliable = false;
          break;
        }
        height = Math.max(height, vh - r.top);
      }

      state.mobileStickyOK = reliable;
      root.style.setProperty('--mobile-toolbar-height', Math.round(height) + 'px');
      updateSticky();
    }

    var timer = null;
    function redetect() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { timer = null; detect(); }, 200);
    }

    on(window, 'resize', redetect);
    on(window, 'orientationchange', redetect);
    detect();
  }

  /* ================================================================
     ۱۲. حرکت کاهش‌یافته در زمان اجرا
     ================================================================ */
  function initMotionRuntime() {
    function onChange(e) {
      reducedMotion = e.matches;
      if (!reducedMotion) return;
      document.documentElement.classList.remove('is-fast-scroll');
      Array.prototype.forEach.call(document.querySelectorAll('.js-reveal'), function (el) {
        el.classList.add('is-visible');
        el.style.transitionDelay = '';
      });
      Array.prototype.forEach.call(document.querySelectorAll('.js-spotlight.is-spot'), function (el) {
        el.classList.remove('is-spot');
      });
    }
    if (RM.addEventListener) RM.addEventListener('change', onChange);
    else if (RM.addListener) RM.addListener(onChange);
  }

  /* ===== اجرا ===== */
  initRevealEffects();
  initGalleryEffects();
  initVariationEffects();
  initQuantityEffects();
  initCartEffects();
  initTabsEffects();
  initPointerSpotlight();
  initTouchFeedback();
  initBackToTop();
  initMobileSticky();
  initScrollPolish();
  initMotionRuntime();
})();
