# DC-DC Boost Converter Virtual Lab

An interactive, GitHub Pages-ready educational virtual laboratory for studying a DC-DC boost converter.

## Features

- Adjustable input voltage, duty cycle and switching frequency
- Inductor, capacitor and load parameters
- MOSFET and diode non-ideal parameters
- Ideal CCM reference and simplified non-ideal model
- CCM/DCM indication
- Animated circuit
- PWM, inductor current, output voltage, diode current and MOSFET current waveforms
- Efficiency and loss estimation
- Parameter sweep
- Observation table
- CSV export
- Theory, experiment procedure, quiz and viva sections
- Responsive UI and dark mode

## Run locally

Open `index.html` in a modern browser. An internet connection is required for the Chart.js CDN used by the graphs.

## GitHub Pages

1. Create a GitHub repository.
2. Upload all files while preserving the directory structure.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select the `main` branch and `/root`.
6. Save and open the generated Pages URL.

## Educational model note

The simulation is a simplified browser-based numerical model intended for teaching. It should not be used as a substitute for SPICE, detailed semiconductor models, thermal design, magnetics design, EMI analysis, or hardware qualification.

## Project structure

```text
dc-dc-boost-converter-virtual-lab/
├── index.html
├── style.css
├── README.md
├── assets/
├── js/
│   ├── app.js
│   ├── simulation.js
│   ├── waveform.js
│   ├── sweep.js
│   └── quiz.js
└── docs/
```
