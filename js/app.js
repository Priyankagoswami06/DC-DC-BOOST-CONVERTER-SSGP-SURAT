let animTimer=null, animPhase=0, lastFrame=performance.now(), paused=false, observations=[];
const $=id=>document.getElementById(id);

function activateTab(id){
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
  $(id).classList.add("active");
  document.querySelector(`.nav-btn[data-tab="${id}"]`)?.classList.add("active");
}
window.activateTab=activateTab;
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>activateTab(b.dataset.tab));

function setText(id,val){const e=$(id);if(e)e.textContent=val}

function run(){
  try{
    const p=BoostSim.read(); BoostSim.validate(p); const r=BoostSim.calculate(p); BoostSimResult=r;
    setText("vout",r.vout.toFixed(2)+" V"); setText("iout",r.iout.toFixed(3)+" A");
    setText("iin",r.inputAvg.toFixed(3)+" A"); setText("pin",r.pin.toFixed(2)+" W"); setText("pout",r.pout.toFixed(2)+" W");
    setText("eff",r.eff.toFixed(2)+" %"); setText("gain",r.gain.toFixed(3));
    setText("ilavg",r.ilavg.toFixed(3)+" A"); setText("ilpeak",r.ilpeak.toFixed(3)+" A");
    setText("ilmin",r.ilmin.toFixed(3)+" A"); setText("ilrms",r.ilrms.toFixed(3)+" A");
    setText("ilripple",r.dIL.toFixed(3)+" A"); setText("vripple",r.dV.toFixed(3)+" V");
    setText("lcrit",r.lcrit_mH.toFixed(3)+" mH"); setText("loss",r.loss.toFixed(2)+" W");
    setText("mode",r.mode); setText("ideal",r.ideal.toFixed(2)+" V"); setText("dcmgain",r.dcmGain.toFixed(3));
    const explanation=r.mode==="DCM"
      ? `DCM detected: L = ${(r.p.L*1000).toFixed(3)} mH < Lcrit = ${r.lcrit_mH.toFixed(3)} mH. The third zero-current interval occupies ${(r.d3*100).toFixed(1)}% of each cycle.`
      : r.mode==="Critical"
      ? `Critical conduction: L ≈ Lcrit. The inductor current reaches approximately zero at the boundary.`
      : `CCM detected: L = ${(r.p.L*1000).toFixed(3)} mH > Lcrit = ${r.lcrit_mH.toFixed(3)} mH. No zero-current interval is present.`;
    setText("modeExplain",explanation);
    $("message").textContent="Simulation updated.";
    animPhase=0; updateCircuit(); drawWave($("waveSelect").value); updateWaveCursor(animPhase);
  }catch(e){$("message").textContent=e.message}
}

function setMotionSpeed(){
  const speed=Number($("speed").value);
  const duration=2.2/speed;
  ["motionOn1","motionOn2","motionOff1","motionOff2"].forEach(id=>{const e=$(id);if(e)e.setAttribute("dur",duration+"s")});
  const label=speed<0.5?"Very Slow":speed<1?"Slow":speed===1?"Normal":"Fast";
  setText("speedValue",speed+"× "+label);
}

function updateCircuit(){
  if(!window.BoostSimResult)return;
  const r=BoostSimResult, p=r.p;
  const phase=((animPhase%1)+1)%1;
  const interval=BoostSim.intervalAt(r,phase);
  const state=interval===1?"on":interval===2?"off":"zero";
  $("stateBadge").className="state "+state;
  $("stateBadge").textContent=interval===1?"MOSFET ON":interval===2?"MOSFET OFF":"DCM • iL = 0";
  setText("stateText",interval===1?"State: MOSFET ON":interval===2?"State: MOSFET OFF / DIODE ON":"State: DCM ZERO-CURRENT");
  setText("currentPath",interval===1?"Current path: Vin → Inductor → MOSFET → Ground":interval===2?"Current path: Vin → Inductor → Diode → Capacitor / Load → Ground":"Current path: iL = 0 → no inductor/diode current");
  setText("componentState",interval===1?"MOSFET: ON • Diode: OFF":interval===2?"MOSFET: OFF • Diode: ON":"MOSFET: OFF • Diode: OFF");
  setText("intervalText",interval===1?"Interval: 1 / 3 • Energy storage":interval===2?"Interval: 2 / 3 • Energy transfer":r.mode==="DCM"?"Interval: 3 / 3 • Zero current":"Interval: 2 / 2 • Energy transfer");
  const box=$("liveCircuit");
  box.classList.toggle("state-on",state==="on"); box.classList.toggle("state-off",state==="off"); box.classList.toggle("state-zero",state==="zero");
  $("currentOn").classList.toggle("hidden",state!=="on");
  $("currentOff").classList.toggle("hidden",state!=="off");
  $("currentZero").classList.toggle("hidden",state!=="zero");
  $("int1").className="interval"+(interval===1?" active":"");
  $("int2").className="interval"+(interval===2?" active":"");
  $("int3").className="interval"+(interval===3?" zero-active":"");
  updateWaveCursor(phase);
}

function animate(){
  if(animTimer){clearInterval(animTimer);animTimer=null;$("animateBtn").textContent="⏯ Animate";return}
  paused=false;$("pauseBtn").textContent="⏸ Pause";$("animateBtn").textContent="⏹ Stop";
  lastFrame=performance.now();
  animTimer=setInterval(()=>{
    if(!BoostSimResult || paused)return;
    const now=performance.now(),dt=(now-lastFrame)/1000;lastFrame=now;
    const speed=Number($("speed").value);
    animPhase=(animPhase+(dt*BoostSimResult.p.fs*speed))%1;
    updateCircuit();
  },33);
}

function addReading(){if(!window.BoostSimResult)return;observations.push(BoostSimResult);renderObs()}
function renderObs(){
  const tb=document.querySelector("#obsTable tbody");tb.innerHTML="";
  observations.forEach((r,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${i+1}</td><td>${r.p.vin.toFixed(2)}</td><td>${(r.p.d*100).toFixed(1)}</td><td>${r.vout.toFixed(2)}</td><td>${r.iout.toFixed(3)}</td><td>${r.ilavg.toFixed(3)}</td><td>${r.ilpeak.toFixed(3)}</td><td>${r.eff.toFixed(2)}%</td><td>${r.mode}</td><td>${r.lcrit_mH.toFixed(3)}</td>`;
    tb.appendChild(tr)
  });
}
function exportCSV(){
  const rows=[["No","Vin(V)","Duty(%)","Vout(V)","Iout(A)","ILavg(A)","ILpeak(A)","Efficiency(%)","Mode","Lcrit(mH)"],
    ...observations.map((r,i)=>[i+1,r.p.vin,r.p.d*100,r.vout,r.iout,r.ilavg,r.ilpeak,r.eff,r.mode,r.lcrit_mH])];
  const blob=new Blob([rows.map(x=>x.join(",")).join("\n")],{type:"text/csv"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="boost-converter-observations.csv";a.click();URL.revokeObjectURL(a.href);
}

$("runBtn").onclick=run;
$("animateBtn").onclick=animate;
$("waveSelect").onchange=()=>drawWave($("waveSelect").value);
$("speed").oninput=setMotionSpeed;
$("pauseBtn").onclick=()=>{paused=!paused;$("pauseBtn").textContent=paused?"▶ Resume":"⏸ Pause"};
$("stepBtn").onclick=()=>{if(!BoostSimResult)return;paused=true;$("pauseBtn").textContent="▶ Resume";animPhase=(animPhase+1)%1;updateCircuit()};
$("resetPhaseBtn").onclick=()=>{animPhase=0;updateCircuit()};
$("addReading").onclick=addReading;
$("exportCsv").onclick=exportCSV;
$("clearObs").onclick=()=>{observations=[];renderObs()};
$("sweepBtn").onclick=()=>{const p=$("sweepParam").value,s=Number($("sweepStart").value),e=Number($("sweepEnd").value),st=Number($("sweepStep").value);drawSweep(p,s,e,st)};
$("resetBtn").onclick=()=>location.reload();

window.addEventListener("load",()=>{
  setMotionSpeed();
  run();
  document.querySelector(".tab.active")?.scrollIntoView({block:"start"});
});
