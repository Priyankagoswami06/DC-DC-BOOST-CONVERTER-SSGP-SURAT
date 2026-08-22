let waveChart=null, sweepChart=null;

function drawWave(type){
  const r=window.BoostSimResult; if(!r) return;
  const data=BoostSim.waveform(r,type);
  const labels={
    gate:"Gate / PWM",il:"Inductor Current iL (A)",vout:"Output Voltage vout (V)",
    diode:"Diode Current iD (A)",mosfet:"MOSFET Current iS (A)",cap:"Capacitor Current iC (A)",
    input:"Input Current iIN (A)",inductorVoltage:"Inductor Voltage vL (V)"
  };
  if(waveChart) waveChart.destroy();
  const vals=data.map(d=>d.y), ymin=Math.min(...vals), ymax=Math.max(...vals);
  const span=Math.max(ymax-ymin,1);
  waveChart=new Chart(document.getElementById("waveChart"),{
    type:"line",
    data:{datasets:[
      {label:labels[type],data,borderWidth:2,pointRadius:0,tension:.08},
      {label:"Live Cursor",data:[{x:0,y:ymin-span*.05},{x:0,y:ymax+span*.05}],borderWidth:2,pointRadius:0,borderDash:[5,5],tension:0}
    ]},
    options:{responsive:true,maintainAspectRatio:false,parsing:false,animation:false,
      scales:{x:{type:"linear",title:{display:true,text:"Time (µs)"}},y:{title:{display:true,text:labels[type]}}},
      plugins:{legend:{display:true}}
    }
  });
}

function updateWaveCursor(phase){
  if(!waveChart || !window.BoostSimResult) return;
  const r=window.BoostSimResult;
  const periodUs=r.T*1e6;
  const x=phase*periodUs;
  const ds=waveChart.data.datasets[0].data;
  const ys=ds.map(d=>d.y);
  const lo=Math.min(...ys), hi=Math.max(...ys);
  waveChart.data.datasets[1].data=[{x,y:lo},{x,y:hi}];
  waveChart.update("none");
  const el=document.getElementById("scopeCursor");
  const ph=document.getElementById("phasePercent");
  if(el) el.textContent=x.toFixed(2)+" µs";
  if(ph) ph.textContent=(phase*100).toFixed(1)+"%";
}

function drawSweep(param,start,end,step){
  const base=BoostSim.read(), pts=[], modes=[];
  if(!Number.isFinite(step)||step<=0) return;
  for(let x=start; x<=end+step/100; x+=step){
    const p={...base};
    if(param==="duty") p.d=x/100;
    else if(param==="fs") p.fs=x*1000;
    else if(param==="L") p.L=x/1000;
    else if(param==="C") p.C=x*1e-6;
    else p[param]=x;
    try{const r=BoostSim.calculate(p);pts.push({x,y:r.vout});modes.push(r.mode)}catch(e){}
  }
  if(sweepChart) sweepChart.destroy();
  sweepChart=new Chart(document.getElementById("sweepChart"),{
    type:"line",data:{datasets:[{label:"Vout vs "+param,data:pts,borderWidth:2,pointRadius:3,tension:.12}]},
    options:{responsive:true,maintainAspectRatio:false,parsing:false,
      scales:{x:{type:"linear",title:{display:true,text:param}},y:{title:{display:true,text:"Vout (V)"}}},
      plugins:{legend:{display:true}}
    }
  });
}