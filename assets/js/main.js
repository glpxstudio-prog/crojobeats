/* ==========================================================================
   Cannis Rojo Production — site behaviour
   Vanilla JS, no dependencies. Safe to load with a plain <script> tag.
   ========================================================================== */
(function () {
  'use strict';

  /* ── Footer year ──────────────────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Mobile nav ───────────────────────────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ── Beat filtering ───────────────────────────────────────────────────── */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var beats = Array.prototype.slice.call(document.querySelectorAll('.beat'));

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;

      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', String(active));
      });

      beats.forEach(function (beat) {
        beat.hidden = !(filter === 'all' || beat.dataset.genre === filter);
      });
    });
  });

  /* ── Audio player ─────────────────────────────────────────────────────── */
  var audio   = document.getElementById('audio');
  var player  = document.getElementById('player');
  var pToggle = document.getElementById('playerToggle');
  var pTitle  = document.getElementById('playerTitle');
  var pSeek   = document.getElementById('playerSeek');
  var pTime   = document.getElementById('playerTime');
  var pClose  = document.getElementById('playerClose');

  var current = null;          // the <article class="beat"> now loaded
  var seeking = false;

  var ICON_PLAY  = '<path d="M8 5v14l11-7z"/>';
  var ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function setToggleIcon(playing) {
    if (pToggle) pToggle.querySelector('svg').innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    if (current) current.querySelector('.beat__play svg').innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
  }

  function openPlayer(beat) {
    current = beat;
    beats.forEach(function (b) {
      b.classList.toggle('is-playing', b === beat);
      if (b !== beat) b.querySelector('.beat__play svg').innerHTML = ICON_PLAY;
    });

    player.hidden = false;
    document.body.classList.add('player-open');
    pTitle.textContent = beat.dataset.title || 'Untitled';

    audio.src = beat.dataset.src;
    audio.play().catch(function () {
      // No file yet (or autoplay blocked). Say so instead of failing silently.
      pTitle.textContent = (beat.dataset.title || 'Track') + ' — preview not uploaded yet';
      setToggleIcon(false);
    });
  }

  function closePlayer() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    player.hidden = true;
    document.body.classList.remove('player-open');
    beats.forEach(function (b) {
      b.classList.remove('is-playing');
      b.querySelector('.beat__play svg').innerHTML = ICON_PLAY;
    });
    current = null;
  }

  beats.forEach(function (beat) {
    var btn = beat.querySelector('.beat__play');
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (current === beat) {
        if (audio.paused) { audio.play().catch(function () {}); } else { audio.pause(); }
      } else {
        openPlayer(beat);
      }
    });
  });

  if (audio) {
    audio.addEventListener('play',  function () { setToggleIcon(true); });
    audio.addEventListener('pause', function () { setToggleIcon(false); });
    audio.addEventListener('ended', function () { setToggleIcon(false); pSeek.value = 0; });

    audio.addEventListener('timeupdate', function () {
      if (seeking || !audio.duration) return;
      pSeek.value = String((audio.currentTime / audio.duration) * 100);
      pTime.textContent = fmt(audio.currentTime);
    });
  }

  if (pToggle) {
    pToggle.addEventListener('click', function () {
      if (audio.paused) { audio.play().catch(function () {}); } else { audio.pause(); }
    });
  }

  if (pSeek) {
    pSeek.addEventListener('input',  function () { seeking = true; });
    pSeek.addEventListener('change', function () {
      if (audio.duration) audio.currentTime = (Number(pSeek.value) / 100) * audio.duration;
      seeking = false;
    });
  }

  if (pClose) pClose.addEventListener('click', closePlayer);

  /* ── Contact form (Formspree-compatible, degrades gracefully) ─────────── */
  var form   = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      // Until a real form ID is configured, fall back to a mailto so no lead is lost.
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        var data = new FormData(form);
        var body =
          'Name: '  + (data.get('name')  || '') + '\n' +
          'Email: ' + (data.get('email') || '') + '\n' +
          'Phone: ' + (data.get('phone') || '') + '\n\n' +
          (data.get('message') || '');
        window.location.href =
          'mailto:hello@crojobeats.com?subject=' +
          encodeURIComponent('New inquiry from crojobeats.com') +
          '&body=' + encodeURIComponent(body);
        status.textContent = 'Opening your email app…';
        status.className = 'form__status is-ok';
        return;
      }

      e.preventDefault();
      status.textContent = 'Sending…';
      status.className = 'form__status';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('bad response');
          form.reset();
          status.textContent = 'Thanks — we’ll get back to you shortly.';
          status.className = 'form__status is-ok';
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Email hello@crojobeats.com instead.';
          status.className = 'form__status is-err';
        });
    });
  }
})();
