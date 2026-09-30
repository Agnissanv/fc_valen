/* FC VALEN — interactions (sans dépendance) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var store = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- intro (une fois par session) + transition entre pages ---------- */
  var intro = $('.intro');
  if (intro) {
    if (store.get('fcv_intro') || reduce) intro.classList.add('done');
    else { store.set('fcv_intro', '1'); setTimeout(function () { intro.classList.add('done'); }, 1500); }
  }
  var wipe = $('.wipe');
  if (wipe && !reduce) {
    if (store.get('fcv_wipe')) { wipe.classList.add('full'); requestAnimationFrame(function () { requestAnimationFrame(function () { wipe.classList.remove('full'); wipe.classList.add('out'); setTimeout(function () { wipe.classList.remove('out'); }, 700); }); }); store.set('fcv_wipe', ''); }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
      var u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname || !/\.html$|\/$/.test(u.pathname)) return;
      e.preventDefault(); store.set('fcv_wipe', '1'); wipe.classList.add('in');
      setTimeout(function () { location.href = a.href; }, 520);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) { wipe.classList.remove('in'); } });
  }

  /* ---------- en-tête, progression, retour en haut ---------- */
  var header = $('header.site'), prog = $('#progress'), totop = $('.totop'), lastY = 0;
  var onScroll = function () {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (header) { header.classList.toggle('scrolled', y > 40); header.classList.toggle('hide', y > 500 && y > lastY + 6 && !$('.nav.open')); if (y < lastY - 6) header.classList.remove('hide'); }
    if (totop) totop.classList.toggle('show', y > 600);
    lastY = y;
    parallax(y);
  };
  var bg = $('.hero .bg'), giant = $('.giant'), arenaBg = $('.arena .bg');
  var mx = 0, my = 0;
  function parallax(y) {
    if (reduce) return;
    if (bg) bg.style.transform = 'translate3d(' + (mx * -14) + 'px,' + (y * 0.18 + my * -10) + 'px,0) scale(1.08)';
    if (giant) giant.style.transform = 'translate3d(' + (mx * 30) + 'px,' + (y * -0.12) + 'px,0)';
    if (arenaBg) { var r = arenaBg.parentElement.getBoundingClientRect(); arenaBg.style.transform = 'translate3d(0,' + ((r.top) * -0.12) + 'px,0)'; }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (fine && !reduce && $('.hero')) window.addEventListener('mousemove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; parallax(window.scrollY); });
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- menu mobile ---------- */
  var burger = $('.burger'), nav = $('#nav');
  if (burger && nav) {
    var setMenu = function (o) { nav.classList.toggle('open', o); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); document.body.style.overflow = o ? 'hidden' : ''; };
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- révélations, compteurs, tracés ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target; t.classList.add('in'); io.unobserve(t);
      if (t.hasAttribute('data-count')) counter(t);
      $$('[data-count]', t).forEach(counter);
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' }) : null;
  $$('.rv').forEach(function (el, i) { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', ((i % 4) * 0.08) + 's'); io ? io.observe(el) : el.classList.add('in'); });
  $$('.lines,.rank-wrap').forEach(function (el) { if (io) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { el.classList.add('on'); o.disconnect(); } }); }, { threshold: .2 }); o.observe(el); } else el.classList.add('on'); });
  function counter(el) {
    if (el.__done) return; el.__done = true;
    var raw = el.getAttribute('data-count'), m = raw.match(/^(\d+)(.*)$/); if (!m) return;
    var end = +m[1], suf = m[2] || '';
    if (reduce) { el.textContent = end + suf; return; }
    var t0 = performance.now(), dur = 1600;
    (function tick(t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * e) + (p < 1 ? '' : suf); if (p < 1) requestAnimationFrame(tick); })(t0);
  }

  /* Filet de sécurité : si l'observateur ne se déclenche pas (onglet masqué, vieux navigateur), on révèle au défilement. */
  var sweep = function () {
    $$('.lines:not(.on),.rank-wrap:not(.on)').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.8 && r.bottom > 0) el.classList.add('on'); });
    $$('.rv:not(.in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.92 && r.bottom > 0) { el.classList.add('in'); if (el.hasAttribute('data-count')) counter(el); $$('[data-count]', el).forEach(counter); }
    });
  };
  window.addEventListener('scroll', sweep, { passive: true }); window.addEventListener('resize', sweep); setTimeout(sweep, 400); setInterval(sweep, 1200);

  /* ---------- manifeste : mots qui s'allument au défilement ---------- */
  var mani = $('.manifesto');
  if (mani) {
    var words = $$('span', mani);
    var lit = function () {
      var r = mani.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .25)));
      var n = Math.round(words.length * p);
      words.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    };
    if (reduce) words.forEach(function (w) { w.classList.add('lit'); }); else { window.addEventListener('scroll', lit, { passive: true }); lit(); }
  }

  /* ---------- compte à rebours du prochain match ---------- */
  var cd = $('#countdown');
  if (cd) {
    // À MODIFIER : mettez ici la date réelle du prochain match (format AAAA-MM-JJTHH:MM).
    // Si la date est passée, le compteur vise automatiquement le prochain samedi à 19 h.
    var NEXT_MATCH = cd.getAttribute('data-date') || '2025-05-22T19:00';
    var target = new Date(NEXT_MATCH);
    if (isNaN(target) || target < new Date()) { target = new Date(); target.setHours(19, 0, 0, 0); var add = (6 - target.getDay() + 7) % 7; if (add === 0 && target < new Date()) add = 7; target.setDate(target.getDate() + add); }
    var parts = { j: $('[data-u=j]', cd), h: $('[data-u=h]', cd), m: $('[data-u=m]', cd), s: $('[data-u=s]', cd) };
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var up = function () {
      var d = Math.max(0, target - new Date()), s = Math.floor(d / 1000);
      parts.j.textContent = pad(Math.floor(s / 86400)); parts.h.textContent = pad(Math.floor(s % 86400 / 3600)); parts.m.textContent = pad(Math.floor(s % 3600 / 60)); parts.s.textContent = pad(s % 60);
    };
    up(); setInterval(up, 1000);
  }

  /* ---------- sélecteur de maillots ---------- */
  var kit = $('#kit');
  if (kit) {
    var img = $('img', kit), disc = $('.disc', kit), name = $('#kitname'), desc = $('#kitdesc'), btns = $$('.kitlist button');
    var setKit = function (b) {
      btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      img.classList.add('swap');
      setTimeout(function () { img.src = b.dataset.img; img.alt = 'Maillot ' + b.dataset.name.toLowerCase(); img.classList.remove('swap'); }, 220);
      kit.style.setProperty('--kc', b.dataset.color); name.textContent = b.dataset.name; desc.textContent = b.dataset.desc;
    };
    btns.forEach(function (b) { b.addEventListener('click', function () { setKit(b); }); });
    if (fine && !reduce) {
      kit.addEventListener('mousemove', function (e) { var r = kit.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; img.style.transform = 'rotateY(' + (x * 26) + 'deg) rotateX(' + (y * -20) + 'deg) translateZ(30px)'; });
      kit.addEventListener('mouseleave', function () { img.style.transform = ''; });
    }
  }

  /* ---------- effet d'inclinaison des cartes joueurs ---------- */
  function tilt(scope) {
    if (!fine || reduce) return;
    $$('.pl', scope).forEach(function (c) {
      c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'perspective(700px) rotateY(' + (x * 12) + 'deg) rotateX(' + (y * -12) + 'deg) translateY(-4px)'; });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }
  tilt(document);

  /* ---------- équipe : filtres, vue terrain ---------- */
  var grid = $('#squad');
  if (grid) {
    var chips = $$('.chips button'), groups = $$('.group', grid), cur = 'all';
    chips.forEach(function (b) { b.addEventListener('click', function () { cur = b.dataset.f; chips.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); groups.forEach(function (g) { g.hidden = !(cur === 'all' || g.dataset.g === cur); }); var n = groups.filter(function (g) { return !g.hidden; }).reduce(function (s, g) { return s + $$('.pl', g).length; }, 0); $('#sq-count').textContent = n + (n > 1 ? ' fiches' : ' fiche'); }); });
    var seg = $$('.seg button'), gridV = $('#gridview'), pitchV = $('#pitchview');
    seg.forEach(function (b) { b.addEventListener('click', function () { var p = b.dataset.v === 'pitch'; seg.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); gridV.hidden = p; pitchV.hidden = !p; $('#filters').hidden = p; }); });
    var S = window.SQUAD || [], pitch = $('#pitch'), sheet = $('#sheet');
    if (pitch) {
      S.forEach(function (p) {
        var d = document.createElement('button'); d.type = 'button'; d.className = 'dot'; d.style.left = p.x + '%'; d.style.top = p.y + '%'; d.textContent = p.n; d.setAttribute('aria-pressed', 'false'); d.setAttribute('aria-label', p.name + ', ' + p.poste + ', numéro ' + p.n);
        d.addEventListener('click', function () { $$('.dot', pitch).forEach(function (x) { x.setAttribute('aria-pressed', x === d ? 'true' : 'false'); }); sheet.innerHTML = (p.img ? '<img src="asset/web/' + p.img + '.webp" alt="Portrait de ' + p.name + '">' : '') + '<span class="bignum">' + p.n + '</span><h3>' + p.name + '</h3><span class="po">' + p.poste + '</span><p style="margin:10px 0 0;color:#A0A5B5">' + p.pays + '</p>'; });
        pitch.appendChild(d);
      });
    }
  }

  /* ---------- classement : barres qui se remplissent ---------- */
  $$('.ptbar i').forEach(function (i) { i.style.setProperty('--w', i.dataset.w); });

  /* ---------- galerie : lightbox ---------- */
  var gis = $$('.gi');
  if (gis.length) {
    var lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image agrandie');
    lb.innerHTML = '<button class="x" type="button" aria-label="Fermer">×</button><button class="pv" type="button" aria-label="Image précédente">‹</button><img alt=""><p></p><button class="nx" type="button" aria-label="Image suivante">›</button>';
    document.body.appendChild(lb);
    var li = $('img', lb), lp = $('p', lb), idx = 0, opener = null;
    var show = function (i) { idx = (i + gis.length) % gis.length; var g = gis[idx], im = $('img', g); li.src = g.dataset.full || im.src; li.alt = im.alt; lp.textContent = g.dataset.cap || ''; };
    var close = function () { lb.classList.remove('open'); document.body.style.overflow = ''; if (opener) opener.focus(); };
    gis.forEach(function (g, i) { g.addEventListener('click', function () { opener = g; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.x', lb).focus(); }); });
    $('.x', lb).addEventListener('click', close); $('.pv', lb).addEventListener('click', function () { show(idx - 1); }); $('.nx', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  }

  /* ---------- formulaires (ouverture du client e-mail) ---------- */
  function check(form) {
    var ok = true;
    $$('[required]', form).forEach(function (f) {
      var v = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.closest('.fld').classList.toggle('bad', !v); f.setAttribute('aria-invalid', v ? 'false' : 'true'); if (!v) ok = false;
    });
    var bad = $('[aria-invalid="true"]', form); if (bad) bad.focus();
    return ok;
  }
  var cf = $('#contact-form');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(cf)) return;
    var g = function (id) { return $('#' + id).value.trim(); };
    var body = 'Nom : ' + g('nom') + '\nE-mail : ' + g('email') + '\n\n' + g('message');
    $('#form-ok').hidden = false;
    location.href = 'mailto:contact@fcvalen.ci?subject=' + encodeURIComponent(g('sujet') || 'Message depuis le site du FC Valen') + '&body=' + encodeURIComponent(body);
  });
  var nf = $('#notify-form');
  if (nf) nf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(nf)) return;
    var mail = $('#n-email').value.trim();
    $('#notify-ok').hidden = false;
    location.href = 'mailto:billetterie@fcvalen.ci?subject=' + encodeURIComponent('Prévenez-moi : maillots FC Valen') + '&body=' + encodeURIComponent('Merci de me prévenir du retour en stock des maillots.\nMon e-mail : ' + mail);
  });

  /* ---------- sommaire des pages légales ---------- */
  var toc = $$('.toc a');
  if (toc.length && io) {
    var secs = toc.map(function (a) { return $(a.getAttribute('href')); });
    var spy = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) toc.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); }); }, { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(function (s) { if (s) spy.observe(s); });
  }
})();
