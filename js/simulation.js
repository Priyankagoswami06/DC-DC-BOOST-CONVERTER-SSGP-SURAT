window.BoostSim = (() => {
  const $ = id => document.getElementById(id);
  let last = null;
  const n = id => Number($(id).value);

  function read(){
    return {vin:n("vin"),rs:n("rs"),rload:n("rload"),d:n("duty")/100,fs:n("fs")*1000,
      deadtime:n("deadtime")*1e-9,vgs:n("vgs"),vth:n("vth"),L:n("L")/1000,lesr:n("lesr"),
      iinit:n("iinit"),C:n("C")*1e-6,cesr:n("cesr"),vinit:n("vinit"),rdson:n("rdson"),
      vf:n("vf"),dr:n("dr"),trr:n("trr")*1e-9,tr:n("tr")*1e-9,tf:n("tf")*1e-9};
  }

  function calculate(p=read()){
    if(p.d<=0 || p.d>=1 || p.L<=0 || p.C<=0 || p.rload<=0 || p.vin<=0) throw new Error("Check Vin, duty cycle, L, C and load values.");
    const ideal=p.vin/(1-p.d);
    const effDutyLoss = 1 + p.rdson*p.d/Math.max(p.rload,0.01) + p.lesr/p.rload;
    const diodeDrop = p.vf*(1-p.d);
    const practical=Math.max(p.vin*(1-p.d*0.03)/(1-p.d) - diodeDrop, p.vin*0.5);
    const vout=practical/effDutyLoss;
    const iout=vout/p.rload;
    const dIL=p.vin*p.d/(p.L*p.fs);
    const ilavg=Math.max(iout/(1-p.d), iout);
    const ilpeak=ilavg+dIL/2;
    const ilmin=ilavg-dIL/2;
    const mode=ilmin>0 ? "CCM" : "DCM";
    const dV=iout*p.d/(p.C*p.fs)+iout*p.cesr;
    const conduction=p.rdson*(ilavg**2)*p.d + p.lesr*(ilavg**2) + p.dr*(iout**2)*(1-p.d) + p.vf*iout*(1-p.d) + p.rs*(ilavg**2);
    const switching=0.5*p.vin*ilavg*(p.tr+p.tf)*p.fs;
    const recovery=0.5*p.vin*iout*p.trr*p.fs*0.1;
    const loss=Math.max(0,conduction+switching+recovery);
    const pout=vout*iout;
    const pin=pout+loss;
    const eff=pin>0?100*pout/pin:0;
    return {p,ideal,vout,iout,pout,pin,eff,gain:vout/p.vin,ilavg,ilpeak,ilmin,dIL, dV,loss,mode,error:100*(vout-ideal)/ideal};
  }

  function waveform(r, type){
    const p=r.p, N=500, period=1/p.fs, arr=[];
    for(let k=0;k<N;k++){
      const t=(k/N)*period*2; // two periods
      const phase=(t%period)/period;
      const on=phase<p.d;
      const tri=on ? -0.5+phase/p.d : 0.5-(phase-p.d)/(1-p.d);
      const il=Math.max(0,r.ilavg+r.dIL*tri);
      const vout=r.vout + r.dV*0.5*Math.sin(2*Math.PI*phase);
      let y=0;
      if(type==="gate") y=on?1:0;
      if(type==="il") y=il;
      if(type==="vout") y=vout;
      if(type==="diode") y=on?0:il;
      if(type==="mosfet") y=on?il:0;
      if(type==="cap") y=(on?-r.iout:il-r.iout);
      if(type==="input") y=il;
      if(type==="inductorVoltage") y=on?(p.vin-il*p.lesr):-(r.vout+p.vf-p.vin);
      arr.push({x:t*1e6,y});
    }
    return arr;
  }

  function validate(p){
    if(p.vgs<=p.vth) throw new Error("VGS must be greater than Vth for MOSFET turn-on.");
    return true;
  }

  return {read,calculate,waveform,validate,get last(){return last},set last(v){last=v}};
})();