(() => {
  const stops = window.TOXIC_TOUR_STOPS || [];
  const tourList = document.getElementById('tourList');
  const stopDialog = document.getElementById('stopDialog');
  const dialogContent = document.getElementById('dialogContent');
  const dialogClose = document.getElementById('dialogClose');
  const locateButton = document.getElementById('locateButton');
  const locationStatus = document.getElementById('locationStatus');
  const installButton = document.getElementById('installButton');
  const menuButton = document.getElementById('menuButton');
  const menuPanel = document.getElementById('menuPanel');
  const resetProgress = document.getElementById('resetProgress');
  const progressText = document.getElementById('progressText');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const stopCount = document.getElementById('stopCount');
  const STORAGE_KEY = 'toxic-niagara-visited-v1';

  let userLocation = null;
  let deferredInstallPrompt = null;
  let visited = new Set(readVisited());

  stopCount.textContent = String(stops.length);

  function readVisited() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function persistVisited() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
    updateProgress();
  }

  function updateProgress() {
    const count = visited.size;
    const percent = stops.length ? Math.round((count / stops.length) * 100) : 0;
    progressText.textContent = `${count} of ${stops.length} visited`;
    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function mapUrl(stop) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.mapQuery || stop.location)}`;
  }

  function hasCoordinates(stop) {
    return Number.isFinite(stop.lat) && Number.isFinite(stop.lng);
  }

  function distanceMiles(a, b) {
    const toRad = deg => deg * Math.PI / 180;
    const earthRadiusMiles = 3958.8;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * earthRadiusMiles * Math.asin(Math.sqrt(h));
  }

  function distanceLabel(stop) {
    if (!userLocation || !hasCoordinates(stop)) return '';
    const miles = distanceMiles(userLocation, { lat: stop.lat, lng: stop.lng });
    return miles < 0.2 ? 'You are near this stop' : `${miles.toFixed(miles < 10 ? 1 : 0)} mi from you`;
  }

  function renderStops() {
    tourList.innerHTML = stops.map(stop => {
      const isVisited = visited.has(stop.id);
      return `
        <article class="stop-card ${isVisited ? 'visited' : ''}" data-id="${escapeHtml(stop.id)}" data-corridor="${escapeHtml(stop.corridor)}">
          <div class="stop-number">${String(stop.number).padStart(2, '0')}</div>
          <div class="stop-main">
            <div class="stop-kicker">${escapeHtml(stop.kicker)}</div>
            <h3 class="stop-title">${escapeHtml(stop.title)}</h3>
            <p class="stop-summary">${escapeHtml(stop.summary)}</p>
          </div>
          <div class="stop-meta">
            <div class="stop-distance">${escapeHtml(distanceLabel(stop))}</div>
            <div class="stop-actions">
              <button class="details-button" type="button" data-action="details" data-id="${escapeHtml(stop.id)}">Read stop</button>
              <a href="${mapUrl(stop)}" target="_blank" rel="noopener" aria-label="Directions to ${escapeHtml(stop.title)}">Directions</a>
            </div>
            <button class="visit-toggle" type="button" data-action="visit" data-id="${escapeHtml(stop.id)}">${isVisited ? 'Mark as not visited' : 'Mark as visited'}</button>
          </div>
        </article>`;
    }).join('');
    updateProgress();
  }

  function openStop(stop) {
    const paragraphs = (stop.body || []).map(p => `<p>${escapeHtml(p)}</p>`).join('');
    dialogContent.innerHTML = `
      <article class="dialog-inner">
        <div class="dialog-number">Stop ${String(stop.number).padStart(2, '0')} · ${escapeHtml(stop.location)} · ${escapeHtml(stop.duration)}</div>
        <h3>${escapeHtml(stop.title)}</h3>
        <p class="dialog-kicker">${escapeHtml(stop.kicker)}</p>
        <p class="dialog-summary">${escapeHtml(stop.summary)}</p>
        <div class="dialog-body">${paragraphs}</div>
        <div class="dialog-callout">${escapeHtml(stop.callout)}</div>
        <div class="dialog-look"><strong>What to notice</strong>${escapeHtml(stop.lookFor)}</div>
        <a class="dialog-map" href="${mapUrl(stop)}" target="_blank" rel="noopener">Open driving directions ↗</a>
      </article>`;
    stopDialog.showModal();
  }

  tourList.addEventListener('click', event => {
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const stop = stops.find(item => item.id === control.dataset.id);
    if (!stop) return;

    if (control.dataset.action === 'details') openStop(stop);
    if (control.dataset.action === 'visit') {
      visited.has(stop.id) ? visited.delete(stop.id) : visited.add(stop.id);
      persistVisited();
      renderStops();
    }
  });

  dialogClose.addEventListener('click', () => stopDialog.close());
  stopDialog.addEventListener('click', event => {
    if (event.target === stopDialog) stopDialog.close();
  });

  locateButton.addEventListener('click', () => {
    if (!('geolocation' in navigator)) {
      locationStatus.textContent = 'Location is not supported by this browser.';
      return;
    }
    locationStatus.textContent = 'Checking your location…';
    navigator.geolocation.getCurrentPosition(position => {
      userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      locationStatus.textContent = 'Location is on. Distances are estimated on this device only.';
      renderStops();
      const nearest = stops
        .filter(hasCoordinates)
        .sort((a, b) => distanceMiles(userLocation, a) - distanceMiles(userLocation, b))[0];
      if (nearest) {
        document.querySelector(`[data-id="${CSS.escape(nearest.id)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, error => {
      locationStatus.textContent = error.code === 1 ? 'Location permission was not granted. The tour still works without it.' : 'Could not determine your location. The tour still works without it.';
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  });

  menuButton.addEventListener('click', () => {
    const isOpen = !menuPanel.hidden;
    menuPanel.hidden = isOpen;
    menuButton.setAttribute('aria-expanded', String(!isOpen));
  });

  menuPanel.addEventListener('click', event => {
    if (event.target.matches('a')) {
      menuPanel.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  resetProgress.addEventListener('click', () => {
    visited = new Set();
    persistVisited();
    renderStops();
    menuPanel.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  });

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    installButton.hidden = true;
    deferredInstallPrompt = null;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  renderStops();
})();
