window.QuizUI = (() => {
  const qs=[
    ["The ideal CCM boost voltage ratio is:",["D","1/(1-D)","1-D","D/(1-D)"],1],
    ["When the MOSFET is ON, the inductor primarily:",["Releases energy","Stores energy","Blocks current","Discharges the capacitor"],1],
    ["Duty cycle is:",["Toff/T","Ton/T","T/Ton","fs/T"],1],
    ["A boost converter normally produces:",["Lower DC voltage","Higher DC voltage","AC voltage","Only current"],1],
    ["CCM means inductor current:",["Is always zero","Never changes","Does not reach zero","Is negative"],2],
    ["The capacitor mainly helps:",["Generate PWM","Smooth output voltage","Switch the MOSFET","Increase frequency"],1],
    ["Efficiency is:",["Pin/Pout","Pout/Pin × 100%","Vout/Vin","Iout/Iin"],1],
    ["Increasing duty cycle in ideal CCM generally:",["Decreases Vout","Increases Vout","Makes Vout zero","Does nothing"],1],
    ["Inductor current ripple approximately depends on:",["Vin, D, L and fs","Only R","Only C","Only VF"],0],
    ["A diode forward drop is a:",["Gain source","Practical loss mechanism","PWM signal","Load resistance"],1]
  ];
  function init(){
    const f=document.getElementById("quizForm");
    f.innerHTML=qs.map((q,i)=>`<div class="question"><b>${i+1}. ${q[0]}</b>${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("");
  }
  function submit(){
    let score=0; qs.forEach((q,i)=>{const x=document.querySelector(`input[name=q${i}]:checked`);if(x&&Number(x.value)===q[2])score++;});
    document.getElementById("quizResult").textContent=`Score: ${score}/${qs.length} (${Math.round(score/qs.length*100)}%)`;
  }
  return {init,submit};
})();
