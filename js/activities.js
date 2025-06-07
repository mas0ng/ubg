// js/activities.js
// ─────────────────────────────────────────────────────────────────────────────────
//  Populates the “Activities” page with a searchable grid of games from ubg.json.
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('activities-container');
  const searchBar = document.getElementById('search-container');

  // 1. Create search input
  const input = document.createElement('input');
  input.placeholder = 'Search games…';
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('.game-tile').forEach(tile => {
      const nm = tile.querySelector('.game-name').textContent.toLowerCase();
      tile.style.display = nm.includes(q) ? 'flex' : 'none';
    });
  });
  searchBar.appendChild(input);

  // 2. Fetch list of games
  fetch('https://services.depoxt.xyz/urls/ubg.json')
    .then(res => res.json())
    .then(arr => {
      arr.forEach(({ name, icon_url, game_url }) => {
        const tile = document.createElement('div');
        tile.className = 'game-tile';
        tile.innerHTML = `
          <img src="${icon_url}" alt="${name}" />
          <p class="game-name">${name}</p>
        `;
        tile.onclick = () => {
          const enc = encodeURIComponent(btoa(name));
          window.location.href = `open.html?activity=${enc}`;
        };
        container.appendChild(tile);
      });
    })
    .catch(err => {
      console.error('Failed to fetch ubg.json:', err);
      const msg = document.createElement('p');
      msg.textContent = '⚠️ Could not load activities.';
      msg.style.textAlign = 'center';
      msg.style.color = 'var(--text-secondary)';
      container.appendChild(msg);
    });
});
