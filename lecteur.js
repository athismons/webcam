(() => {
  'use strict';
  const endpoint = 'https://raw.githubusercontent.com/athismons/webcam/status/active.json';
  const refreshMs = 30000;
  const maxAgeMs = 1800000;

  function activeVideo(data, now = Date.now()) {
    if (!data || data.status !== 'live' || typeof data.video_id !== 'string' ||
        !/^[A-Za-z0-9_-]{11}$/.test(data.video_id)) return null;
    const stamp = Date.parse(data.updated_at);
    if (!Number.isFinite(stamp) || now - stamp > maxAgeMs || stamp - now > 300000) return null;
    return data.video_id;
  }

  const player = document.getElementById('player');
  const message = document.getElementById('message');
  const consent = document.getElementById('consent');
  const button = document.getElementById('show');
  let allowed = false;
  let video = null;
  let loaded = null;
  let latest = null;
  let busy = false;
  let timer;

  function render() {
    video = activeVideo(latest);
    if (!video) {
      player.replaceChildren();
      loaded = null;
      message.textContent = 'Le direct est momentanément indisponible.';
      message.hidden = false;
      consent.hidden = true;
      return;
    }
    consent.hidden = allowed;
    message.hidden = true;
    if (!allowed || loaded === video) return;
    const frame = document.createElement('iframe');
    frame.title = 'Webcam en direct — Ville d’Athis-Mons';
    // L’identifiant est validé ; aucune URL arbitraire n’est acceptée.
    frame.src = 'https://www.youtube-nocookie.com/embed/' + video + '?autoplay=1&mute=1&playsinline=1';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(frame);
    loaded = video;
  }

  async function refresh() {
    if (busy) return;
    busy = true;
    const controller = new AbortController();
    const abort = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(endpoint + '?t=' + Math.floor(Date.now() / refreshMs), {
        cache: 'no-store', credentials: 'omit', signal: controller.signal
      });
      if (!response.ok) throw new Error('unavailable');
      const candidate = await response.json();
      // Remplacer aussi par un état offline/private ; ne jamais réutiliser son ID.
      latest = candidate;
    } catch (_) {
      // Une panne brève du fichier d’état ne coupe pas un lecteur encore valide.
    } finally {
      clearTimeout(abort);
      busy = false;
      render();
    }
  }

  button.addEventListener('click', () => { allowed = true; render(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  window.addEventListener('online', refresh);
  timer = setInterval(refresh, refreshMs);
  // Accès limité pour les tests locaux, sans données privées.
  window.WebcamReader = { activeVideo };
  refresh();
})();
