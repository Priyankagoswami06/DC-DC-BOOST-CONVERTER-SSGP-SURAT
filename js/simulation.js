window.BoostSim = (() => {
  const $ = id => document.getElementById(id);
  const n = id => Number($(id).value);

  function read(){
    return {
      vin:n("vin"),rs:n("rs"),rload:n("rload"),d:n("duty")/100,fs:n("fs")*1000,
      deadtime:n("deadtime")*1e-9,vgs:n("vgs"),vth:n("vth"),L:n("L")/1000,lesr:n("lesr"),
      iinit:n("iinit"),C:n("C")*1e-6,cesr:n("cesr"),vinit:n("vinit"),rdson:n("rdson"),
      vf:n("vf"),dr:n("dr"),trr:n("trr")*1e-9,tr:n("tr")*1e-9,tf:n("tf")*1e-9,
      modeSelector:$("modeSelector").value
    };
  }

  function calculate(p=read()){
    if(p.d<=0 || p.d>=1 || p.L<=0 || p.C<=0 || p.rload<=0 || p.vin<=0)
      throw new Error("Check Vin, duty cycle, L, C and load values.");

    const T=1/p.fs;
    const idealCCM=p.vin/(1-p.d);
    const lcrit=p.d*Math.pow(1-p.d,2)*p.rload/(2*p.fs);
    const lcrit_mH=lcrit*1000;

    // Ideal steady-state DCM gain from the standard three-interval charge balance model.
    const K=2*p.L/(p.rload*T);
    const dcmGain=(1+Math.sqrt(1+4*p.d*p.d/Math.max(K,1e-12)))/2;
    const dcmIdeal=p.vin*dcmGain;

    const autoMode = p.L > lcrit*1.0005 ? "CCM" : (Math.abs(p.L-lcrit)<=lcrit*0.0005 ? "Critical" : "DCM");
    let mode=autoMode;
    if(p.modeSelector==="ccm") mode="CCM";
    if(p.modeSelector==="dcm") mode="DCM";

    // Educational practical correction. The conduction/loss model is intentionally simplified.
    const baseVout = mode==="DCM" ? dcmIdeal : idealCCM;
    const diodeDrop = p.vf*(mode==="DCM" ? 0.65 : (1-p.d));
    const practical=Math.max((baseVout - diodeDrop)*(1-p.rdson*p.d/Math.max(p.rload,0.01)), p.vin*0.5);
    let vout=practical;
    let iout=vout/p.rload;

    // Re-estimate average inductor current using the selected operating mode.
    const dIL=p.vin*p.d/(p.L*p.fs);
    let ilavg, ilpeak, ilmin, d2, d3;
    if(mode==="DCM"){
      // For DCM, the current is triangular during D1+D2 and zero during D3.
      const dcmV=Math.max(vout,p.vin*1.001);
      d2=Math.min(1-p.d, p.vin*p.d/Math.max(dcmV-p.vin,1e-9));
      d3=Math.max(0,1-p.d-d2);
      ilpeak=p.vin*p.d*T/p.L;
      ilmin=0;
      ilavg=0.5*ilpeak*(p.d+d2);
    } else if(mode==="Critical"){
      d2=1-p.d; d3=0;
      ilpeak=p.vin*p.d*T/p.L;
      ilmin=0;
      ilavg=0.5*(ilpeak+ilmin);
    } else {
      d2=1-p.d; d3=0;
      ilavg=Math.max(iout/(1-p.d), iout);
      ilpeak=ilavg+dIL/2;
      ilmin=Math.max(0,ilavg-dIL/2);
    }

    // Make practical current/power self-consistent enough for classroom visualization.
    iout=vout/p.rload;
    const inputAvg=mode==="DCM" ? ilavg : Math.max(ilavg, iout);
    const ilrms=mode==="DCM"
      ? ilpeak*Math.sqrt((p.d+d2)/3)
      : Math.sqrt(Math.max(0,ilavg*ilavg+dIL*dIL/12));
    const dV=iout*p.d/(p.C*p.fs)+iout*p.cesr;

    const conduction=p.rdson*(ilrms**2)*p.d + p.lesr*(ilrms**2) +
      p.dr*(iout**2)*(1-p.d) + p.vf*iout*(1-p.d) + p.rs*(inputAvg**2);
    const switching=0.5*p.vin*Math.max(ilpeak,0)*(p.tr+p.tf)*p.fs;
    const recovery=0.5*p.vin*iout*p.trr*p.fs*0.1;
    const loss=Math.max(0,conduction+switching+recovery);
    const pout=vout*iout;
    const pin=pout+loss;
    const eff=pin>0?100*pout/pin:0;

    return {
      p,ideal:idealCCM,vout,iout,pout,pin,eff,gain:vout/p.vin,inputAvg,ilavg,ilpeak,ilmin,
      ilrms,dIL,dV,loss,mode,error:100*(vout-idealCCM)/idealCCM,lcrit,lcrit_mH,
      dcmGain,dcmIdeal,T,d2:d2||0,d3:d3||0,K
    };
  }

  function intervalAt(r, phase){
    const p=r.p, x=((phase%1)+1)%1;
    if(x < p.d) return 1;
    if(r.mode==="DCM" && x < p.d+r.d2) return 2;
    if(r.mode==="DCM") return 3;
    return 2;
  }

  function currentAt(r, phase){
    const p=r.p, x=((phase%1)+1)%1;
    if(x < p.d){
      return Math.max(0,r.ilpeak*(x/p.d));
    }
    if(r.mode==="DCM"){
      const q=Math.max(0,x-p.d);
      const span=Math.max(r.d2,1e-9);
      return Math.max(0,r.ilpeak*(1-q/span));
    }
    const q=(x-p.d)/Math.max(1-p.d,1e-9);
    return Math.max(0,r.ilpeak-r.dIL*q);
  }

  function waveform(r,type){
    const p=r.p,N=700,period=1/p.fs,arr=[];
    for(let k=0;k<N;k++){
      const t=(k/N)*period*2;
      const phase=(t%period)/period;
      const interval=intervalAt(r,phase);
      const il=currentAt(r,phase);
      const vout=r.vout + r.dV*0.45*Math.sin(2*Math.PI*phase);
      const gate=phase<p.d?1:0;
      let y=0;
      if(type==="gate") y=gate;
      if(type==="il") y=il;
      if(type==="vout") y=vout;
      if(type==="diode") y=interval===2?il:0;
      if(type==="mosfet") y=interval===1?il:0;
      if(type==="cap") y=interval===1?-r.iout:(interval===2?il-r.iout:-r.iout);
      if(type==="input") y=il;
      if(type==="inductorVoltage"){
        if(interval===1) y=p.vin-il*p.lesr;
        else if(interval===2) y=-(r.vout+p.vf-p.vin);
        else y=0;
      }
      arr.push({x:t*1e6,y});
    }
    return arr;
  }

  function validate(p){
    if(p.vgs<=p.vth) throw new Error("VGS must be greater than Vth for MOSFET turn-on.");
    return true;
  }

  return {read,calculate,validate,waveform,intervalAt,currentAt};
})();