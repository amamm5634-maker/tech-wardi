/* تِك وردي — يعمل على أي عنصر يحمل [data-tw-page]. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $ = function (r, s) { return r.querySelector(s); };
  var $$ = function (r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); };
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }

  function init(root) {
    root.classList.add('tw-js');
    var toast = $(root, '.tw-toast'), tt;
    function say(m) { toast.textContent = m; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('on'); }, 2400); }

    /* تنقّل سلس */
    $$(root, '[data-tw-go]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = $(root, a.getAttribute('data-tw-go'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
      });
    });

    /* القسم النشط + الظهور + شريط التقدم */
    var links = $$(root, '.tw-toc a');
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-tw-go') === '#' + e.target.id); });
        });
      }, { rootMargin: '-35% 0px -60% 0px' });
      $$(root, '.tw-s').forEach(function (s) { so.observe(s); });
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
      }, { threshold: .12 });
      $$(root, '.tw-rv').forEach(function (n) { ro.observe(n); });
    } else { $$(root, '.tw-rv').forEach(function (n) { n.classList.add('in'); }); }
    var bar = $(root, '.tw-bar span');
    function prog() {
      var r = root.getBoundingClientRect(), max = r.height - window.innerHeight;
      bar.style.width = Math.max(0, Math.min(1, max > 0 ? -r.top / max : 0)) * 100 + '%';
    }
    window.addEventListener('scroll', prog, { passive: true }); prog();

    /* تبويبات التكنولوجيا */
    var tabs = $$(root, '.tw-tab'), panels = $$(root, '.tw-panel');
    function pick(i, center) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      if (center) { /* يحرّك الشريط الأفقي ليُظهر التبويب المحدد دون تحريك الصفحة */
        var w = tabs[i].parentNode, cr = w.getBoundingClientRect(), tr = tabs[i].getBoundingClientRect();
        w.scrollBy({ left: (tr.left + tr.width / 2) - (cr.left + cr.width / 2), behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i, true); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
        if (d) { var n = (i + d + tabs.length) % tabs.length; pick(n, true); tabs[n].focus({ preventScroll: true }); }
      });
    });
    pick(0);

    /* قائمة مهام */
    var chks = $$(root, '.tw-chk'), meter = $(root, '.tw-meter span'), out = $(root, '.tw-out');
    function upd() {
      var n = chks.filter(function (c) { return c.checked; }).length;
      meter.style.width = n / chks.length * 100 + '%';
      out.textContent = n === chks.length ? 'أحسنتِ! أنتِ سفيرة للوعي 💗' : n + ' من ' + chks.length + ' خطوات';
    }
    chks.forEach(function (c) { c.addEventListener('change', upd); }); upd();

    /* مشاركة */
    $$(root, '[data-tw-share]').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = { title: document.title, text: 'بالتكنولوجيا ننشر الوعي، وبالمعرفة نصنع الأمل 💗', url: location.href };
        if (navigator.share) { navigator.share(d).catch(function () {}); }
        else if (navigator.clipboard) { navigator.clipboard.writeText(d.url).then(function () { say('تم نسخ الرابط'); }, function () { say('تعذّر النسخ'); }); }
      });
    });
  }
  function boot() { $$(document, '[data-tw-page]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
