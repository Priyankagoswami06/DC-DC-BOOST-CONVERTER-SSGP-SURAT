let waveChart=null, sweepChart=null;
function drawWave(type){
  const r=BoostSim.last; if(!r) return;
  const data=BoostSim.waveform(r,type);
  const labels={gate:"Gate / PWM",il:"Inductor Current iL (A)",vout:"Output Voltage vout (V)",diode:"Diode Current iD (A)",mosfet:"MOSFET Current iS (A)",cap:"Capacitor Current iC (A)",input:"Input Current iIN (A)",inductorVoltage:"Inductor Voltage vL (V)"};
  if(waveChart) waveChart.destroy();
  waveChart=new Chart(document.getElementById("waveChart"),{
    type:"line",data:{datasets:[{label:labels[type],data,borderWidth:2,pointRadius:0,tension:.12}]},
    options:{responsive:true,maintainAspectRatio:false,parsing:false,scales:{x:{type:"linear",title:{display:true,text:"Time (µs)"}},y:{title:{display:true,text:labels[type]}}},plugins:{legend:{display:true}}}
  });
}
function drawSweep(param,start,end,step){
  const base=BoostSim.read(), pts=[];
  for(let x=start; x<=end+step/100; x+=step){
    const p={...base}; p[param]=param==="duty"?x/100:x;
    try{const r=BoostSim.calculate(p);pts.push({x,y:r.vout})}catch(e){}
  }
  if(sweepChart) sweepChart.destroy();
  sweepChart=new Chart(document.getElementById("sweepChart"),{
    type:"line",data:{datasets:[{label:"Vout vs "+param,data:pts,borderWidth:2,pointRadius:3,tension:.12}]},
    options:{responsive:true,maintainAspectRatio:false,parsing:false,scales:{x:{type:"linear",title:{display:true,text:param}},y:{title:{display:true,text:"Vout (V)"}}}}
  });
}