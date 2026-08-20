window.SweepUI = (() => {
  let chart=null;
  function run(){
    const base=BoostSim.params(), param=document.getElementById("sweepParam").value;
    let start=Number(document.getElementById("sweepStart").value), end=Number(document.getElementById("sweepEnd").value), step=Number(document.getElementById("sweepStep").value);
    if(!(step>0) || end<start){alert("Invalid sweep range.");return;}
    const labels=[], values=[];
    for(let x=start; x<=end+1e-9; x+=step){
      const p={...base};
      if(param==="duty") p.duty=x/100;
      if(param==="vin") p.vin=x;
      if(param==="load") p.R=x;
      if(param==="freq") p.freq=x*1000;
      const e=BoostSim.validate(p); if(e.length) continue;
      const r=BoostSim.calculate(p); labels.push(Number(x.toFixed(4))); values.push(Number(r.vout.toFixed(4)));
    }
    if(chart) chart.destroy();
    chart=new Chart(document.getElementById("sweepChart"),{type:"line",data:{labels,datasets:[{label:"Vout (V)",data:values,borderWidth:2,pointRadius:3,tension:.12}]},
      options:{responsive:true,maintainAspectRatio:false,scales:{x:{title:{display:true,text:"Sweep value"}},y:{title:{display:true,text:"Output Voltage (V)"}}}}});
  }
  return {run};
})();
