# Experiment Procedure

1. Set Vin, duty cycle and switching frequency.
2. Set L, C and Rload.
3. Enter practical ESR and semiconductor parameters.
4. Keep Animation Speed at 0.5× for a clear demonstration.
5. Run the simulation.
6. Observe Vout, Iout, efficiency, Lcrit and CCM/Critical/DCM.
7. Start animation to observe current direction.
8. In DCM, identify all three operating intervals.
9. Use Pause or Step Cycle to inspect the switching cycle slowly.
10. Inspect all waveforms.
11. Run parameter sweeps.
12. Add readings to the observation table.
13. Export the observation table as CSV.

## Suggested DCM experiment

With Automatic mode selected, reduce L below Lcrit or increase Rload. Observe the transition:

`CCM → Critical → DCM`

During DCM, observe:

- Interval 1: Vin → L → MOSFET → Ground; iL rises.
- Interval 2: Vin → L → Diode → Capacitor/Load → Ground; iL falls.
- Interval 3: iL = 0; diode current is zero until the next cycle.
