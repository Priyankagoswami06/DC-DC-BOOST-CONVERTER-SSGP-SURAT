# DC-DC Boost Converter Virtual Lab — SSGP Surat

Advanced browser-based educational virtual laboratory for a DC-DC boost converter.

## Included
- Exact circuit image supplied by the user (`assets/Boost-Converter.png`)
- Interactive parameter panel
- Practical loss model
- CCM/DCM indication
- Animated current direction
- MOSFET ON/OFF operating modes
- Gate, inductor, output, diode, MOSFET, capacitor, input-current and inductor-voltage waveforms
- Parameter sweep
- Observation table
- CSV export
- Theory, procedure, quiz and viva

## GitHub Pages
1. Create a public repository.
2. Upload all files/folders exactly as they appear.
3. Settings → Pages → Deploy from a branch.
4. Select `main` and `/ (root)`.
5. Save and open the generated Pages URL.

## Folder structure
```text
DC-DC-BOOST-CONVERTER-SSGP-SURAT/
├── index.html
├── style.css
├── README.md
├── assets/
│   └── provided-reference.png
├── js/
│   ├── app.js
│   ├── simulation.js
│   └── waveforms.js
└── docs/
    ├── theory.md
    ├── experiment.md
    └── viva.md
```

## Educational model note
This is a browser simulation intended for teaching and visualization. It is not a replacement for a SPICE/PLECS/Simulink switching model. The practical loss terms are simplified and should be validated against laboratory hardware or a circuit simulator for research-grade work.

## Live current direction
The simulation uses the exact supplied circuit image as the base. A transparent SVG overlay adds animated green current arrows. The arrows automatically switch between MOSFET ON and OFF paths while the simulation is running.
