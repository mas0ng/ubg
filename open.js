// js/open.js
document.addEventListener('DOMContentLoaded', () => {
  const container     = document.getElementById('game-container');
  const loaderOverlay = document.getElementById('loader-overlay');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  // Bail if gate replaced the body (denied page)
  if (!container || !loaderOverlay) return;

  // Named handler so we can unregister it
  async function onClickLoad() {
    // Prevent re-entry
    loaderOverlay.removeEventListener('click', onClickLoad);
    loaderOverlay.textContent     = '⏳ Loading…';
    loaderOverlay.style.cursor    = 'default';

    // 1) Parse activity parameter
    const enc = new URLSearchParams(location.search).get('activity');
    if (!enc) {
      loaderOverlay.textContent = '❌ No game specified.';
      return;
    }
    let name;
    try { name = atob(decodeURIComponent(enc)); }
    catch {
      loaderOverlay.textContent = '❌ Invalid game identifier.';
      return;
    }

    // 2) Fetch game list
    let list;
    try {
      list = await fetch('https://services.depoxt.xyz/urls/ubg.json').then(r=>r.json());
    } catch {
      loaderOverlay.textContent = '⚠️ Could not load game list.';
      return;
    }
    const game = list.find(g => g.name === name);
    if (!game) {
      loaderOverlay.textContent = `❌ Game “${name}” not found.`;
      return;
    }

    // 3) Create & append iframe
    const iframe = document.createElement('iframe');
    iframe.src   = game.game_url;
    iframe.style = 'width:100%; height:100%; border:none;';
    container.appendChild(iframe);

    // 4) Once loaded, hide overlay & enable fullscreen
    iframe.onload = () => {
      loaderOverlay.style.display  = 'none';
      fullscreenBtn.disabled       = false;
      fullscreenBtn.onclick        = () => {
        const encParam = encodeURIComponent(btoa(name));
        location.href  = `fullscreen.html?activity=${encParam}`;
      };
    };
  }

  loaderOverlay.addEventListener('click', onClickLoad);
});
