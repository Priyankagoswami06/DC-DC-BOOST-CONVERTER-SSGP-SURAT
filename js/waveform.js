window.WaveformUI = (() => {
  let chart=null;
  function render(p,r){
    const w=BoostSim.waveforms(p,r);
    const dataMap={
      pwm:["PWM Gate Signal",w.pwm],
      il:["Inductor Current (A)",w.il],
      vout:["Output Voltage (V)",w.vout],
      id:["Diode Current (A)",w.id],
      isw:["MOSFET Current (A)",w.isw],
      vc:["Capacitor Voltage (V)",w.vc]
    };
    const [label,data]=dataMap[document.getElementById("waveSelect").value];
    const ctx=document.getElementById("waveChart");
    if(chart) chart.destroy();
    chart=new Chart(ctx,{type:"line",data:{labels:w.t,datasets:[{label,data,borderWidth:2,pointRadius:0,tension:.12}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true}},
      scales:{x:{title:{display:true,text:"Time (µs)"}},y:{title:{display:true,text:label}}}}});
  }
  return {render};
})();
