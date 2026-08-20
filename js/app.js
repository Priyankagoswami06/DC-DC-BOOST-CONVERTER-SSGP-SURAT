let animTimer=null, animPhase=0, observations=[];
const $=id=>document.getElementById(id);

function activateTab(id){
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
  $(id).classList.add("active");
  document.querySelector(`.nav-btn[data-tab="${id}"]`)?.classList.add("active");
}
window.activateTab=activateTab;
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>activateTab(b.dataset.tab));

function setText(id,val){$(id).textContent=val}
function run(){
  try{
    const p=BoostSim.read(); BoostSim.validate(p); const r=BoostSim.calculate(p); BoostSim.last=r;
    setText("vout",r.vout.toFixed(2)+" V"); setText("iout",r.iout.toFixed(3)+" A");
    setText("pin",r.pin.toFixed(2)+" W"); setText("pout",r.pout.toFixed(2)+" W");
    setText("eff",r.eff.toFixed(2)+" %"); setText("gain",r.gain.toFixed(3));
    setText("ilavg",r.ilavg.toFixed(3)+" A"); setText("ilpeak",r.ilpeak.toFixed(3)+" A");
    setText("ilmin",Math.max(0,r.ilmin).toFixed(3)+" A"); setText("ilripple",r.dIL.toFixed(3)+" A");
    setText("vripple",r.dV.toFixed(3)+" V"); setText("loss",r.loss.toFixed(2)+" W");
    setText("mode",r.mode); setText("ideal",r.ideal.toFixed(2)+" V"); setText("error",r.error.toFixed(2)+" %");
    setText("dutyLive",(r.p.d*100).toFixed(1)+" %");
    $("message").textContent="Simulation updated.";
    drawWave($("waveSelect").value); updateCircuit();
  }catch(e){$("message").textContent=e.message}
}
function updateCircuit(){
  if(!BoostSim.last)return;
  const p=BoostSim.last.p;
  const phase=(animPhase%(1/p.fs));
  const on=phase<(p.d/p.fs);
  const state=on?"on":"off";
  $("stateBadge").className="state "+state;
  $("stateBadge").textContent=on?"MOSFET ON":"MOSFET OFF";
  $("stateText").textContent=on?"State: MOSFET ON":"State: MOSFET OFF";
  $("currentPath").textContent=on?"Current path: Vin → Inductor → MOSFET → Ground":"Current path: Vin → Inductor → Diode → Capacitor / Load → Ground";
  $("componentState").textContent=on?"MOSFET: ON • Diode: OFF":"MOSFET: OFF • Diode: ON";
  const box=$("liveCircuit");
  box.classList.toggle("state-on",on); box.classList.toggle("state-off",!on);
  $("currentOn").classList.toggle("hidden",!on);
  $("currentOff").classList.toggle("hidden",on);
}
function animate(){
  if(animTimer){clearInterval(animTimer);animTimer=null;$("animateBtn").textContent="⏯ Animate";return}
  $("animateBtn").textContent="⏹ Stop";
  animTimer=setInterval(()=>{if(BoostSim.last){const p=BoostSim.last.p;animPhase+=1/(p.fs*60);updateCircuit()}},16);
}
function addReading(){
  if(!BoostSim.last)return;
  observations.push(BoostSim.last);
  renderObs();
}
function renderObs(){
  const tb=document.querySelector("#obsTable tbody");tb.innerHTML="";
  observations.forEach((r,i)=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${i+1}</td><td>${r.p.vin.toFixed(2)}</td><td>${(r.p.d*100).toFixed(1)}</td><td>${r.vout.toFixed(2)}</td><td>${r.iout.toFixed(3)}</td><td>${r.pout.toFixed(2)}</td><td>${r.eff.toFixed(2)}%</td><td>${r.mode}</td><td>${r.dIL.toFixed(3)}</td>`;tb.appendChild(tr)});
}
function exportCSV(){
  const rows=[["No","Vin(V)","Duty(%)","Vout(V)","Iout(A)","Pout(W)","Efficiency(%)","Mode","DeltaIL(A)"],...observations.map((r,i)=>[i+1,r.p.vin,r.p.d*100,r.vout,r.iout,r.pout,r.eff,r.mode,r.dIL])];
  const blob=new Blob([rows.map(x=>x.join(",")).join("\n")],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="boost-converter-observations.csv";a.click();
}
$("runBtn").onclick=run;$("animateBtn").onclick=animate;$("waveSelect").onchange=()=>drawWave($("waveSelect").value);
$("addReading").onclick=addReading;$("exportCsv").onclick=exportCSV;$("clearObs").onclick=()=>{observations=[];renderObs()};
$("sweepBtn").onclick=()=>{const p=$("sweepParam").value,s=Number($("sweepStart").value),e=Number($("sweepEnd").value),st=Number($("sweepStep").value);drawSweep(p,s,e,st)};
$("resetBtn").onclick=()=>location.reload();
window.addEventListener("load",()=>{run();document.querySelector(".tab.active")?.scrollIntoView({block:"start"})});
