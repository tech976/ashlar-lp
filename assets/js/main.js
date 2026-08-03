/* ═══════════════════════════════════════════════════════════
   Ashlar Tattva — Titwala West
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── CONFIG — point at the CRM before go-live ───────────── */
  var CONFIG = {
    // Empty = no network call. Forms still validate, log and redirect,
    // so the whole flow demos before the CRM is connected.
    FORM_ENDPOINT: '',
    THANK_YOU_URL: 'thank-you.html',

    // Auto enquiry popup. Set POPUP_DELAY to 0 to switch it off.
    POPUP_DELAY: 3000,
    // false = show on every page load (matches the reference site)
    // true  = show only once per browser session
    // Either way it never reappears once the visitor has sent an enquiry.
    POPUP_ONCE_PER_SESSION: false
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // set once a lead is submitted; stops the auto popup for the rest of the session
  var SENT_KEY = 'ashlar-tattva-lead-sent';

  /* ── header + back to top ───────────────────────────────── */
  var head = $('#head');
  var toTop = $('#toTop');

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    head.classList.toggle('stuck', y > 10);
    toTop.classList.toggle('on', y > 600);
  }, { passive: true });

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });

  /* ── mobile menu ────────────────────────────────────────── */
  var burger = $('#burger');
  var nav = $('#nav');

  function shut() {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
  burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', shut); });

  /* ── reveal on scroll ───────────────────────────────────── */
  var ups = $$('.sec-head, .ov-media, .ov-copy, .hl-card li, .hl-pic, .amenity-grid li, .loc-card, .plan, .shot, .acc-item, .sec-cta');
  ups.forEach(function (el) { el.classList.add('up'); });

  if ('IntersectionObserver' in window && !calm) {
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (row, i) {
        if (!row.isIntersecting) return;
        var el = row.target;
        setTimeout(function () { el.classList.add('in'); }, Math.min(i * 55, 280));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    ups.forEach(function (el) { io.observe(el); });
  } else {
    ups.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── FAQ accordion ──────────────────────────────────────── */
  (function accordion() {
    var qs = $$('.acc-q');
    if (!qs.length) return;

    qs.forEach(function (q) {
      var item = q.closest('.acc-item');
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        // one panel at a time — keeps the section scannable
        $$('.acc-item.open').forEach(function (other) {
          other.classList.remove('open');
          $('.acc-q', other).setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // open the first question so the section never reads as empty
    qs[0].click();
  })();

  /* ── gallery lightbox ───────────────────────────────────── */
  (function lightbox() {
    var shots = $$('.shot');
    var box = $('#lightbox');
    if (!shots.length || !box) return;

    var img = $('#lbImg'), cap = $('#lbCap');
    var items = shots.map(function (s) {
      return { src: $('img', s).getAttribute('src'), text: $('span', s).textContent.trim() };
    });
    var at = 0, opener = null;

    function show(i) {
      at = (i + items.length) % items.length;
      img.src = items[at].src;
      img.alt = items[at].text;
      cap.textContent = items[at].text + ' — ' + (at + 1) + ' of ' + items.length;
    }

    function open(i, from) {
      opener = from || null;
      show(i);
      box.hidden = false;
      document.body.classList.add('locked');
      $('.lb-x', box).focus();
    }

    function close() {
      box.hidden = true;
      document.body.classList.remove('locked');
      if (opener) opener.focus();
    }

    shots.forEach(function (s) {
      s.addEventListener('click', function () { open(Number(s.dataset.i), s); });
    });

    $('#lbNext').addEventListener('click', function () { show(at + 1); });
    $('#lbPrev').addEventListener('click', function () { show(at - 1); });
    $$('[data-lb-close]', box).forEach(function (b) { b.addEventListener('click', close); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(at + 1);
      if (e.key === 'ArrowLeft') show(at - 1);
    });

    var x0 = 0;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(dx < 0 ? at + 1 : at - 1);
    });
  })();

  /* ── modal: serves both the floor-plan unlock and the auto popup ── */
  var modal = $('#modal');
  var lastFocus = null, pendingPlan = null, popupShown = false;

  // opts: {kicker, title, sub, intent, submit, card, focus}
  function openModal(opts) {
    if (!modal.hidden) return;                       // never stack modals
    lastFocus = document.activeElement;
    pendingPlan = opts.card || null;

    $('#modalKicker').textContent = opts.kicker;
    $('#modalTitle').textContent  = opts.title;
    $('#modalSub').textContent    = opts.sub;
    $('#modalIntent').value       = opts.intent;
    $('#modalSubmit').textContent = opts.submit;

    modal.hidden = false;
    document.body.classList.add('locked');

    // A user-opened dialog lands on the first real field. The auto popup lands
    // on Close instead — it interrupted the visitor, so give them the exit first.
    // Skip the honeypot: it is type=text (not hidden) and sits off-screen.
    var firstField = $$('input:not([type=hidden])', modal).filter(function (el) {
      return el.tabIndex !== -1;
    })[0];
    var target = opts.focus === 'close' ? $('.modal-x', modal) : firstField;
    if (target) setTimeout(function () { target.focus(); }, 60);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $$('.js-unlock').forEach(function (b) {
    b.addEventListener('click', function () {
      openModal({
        kicker: 'Unlock Floor Plan',
        title:  'Get the ' + b.dataset.plan + ' Plan',
        sub:    'Enter your details and the floor plan opens right away.',
        intent: 'Floor plan — ' + b.dataset.plan,
        submit: 'Unlock Now',
        card:   b.closest('.plan')
      });
    });
  });
  $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });

  /* ── auto enquiry popup ─────────────────────────────────── */
  (function autoPopup() {
    if (!CONFIG.POPUP_DELAY) return;

    var KEY = 'ashlar-tattva-popup-seen';

    function seen() {
      try {
        // never pester someone who has already sent us their details
        if (sessionStorage.getItem(SENT_KEY) === '1') return true;
        return CONFIG.POPUP_ONCE_PER_SESSION && sessionStorage.getItem(KEY) === '1';
      } catch (e) { return false; }      // private mode — just show it
    }
    function remember() {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    }

    if (seen()) return;

    var timer = setTimeout(function () {
      // don't interrupt someone already mid-task
      if (!modal.hidden) return;
      if (!$('#lightbox').hidden) return;
      if (document.activeElement && /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;

      popupShown = true;
      remember();
      openModal({
        kicker: 'Get In Touch',
        title:  'Enquire About Ashlar Tattva',
        sub:    'Share your details and our sales team will call you back with pricing, availability and the current construction status.',
        intent: 'Auto popup',
        submit: 'Send Enquiry',
        focus:  'close'
      });
    }, CONFIG.POPUP_DELAY);

    // if they open the plan modal first, drop the popup entirely
    $$('.js-unlock').forEach(function (b) {
      b.addEventListener('click', function () { clearTimeout(timer); remember(); });
    });
  })();

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') return closeModal();
    if (e.key !== 'Tab') return;
    var f = $$('button, [href], input, select', modal).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });

  /* ── tag which CTA produced the lead ────────────────────── */
  $$('[data-intent]').forEach(function (el) {
    el.addEventListener('click', function () { $('#leadIntent').value = el.dataset.intent; });
  });

  /* ── forms ──────────────────────────────────────────────── */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function mark(input, msg) {
    var slot = $('[data-e="' + input.id + '"]');
    if (slot) slot.textContent = msg || '';
    input.classList.toggle('bad', !!msg);
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  function check(form) {
    var ok = true, firstBad = null;

    $$('input[required]', form).forEach(function (input) {
      var v = input.value.trim(), msg = '';

      if (!v) {
        msg = 'This field is required.';
      } else if (input.type === 'email' && !EMAIL.test(v)) {
        msg = 'Enter a valid email address.';
      } else if (input.type === 'tel' && !/^(0|91)?[6-9]\d{9}$/.test(v.replace(/\D/g, ''))) {
        msg = 'Enter a valid 10-digit mobile number.';
      } else if (input.name === 'name' && v.length < 2) {
        msg = 'Please enter your full name.';
      }

      mark(input, msg);
      if (msg) { ok = false; if (!firstBad) firstBad = input; }
    });

    if (firstBad) firstBad.focus();
    return ok;
  }

  function post(data) {
    if (!CONFIG.FORM_ENDPOINT) {
      console.info('[Ashlar Tattva] lead captured, no endpoint set:', data);
      return Promise.resolve();
    }
    return fetch(CONFIG.FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    });
  }

  function wire(form, status, done) {
    if (!form) return;

    $$('input', form).forEach(function (input) {
      input.addEventListener('input', function () { if (input.classList.contains('bad')) mark(input, ''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) { status.textContent = ''; status.className = 'status'; }
      if (form.company && form.company.value) return;   // honeypot

      if (!check(form)) {
        if (status) { status.textContent = 'Please correct the highlighted fields.'; status.className = 'status fail'; }
        return;
      }

      var btn = $('button[type=submit]', form);
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Submitting…';

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      delete data.company;
      data.page = location.href;
      data.submitted_at = new Date().toISOString();

      post(data).then(function () {
        try { sessionStorage.setItem(SENT_KEY, '1'); } catch (e) {}
        if (status) { status.textContent = 'Thank you — redirecting…'; status.className = 'status good'; }
        if (typeof done === 'function') done(data);
        location.href = CONFIG.THANK_YOU_URL +
          '?intent=' + encodeURIComponent(data.intent || '') +
          '&name='   + encodeURIComponent((data.name || '').split(' ')[0]);
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = label;
        if (status) { status.textContent = 'Something went wrong. Please call 911 911 7582.'; status.className = 'status fail'; }
      });
    });
  }

  wire($('#leadForm'), $('#formStatus'));
  wire($('#modalForm'), $('#modalStatus'), function () {
    if (pendingPlan) pendingPlan.classList.add('open');
  });

  /* ── misc ───────────────────────────────────────────────── */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - (head.offsetHeight + 8);
      window.scrollTo({ top: top, behavior: calm ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });
})();
