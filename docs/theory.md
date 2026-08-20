# Theory

A boost converter is a non-isolated DC-DC converter that normally produces an output voltage higher than its input.

For an ideal converter in continuous conduction mode:

Vout = Vin / (1 - D)

where D is the duty ratio.

## Switching states

### MOSFET ON
The inductor is connected to the source and stores energy. The diode is reverse biased.

### MOSFET OFF
The inductor releases stored energy through the diode to the capacitor and load.

## Important relations

T = 1/fs

Ton = D*T

Toff = (1-D)*T

Delta IL ≈ Vin*D/(L*fs)

Iout = Vout/R

Pout = Vout*Iout

Efficiency = Pout/Pin * 100%
