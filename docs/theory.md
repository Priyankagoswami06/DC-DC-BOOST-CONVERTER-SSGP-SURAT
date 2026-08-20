# Theory

For an ideal boost converter operating in CCM:

`Vout = Vin / (1 - D)`

The inductor stores energy while the switch is ON and transfers energy to the output through the diode while the switch is OFF.

Approximate inductor ripple:

`ΔIL ≈ Vin D / (L fs)`

Approximate output ripple:

`ΔVout ≈ Iout D / (C fs)`

The browser model additionally includes simplified ESR, semiconductor drops and switching-loss terms.
