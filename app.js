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
  const routeProgressText = document.getElementById('routeProgressText');
  const routeProgressPercent = document.getElementById('routeProgressPercent');
  const routeProgressBar = document.getElementById('routeProgressBar');
  const processLine = document.querySelector('.process-line');
  const routeItems = [...document.querySelectorAll('.process-line > li[data-route-id]')];
  const stopCount = document.getElementById('stopCount');
  const STORAGE_KEY = 'toxic-niagara-visited-v1';
  const ROUTE_STORAGE_KEY = 'toxic-niagara-uranium-visited-v1';

  let userLocation = null;
  let deferredInstallPrompt = null;
  let visited = new Set(readVisited(STORAGE_KEY));
  let routeVisited = new Set(readVisited(ROUTE_STORAGE_KEY));

  stopCount.textContent = String(stops.length);

  function readVisited(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function persistVisited() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
    updateProgress();
  }

  function persistRouteVisited() {
    localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify([...routeVisited]));
    updateRouteProgress();
  }

  function updateRouteProgress() {
    const total = routeItems.length;
    const count = routeItems.filter(item => routeVisited.has(item.dataset.routeId)).length;
    const percent = total ? Math.round((count / total) * 100) : 0;

    if (routeProgressText) routeProgressText.textContent = `${count} of ${total} visited`;
    if (routeProgressPercent) routeProgressPercent.textContent = `${percent}%`;
    if (routeProgressBar) routeProgressBar.style.width = `${percent}%`;

    routeItems.forEach(item => {
      const isVisited = routeVisited.has(item.dataset.routeId);
      item.classList.toggle('route-visited', isVisited);
      const button = item.querySelector('[data-route-visit]');
      if (button) {
        button.textContent = isVisited ? 'Mark as not visited' : 'Mark as visited';
        button.setAttribute('aria-pressed', String(isVisited));
      }
    });
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

  function mapUrlFromQuery(query) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  function mapUrl(stop) {
    return mapUrlFromQuery(stop.mapQuery || stop.location);
  }

  function directionItems(stop) {
    if (Array.isArray(stop.directions) && stop.directions.length) {
      return stop.directions.filter(item => item && item.query);
    }
    return [{ label: 'Directions', query: stop.mapQuery || stop.location }];
  }

  function directionLinks(stop, className = '') {
    return directionItems(stop).map(item => {
      const linkClass = className ? ` class="${className}"` : '';
      return `<a${linkClass} href="${mapUrlFromQuery(item.query)}" target="_blank" rel="noopener" aria-label="${escapeHtml(item.label)} to ${escapeHtml(stop.title)}">${escapeHtml(item.label)}</a>`;
    }).join('');
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
      const stopDirections = directionItems(stop);
      const actions = stop.multiLocation
        ? `<div class="stop-actions single"><button class="details-button" type="button" data-action="details" data-id="${escapeHtml(stop.id)}">View hotspot readings</button></div>`
        : `<div class="stop-actions ${stopDirections.length > 1 ? 'multiple' : ''}">
             <button class="details-button" type="button" data-action="details" data-id="${escapeHtml(stop.id)}">Read stop</button>
             ${directionLinks(stop)}
           </div>`;

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
            ${actions}
            <button class="visit-toggle" type="button" data-action="visit" data-id="${escapeHtml(stop.id)}">${isVisited ? 'Mark as not visited' : 'Mark as visited'}</button>
          </div>
        </article>`;
    }).join('');
    updateProgress();
  }

  function milestoneMarkup(stop) {
    if (!Array.isArray(stop.milestones) || !stop.milestones.length) return '';
    const items = stop.milestones.map(item => `
      <article class="milestone-item">
        <div class="milestone-year">${escapeHtml(item.year)}</div>
        <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></div>
      </article>`).join('');
    return `<section class="milestones"><div class="milestones-label">Why Niagara mattered</div>${items}</section>`;
  }

  function hotspotMarkup(stop) {
    const aerial = stop.aerialSurvey;
    const hotspots = Array.isArray(stop.hotspots) ? stop.hotspots : [];
    if (!aerial && !hotspots.length) return '';

    const background = stop.backgroundReading
      ? ` The 1985 report used about ${escapeHtml(stop.backgroundReading)} µR/h as typical local background for comparison.`
      : '';

    const aerialMarkup = aerial ? `
      <details class="survey-group" open>
        <summary>
          <span class="survey-group-title"><strong>${escapeHtml(aerial.title)}</strong><small>Airborne survey · measurements averaged across several acres</small></span>
          <span class="survey-group-count">${escapeHtml(aerial.count)} locations followed up</span>
        </summary>
        <p class="survey-method-note">${escapeHtml(aerial.summary)}</p>
        <div class="aerial-zone-grid">
          ${(aerial.zones || []).map(zone => `
            <article class="aerial-zone">
              <strong>${escapeHtml(zone.location)}</strong>
              <span>${escapeHtml(zone.reading)}</span>
              <p>${escapeHtml(zone.note)}</p>
            </article>`).join('')}
        </div>
      </details>` : '';

    const areas = [];
    hotspots.forEach(item => {
      let area = areas.find(group => group.name === item.area);
      if (!area) {
        area = { name: item.area || 'Other locations', items: [] };
        areas.push(area);
      }
      area.items.push(item);
    });

    const groundMarkup = areas.map(area => `
      <details class="survey-group">
        <summary>
          <span class="survey-group-title"><strong>${escapeHtml(area.name)}</strong><small>1984 vehicle scan · 1985 ground survey</small></span>
          <span class="survey-group-count">${area.items.length} ${area.items.length === 1 ? 'location' : 'locations'}</span>
        </summary>
        <div class="hotspot-compact-list">
          ${area.items.map(item => {
            const reading = Number.isFinite(item.reading) ? `${escapeHtml(item.reading)} µR/h` : 'Reading in federal table';
            const status = item.status || 'Historical anomaly';
            const readingMeta = Number.isFinite(item.oneMeterReading)
              ? ` · ${escapeHtml(item.oneMeterReading)} µR/h at 1 m`
              : '';
            return `
              <article class="hotspot-compact-row">
                <span class="hotspot-anomaly">${escapeHtml(item.anomaly)}</span>
                <div class="hotspot-compact-main">
                  <strong>${escapeHtml(item.location)}</strong>
                  <small>${escapeHtml(status)}${readingMeta}</small>
                  ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}
                </div>
                <span class="hotspot-reading">${reading}</span>
              </article>`;
          }).join('')}
        </div>
      </details>`).join('');

    return `
      <section class="survey-readings">
        <div class="survey-readings-head">
          <span>Complete historical survey record</span>
          <p>The 1979 readings are airborne averages; the numbered 1984–1985 entries are historical ground-survey locations. They are different measurement methods and should not be compared as if they were the same. Values are gross readings with background not subtracted.${background} These records do not describe present-day conditions and are not instructions to enter private property.</p>
        </div>
        ${aerialMarkup}
        <div class="ground-survey-heading">
          <strong>All 100 numbered anomalies</strong>
          <span>Open each area to see every location</span>
        </div>
        ${groundMarkup}
      </section>`;
  }

  function openStop(stop) {
    const paragraphs = (stop.body || []).map(p => `<p>${escapeHtml(p)}</p>`).join('');
    const milestoneSection = milestoneMarkup(stop);
    const hotspotSection = hotspotMarkup(stop);
    const directions = stop.multiLocation ? '' : `<div class="dialog-maps">${directionLinks(stop, 'dialog-map')}</div>`;

    dialogContent.innerHTML = `
      <article class="dialog-inner">
        <div class="dialog-number">Stop ${String(stop.number).padStart(2, '0')} · ${escapeHtml(stop.location)} · ${escapeHtml(stop.duration)}</div>
        <h3>${escapeHtml(stop.title)}</h3>
        <p class="dialog-kicker">${escapeHtml(stop.kicker)}</p>
        <p class="dialog-summary">${escapeHtml(stop.summary)}</p>
        <div class="dialog-body">${paragraphs}</div>
        ${milestoneSection}
        ${hotspotSection}
        <div class="dialog-callout">${escapeHtml(stop.callout)}</div>
        <div class="dialog-look"><strong>What to notice</strong>${escapeHtml(stop.lookFor)}</div>
        ${directions}
      </article>`;
    stopDialog.showModal();
  }

  processLine?.addEventListener('click', event => {
    const control = event.target.closest('[data-route-visit]');
    if (!control) return;
    const routeId = control.dataset.routeVisit;
    routeVisited.has(routeId) ? routeVisited.delete(routeId) : routeVisited.add(routeId);
    persistRouteVisited();
  });

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
    routeVisited = new Set();
    persistVisited();
    persistRouteVisited();
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
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=41', { updateViaCache: 'none' }).catch(() => {}));
  }

  renderStops();
  updateRouteProgress();
})();
