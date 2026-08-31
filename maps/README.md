# Toxic Niagara — Google My Maps package

These files are prepared for a public **Google My Maps** companion to the Toxic Niagara driving-tour PWA.

## Layers

### 1. Tour Stops
Import `google-mymaps-tour-stops.csv`.

When Google My Maps asks how to position the markers, select both **Latitude** and **Longitude**. When it asks which column should label the markers, select **Name**.

The physical tour layer contains 10 map destinations. The PWA's Stop 10, **The Surveys · 1978–1985**, is a multi-location interpretive chapter rather than a single physical destination, so its pins live in the separate survey layer below.

### 2. 1978–1985 Survey Hotspots
Import `google-mymaps-survey-hotspots.csv` into a new layer.

When Google My Maps asks how to position the markers, select **Address**. Use **Name** as the marker title.

The first high-reading pins included are:

- Anomaly #43 — 738 Upper Mountain Road — **710 µR/h**
- Anomaly #81 — 6901 Buffalo Avenue — **160 µR/h**
- Anomaly #63 — near 3060 Grand Island Boulevard — **160 µR/h**
- Anomaly #52 — 2924 Military Road — **140 µR/h**

The 1985 report's **230 µR/h Pletcher Road anomaly (#23)** is intentionally not given a public map pin yet. Its historical location is described as the south side of Pletcher Road, 8,960 ft east of Creek Road. Until that historical position is converted to a verified coordinate, placing a generic Pletcher Road pin would imply a precision the record does not support.

## Create the map

1. Open Google My Maps on a computer and create a new map.
2. Name it **Toxic Niagara — Driving Tour**.
3. Rename the first layer **Tour Stops** and import `google-mymaps-tour-stops.csv`.
4. Add a second layer named **1978–1985 Survey Hotspots** and import `google-mymaps-survey-hotspots.csv`.
5. Style Tour Stops by the **Category** column so the Buffalo Avenue, Highland/Pine, waste and aerospace histories remain visually distinct.
6. Style the hotspot layer by **Reading_uR_h** or use one high-visibility marker style for all historical radiation anomalies.
7. Add a **Directions** layer if you want Google My Maps to draw the actual driving roads. Google places each directions set in its own map layer.

## Suggested physical driving order

The current PWA narrative order for the mappable destinations is:

1. Love Canal
2. Hooker Chemical · Buffalo Avenue
3. Goodyear Chemical
4. Carborundum · Buffalo Avenue
5. Electromet · Union Carbide
6. Highland Avenue
7. Union Carbide landfill · Newco / CECOS
8. LOOW · Niagara Falls Storage Site
9. Model City · the patchwork beyond NFSS
10. Bell Aircraft · Bell Aerospace

The Surveys chapter is experienced through its separate hotspot layer rather than inserted as a single road destination.

## Safety / interpretation

Pins identify documented historical or industrial locations; they are not invitations to enter a site or test private property. Historical survey readings do not describe current conditions. Users should remain on public roads/public property and obey access restrictions.

**“Remediated” does not mean contamination-free.** It means a cleanup action was completed to the standard and land-use assumptions that applied to that project.
