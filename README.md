# Toxic Niagara — Driving Tour

A standalone, installable Progressive Web App for the **Toxic Niagara** self-guided driving tour, part of *Greetings from Niagara*.

## What is included in v0.1

- Mobile-first driving-tour interface
- 10 initial stops from Niagara Falls to Model City
- Separate framing for the **Buffalo Avenue atomic + chemical corridor** and **Highland / Pine atomic + metals corridor**
- The project’s **Uranium Route** from Shinkolobwe → Linde → Electromet → Bliss & Laughlin → Hooker → Carborundum → LOOW/NFSS
- Optional on-device geolocation for estimated distance to stops
- One-tap driving directions
- Local progress tracking (no account required)
- Installable PWA manifest
- Offline app shell via service worker
- Per-stop source links and a data structure ready for photographs, archival documents, audio, and expanded citations
- Safety language for active industrial, landfill, federal, residential, and private-property locations
- Core interpretive warning: **“Remediated” does not mean contamination-free.**

## GitHub Pages

The app is plain HTML/CSS/JavaScript and is designed to publish directly from the repository root with GitHub Pages.

In GitHub: **Settings → Pages → Deploy from a branch → `main` / root**.

Once Pages is enabled, the PWA should be available at:

`https://greetingsfromniagara.github.io/ToxicTours/`

## Project structure

```text
/
├── index.html
├── styles.css
├── app.js
├── sw.js
├── manifest.webmanifest
├── data/
│   └── stops.js
└── icons/
    └── icon.svg
```

## Editing tour content

All initial stop content is in `data/stops.js`. Each stop supports:

- title and subtitle
- corridor/category
- destination query and approximate coordinates
- short and long narrative text
- interpretive callout
- “what to notice” field
- evidence/source links

The next content pass can add image, audio, archival-document, and citation fields without changing the app architecture.

## Important

This is an interpretive driving tour, not a radiation or contamination detector. Users are instructed to remain on public roads/public property, obey traffic laws, and not enter active industrial sites, landfills, fenced/federal areas, vacant lots, rail corridors, or private property.
