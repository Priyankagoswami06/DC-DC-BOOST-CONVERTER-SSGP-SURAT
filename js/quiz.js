const quiz=[
 {q:"For an ideal boost converter in CCM, Vout is:",a:["Vin·D","Vin/(1-D)","Vin(1-D)","Vin/D"],c:1},
 {q:"When the MOSFET is ON, the inductor mainly:",a:["Discharges to load","Stores energy","Blocks current","Becomes open circuit"],c:1},
 {q:"When the MOSFET is OFF, the diode normally:",a:["Conducts energy to output","Shorts the source","Always blocks","Turns the capacitor off"],c:0},
 {q:"In DCM, after inductor current reaches zero:",a:["Current becomes negative","A third zero-current interval occurs","MOSFET must stay ON","Output voltage becomes zero"],c:1},
 {q:"Critical inductance separates:",a:["AC and DC","CCM and DCM","Input and output","Gate and drain"],c:1},
 {q:"If L is reduced below Lcrit under the automatic selector, the converter tends to enter:",a:["CCM","DCM","Open circuit","Short circuit"],c:1}
];
function loadQuiz(){
  const box=document.getElementById("quizBox");
  box.innerHTML=quiz.map((x,i)=>`<div class="quiz-question">${i+1}. ${x.q}</div>`+
    x.a.map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${a}</label>`).join("")).join("");
}
document.addEventListener("DOMContentLoaded",()=>{
  loadQuiz();
  document.getElementById("checkQuiz").onclick=()=>{
    let score=0;quiz.forEach((x,i)=>{const v=document.querySelector(`input[name="q${i}"]:checked`);if(v&&Number(v.value)===x.c)score++});
    document.getElementById("quizScore").textContent=`Score: ${score}/${quiz.length}`;
  };
});
