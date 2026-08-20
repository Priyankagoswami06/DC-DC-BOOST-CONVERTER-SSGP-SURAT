(() => {
  let last={p:null,r:null};
  const $=id=>document.getElementById(id);
  const fmt=(x,u="",d=2)=>Number.isFinite(x)?x.toFixed(d)+" "+u:"—";

  function updateMetrics(r){
    $("vout").textContent=fmt(r.vout,"V"); $("iout").textContent=fmt(r.iout,"A");
    $("pin").textContent=fmt(r.pin,"W"); $("pout").textContent=fmt(r.pout,"W");
    $("eff").textContent=fmt(r.eta,"%"); $("gain").textContent=fmt(r.gain,"",3);
    $("ilPeak").textContent=fmt(r.ilPeak,"A"); $("ilMin").textContent=fmt(Math.max(0,r.ilMin),"A");
    $("ilRipple").textContent=fmt(r.rippleIL,"A"); $("vRipple").textContent=fmt(r.vRipple,"V");
    $("loss").textContent=fmt(r.totalLoss,"W"); $("error").textContent=fmt(r.error,"%");
    $("mode").textContent=r.mode;
    $("switchState").textContent="RUNNING";
  }

  function drawCircuit(on=false){
    const c=$("circuitCanvas"),x=c.getContext("2d"),w=c.width,h=c.height;
    x.clearRect(0,0,w,h); x.fillStyle=getComputedStyle(document.body).getPropertyValue("--bg");x.fillRect(0,0,w,h);
    x.strokeStyle=getComputedStyle(document.body).getPropertyValue("--text");x.fillStyle=x.strokeStyle;x.lineWidth=4;
    const y=155;
    function line(a,b){x.beginPath();x.moveTo(...a);x.lineTo(...b);x.stroke();}
    function txt(t,a,size=18){x.font=`${size}px Segoe UI`;x.fillText(t,...a);}
    txt("Vin",(30,145)); line([75,y],[135,y]);
    // inductor
    x.beginPath();x.moveTo(135,y);x.lineTo(150,y);for(let i=0;i<4;i++){x.arc(160+i*25,y,10,Math.PI,0,false)}x.lineTo(260,y);x.stroke();txt("L",(190,125),16);
    line([260,y],[350,y]);
    // diode triangle/bar
    x.beginPath();x.moveTo(350,135);x.lineTo(350,175);x.lineTo(385,155);x.closePath();x.stroke();line([390,132],[390,178]);line([390,155],[470,155]);
    txt("D",(360,115),16);
    // output node
    line([470,y],[700,y]);txt("Vout",(705,145));line([700,y],[700,245]);line([700,245],[120,245]);line([120,245],[120,y]);
    // capacitor
    line([560,155],[560,185]);line([540,185],[580,185]);line([540,200],[580,200]);line([560,200],[560,245]);txt("C",(570,195),16);
    // load
    line([630,155],[630,180]);x.beginPath();x.moveTo(615,180);for(let i=0;i<4;i++){x.lineTo(645,195+i*12);x.lineTo(615,207+i*12)}x.stroke();line([630,228],[630,245]);txt("R",(650,210),16);
    // MOSFET
    line([300,155],[300,210]);line([285,210],[315,210]);line([300,210],[300,245]);txt("MOSFET",(250,280),16);
    if(on){x.strokeStyle="#16a34a";x.fillStyle="#16a34a";line([95,145],[130,145]);txt("CURRENT →",(85,75),16)}
    else {x.strokeStyle="#dc2626";x.fillStyle="#dc2626";txt("SWITCH OFF",(360,65),16)}
  }

  function run(){
    const p=BoostSim.params(), errors=BoostSim.validate(p);
    $("validation").textContent=errors.join(" ");
    if(errors.length)return;
    const r=BoostSim.calculate(p);last={p,r};updateMetrics(r);drawCircuit(true);
    $("inductorState").textContent="Inductor: Charging/Discharging";
    $("diodeState").textContent="Diode: Switching";
    $("mosfetState").textContent="MOSFET: PWM";
    WaveformUI.render(p,r);
    clearTimeout(run.timer);
    let on=true,n=0; const period=Math.max(100,Math.round(1000/(p.freq)));
    function anim(){on=!on;drawCircuit(on);$("switchState").textContent=on?"SWITCH ON":"SWITCH OFF";$("switchState").className="badge "+(on?"on":"off");n++;if(n<16)run.timer=setTimeout(anim,period)}
    run.timer=setTimeout(anim,period);
  }

  function addReading(){
    if(!last.r){run();if(!last.r)return}
    const r=last.r,p=last.p,tbody=document.querySelector("#obsTable tbody"),tr=document.createElement("tr");
    const vals=[tbody.children.length+1,p.vin.toFixed(2),(p.duty*100).toFixed(1)+"%",r.vout.toFixed(2),r.iout.toFixed(3),r.pout.toFixed(2),r.eta.toFixed(2)+"%",r.mode,r.error.toFixed(2)+"%"];
    tr.innerHTML=vals.map(v=>`<td>${v}</td>`).join("");tbody.appendChild(tr);
  }
  function exportCSV(){
    const rows=[...document.querySelectorAll("#obsTable tr")].map(r=>[...r.children].map(c=>c.innerText));
    if(rows.length<2){alert("Add at least one reading.");return}
    const csv=rows.map(r=>r.map(v=>`"${v.replaceAll('"','""')}"`).join(",")).join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="boost-converter-observations.csv";a.click();URL.revokeObjectURL(a.href);
  }
  function reset(){document.querySelectorAll("input").forEach(i=>{if(i.id==="vin")i.value=12;if(i.id==="duty")i.value=50;if(i.id==="freq")i.value=20;if(i.id==="inductance")i.value=1;if(i.id==="capacitance")i.value=100;if(i.id==="load")i.value=20;if(i.id==="rs")i.value=.1;if(i.id==="lesr")i.value=.05;if(i.id==="cesr")i.value=.05;if(i.id==="rdson")i.value=.05;if(i.id==="vf")i.value=.7;if(i.id==="dr")i.value=.02;if(i.id==="tr")i.value=50;if(i.id==="tf")i.value=50;if(i.id==="trr")i.value=50;if(i.id==="vgs")i.value=10;if(i.id==="vth")i.value=3;if(i.id==="iinit")i.value=0;if(i.id==="vinit")i.value=0});document.querySelector("#obsTable tbody").innerHTML="";$("validation").textContent="";last={p:null,r:null};drawCircuit(false)}
  document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab,.tab-panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active")}));
  $("runBtn").addEventListener("click",run);$("addBtn").addEventListener("click",addReading);$("csvBtn").addEventListener("click",exportCSV);$("clearTableBtn").addEventListener("click",()=>$("obsTable").querySelector("tbody").innerHTML="");$("resetBtn").addEventListener("click",reset);
  $("waveSelect").addEventListener("change",()=>{if(last.r)WaveformUI.render(last.p,last.r)});$("sweepBtn").addEventListener("click",SweepUI.run);
  $("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");$("themeBtn").textContent=document.body.classList.contains("dark")?"☀ Light":"☾ Theme";if(last.r)WaveformUI.render(last.p,last.r)});
  QuizUI.init();$("quizSubmit").addEventListener("click",QuizUI.submit);drawCircuit(false);
})();
