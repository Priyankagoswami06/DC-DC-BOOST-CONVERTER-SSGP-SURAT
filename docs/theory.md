# Theory

For an ideal boost converter operating in CCM:

`Vout = Vin / (1 - D)`

The inductor stores energy while the switch is ON and transfers energy to the output through the diode while the switch is OFF.

Approximate inductor ripple:

`ΔIL ≈ Vin D / (L fs)`

Approximate output ripple:

`ΔVout ≈ Iout D / (C fs)`

Approximate critical inductance for the CCM/DCM boundary:

`Lcrit ≈ D(1-D)^2 Rload / (2 fs)`

For the ideal resistive-load DCM model:

`K = 2L/(Rload fs)`

`M_DCM = [1 + sqrt(1 + 4D^2/K)] / 2`

In DCM the switching period contains three intervals: MOSFET ON, MOSFET OFF/diode ON, and a zero-current interval after the inductor current reaches zero.

The browser model additionally includes simplified ESR, semiconductor drops and switching-loss terms.
