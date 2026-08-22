# Advanced DC-DC Boost Converter Virtual Lab — SSGP Surat

This updated browser-based virtual laboratory keeps the supplied Boost Converter circuit image and adds a real three-interval DCM teaching model.

## Main upgrades
- Automatic CCM / Critical / DCM detection
- Educational Force CCM / Force DCM selector
- Actual DCM three intervals:
  1. MOSFET ON → inductor current rises
  2. MOSFET OFF / diode ON → inductor current falls
  3. Zero-current interval → iL = 0
- Slow default current-flow animation at 0.5×
- Animation speed: 0.25×, 0.5×, 1×, 2×
- Pause, Resume, Step Cycle and Phase 0 controls
- Live circuit interval highlighting
- IL peak, average, minimum and RMS
- Iin, Vout, Iout, Pin, Pout, efficiency and losses
- Critical inductance Lcrit
- DCM gain and DCM interval timing
- Interactive oscilloscope cursor
- Gate, iL, vout, diode, MOSFET, capacitor, input and inductor-voltage waveforms
- Parameter sweep
- Observation table + CSV export
- Updated quiz and educational theory/procedure content

## Run locally
Open `index.html` in a modern browser. Internet access is needed for the Chart.js CDN used by the waveform charts.

## GitHub Pages
1. Create a public GitHub repository.
2. Upload the complete folder contents.
3. Settings → Pages → Deploy from a branch.
4. Select `main` and `/ (root)`.
5. Save.

## Folder structure
```text
DC-DC-BOOST-CONVERTER-SSGP-SURAT/
├── index.html
├── style.css
├── assets/
│   └── Boost-Converter.png
├── js/
│   ├── app.js
│   ├── simulation.js
│   ├── waveforms.js
│   └── quiz.js
└── docs/
    ├── theory.md
    ├── experiment.md
    └── viva.md
```

## Educational model note
The simulation is intended for teaching and visualization. The loss model is simplified and is not a replacement for SPICE, PLECS, Simulink, or hardware validation.

## DCM model note
The DCM gain uses the standard ideal three-interval charge-balance relationship for an R-loaded boost converter:
`M_DCM = [1 + sqrt(1 + 4D^2/K)] / 2`, with `K = 2L/(Rload*Ts)`.
The practical display then applies simplified semiconductor and resistance corrections.
