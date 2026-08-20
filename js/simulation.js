window.BoostSim = (() => {
  const val = id => Number(document.getElementById(id).value);
  function params(){
    return {
      vin:val("vin"), rs:val("rs"), duty:val("duty")/100, freq:val("freq")*1000,
      tr:val("tr")*1e-9, tf:val("tf")*1e-9, L:val("inductance")*1e-3, lesr:val("lesr"),
      iinit:val("iinit"), C:val("capacitance")*1e-6, cesr:val("cesr"), vinit:val("vinit"),
      R:val("load"), rdson:val("rdson"), vgs:val("vgs"), vth:val("vth"),
      vf:val("vf"), dr:val("dr"), trr:val("trr")*1e-9
    };
  }
  function validate(p){
    const errors=[];
    if(!(p.vin>0)) errors.push("Vin must be greater than 0.");
    if(!(p.duty>=.05 && p.duty<=.90)) errors.push("Duty cycle must be between 5% and 90%.");
    if(!(p.freq>0)) errors.push("Switching frequency must be greater than 0.");
    if(!(p.L>0)) errors.push("Inductance must be greater than 0.");
    if(!(p.C>0)) errors.push("Capacitance must be greater than 0.");
    if(!(p.R>0)) errors.push("Load resistance must be greater than 0.");
    return errors;
  }
  function calculate(p){
    const T=1/p.freq, ton=p.duty*T, toff=T-ton;
    const idealV=p.vin/(1-p.duty);
    const rippleIL=p.vin*p.duty/(p.L*p.freq);
    const idealIout=idealV/p.R;
    const idealPout=idealV*idealIout;
    const ilAvgIdeal=idealPout/p.vin;
    const ilMin=ilAvgIdeal-rippleIL/2;
    const ilPeak=ilAvgIdeal+rippleIL/2;
    const mode=ilMin>0 ? "CCM" : "DCM";

    // Educational non-ideal correction. The time-domain plot uses the same operating point.
    const mosLoss=ilAvgIdeal*ilAvgIdeal*p.rdson*p.duty;
    const diodeLoss=Math.max(0,idealIout)*(p.vf + idealIout*p.dr)*(1-p.duty);
    const indLoss=ilAvgIdeal*ilAvgIdeal*p.lesr;
    const capRms=idealIout*Math.sqrt(Math.max(p.duty*(1-p.duty),0.0001));
    const capLoss=capRms*capRms*p.cesr;
    const swLoss=.5*idealV*ilAvgIdeal*(p.tr+p.tf)*p.freq;
    const sourceLoss=ilAvgIdeal*ilAvgIdeal*p.rs;
    const totalLoss=mosLoss+diodeLoss+indLoss+capLoss+swLoss+sourceLoss;
    const pin=idealPout+totalLoss;
    const eta=Math.max(0,Math.min(100,idealPout/pin*100));
    const vout=Math.max(0,idealV*(eta/100) - p.vf*(1-p.duty));
    const iout=vout/p.R;
    const pout=vout*iout;
    const gain=vout/p.vin;
    const vRipple=(iout*p.duty/(p.C*p.freq)) + iout*p.cesr*0.1;
    const error=Math.abs(idealV-vout)/idealV*100;
    return {T,ton,toff,idealV,vout,iout,pin,pout,eta,gain,rippleIL,ilAvg:ilAvgIdeal,ilMin,ilPeak,
      vRipple,totalLoss,mosLoss,diodeLoss,indLoss,capLoss,swLoss,sourceLoss,mode,error};
  }
  function waveforms(p,r,N=240){
    const dt=r.T/N, t=[], pwm=[], il=[], vout=[], id=[], isw=[], vc=[];
    const v=r.vout, avg=r.ilAvg, rip=r.rippleIL;
    for(let k=0;k<N;k++){
      const time=k*dt, phase=(time%r.T)/r.T, on=phase<p.duty;
      t.push(time*1e6);
      pwm.push(on?1:0);
      il.push(avg + (on ? -1 : 1)*0.5*rip*(on?1:-1));
      // A smoothed ripple model for educational visualization.
      const ripple=v*r.vRipple/Math.max(v,0.001);
      vc.push(v + (phase<0.5 ? ripple*(phase*2) : ripple*(2-2*phase)) - ripple/2);
      vout.push(v + (vc[vc.length-1]-v)*0.15);
      id.push(on?0:Math.max(0,il[il.length-1]));
      isw.push(on?Math.max(0,il[il.length-1]):0);
    }
    return {t,pwm,il,vout,id,isw,vc};
  }
  return {params,validate,calculate,waveforms};
})();
