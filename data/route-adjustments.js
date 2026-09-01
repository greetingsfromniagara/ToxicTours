// Route-level curation applied after all stop modules load.
// Upper Mountain Road remains documented inside the 1978–1985 survey stop,
// where the 738 Upper Mountain Road anomaly is shown as the highest 1985 reading.
window.TOXIC_TOUR_STOPS = (window.TOXIC_TOUR_STOPS || [])
  .filter(stop => !['upper-mountain', 'electromet', 'carborundum'].includes(stop.id))
  .sort((a, b) => a.number - b.number)
  .map((stop, index) => ({ ...stop, number: index + 1 }));
