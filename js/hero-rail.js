/* Lázaro Automotores · carrusel de fondo del hero
   Cambia de foto cada 2 segundos (disolvencia sobre la foto anterior, sin parpadeos ni fondo vacío).
   No avanza hasta que la siguiente foto esté descargada y decodificada. Se detiene con la pestaña oculta,
   con el hero fuera de pantalla o si el sistema pide reducir movimiento. */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var root = hero.querySelector('.hero-media');
  if (!root) {
    root = document.createElement('div');
    root.className = 'hero-media';
    root.setAttribute('aria-hidden', 'true');
    hero.insertBefore(root, hero.firstChild);
  }
  root.setAttribute('data-hero-carousel', '');
  var FOTOS = 6;
  if (!root.querySelector('[data-hero-slide]')) {
    for (var n = 1; n <= FOTOS; n++) {
      var f = document.createElement('figure');
      f.className = 'hero-slide hero-slide--0' + n + (n === 1 ? ' is-active' : '');
      f.setAttribute('data-hero-slide', '');
      var im = new Image();
      im.width = 1976; im.height = 1112; im.alt = ''; im.decoding = 'async';
      if (n === 1) im.setAttribute('fetchpriority', 'high'); else im.loading = 'lazy';
      im.src = 'images/hero/hero-0' + n + '.webp';
      f.appendChild(im);
      root.appendChild(f);
    }
  }
  var slides = [].slice.call(root.querySelectorAll('[data-hero-slide]'));
  if (slides.length < 2) return;
  var INTERVALO = 2000, FUNDIDO = 600;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0, timer = null, visible = true;

  function listo(s) {
    var m = s.querySelector('img');
    return !!(m && m.complete && m.naturalWidth > 0);
  }
  function go(k) {
    k = (k + slides.length) % slides.length;
    if (k === i) return;
    var prev = slides[i], next = slides[k];
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    setTimeout(function () { prev.classList.remove('is-leaving'); }, FUNDIDO);
    next.classList.remove('is-leaving');
    next.classList.add('is-active');
    slides.forEach(function (s) { s.setAttribute('aria-hidden', s === next ? 'false' : 'true'); });
    i = k;
  }
  function tick() {
    var next = slides[(i + 1) % slides.length];
    if (listo(next)) go(i + 1);   /* si todavía no bajó, espera al próximo ciclo */
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    if (reduce || timer || document.hidden || !visible) return;
    timer = setInterval(tick, INTERVALO);
  }

  /* descarga anticipada y decodificación de las fotos 2 a N, de a una, sin competir con la carga inicial */
  function precargar() {
    slides.slice(1).forEach(function (s, k) {
      setTimeout(function () {
        var m = s.querySelector('img'); if (!m) return;
        m.loading = 'eager';
        if (m.decode) m.decode().catch(function () {});
      }, 250 * k);
    });
  }

  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      visible ? start() : stop();
    }, { threshold: 0.05 }).observe(root.parentNode);
  }
  /* inclinación mínima del logo grande siguiendo el puntero (solo mouse, sin reducir movimiento) */
  var logo = hero.querySelector('.hx-badge img');
  if (logo && !reduce && window.matchMedia && window.matchMedia('(hover: hover) and (min-width: 901px)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      logo.style.setProperty('--lz-ry', (x * 10).toFixed(2) + 'deg');
      logo.style.setProperty('--lz-rx', (-y * 10).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', function () {
      logo.style.setProperty('--lz-ry', '0deg'); logo.style.setProperty('--lz-rx', '0deg');
    });
  }
  if (document.readyState === 'complete') precargar(); else window.addEventListener('load', precargar);
  start();
})();
