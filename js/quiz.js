const quiz=[
 {q:"For an ideal boost converter in CCM, Vout is:",a:["Vin·D","Vin/(1-D)","Vin(1-D)","Vin/D"],c:1},
 {q:"When the MOSFET is ON, the inductor mainly:",a:["Discharges to load","Stores energy","Blocks current","Becomes open circuit"],c:1},
 {q:"When the MOSFET is OFF, the diode normally:",a:["Conducts energy to output","Shorts the source","Always blocks","Turns the capacitor off"],c:0},
 {q:"If duty cycle increases, ideal boost output voltage:",a:["Decreases","Does not change","Increases","Becomes zero"],c:2},
 {q:"CCM means inductor current:",a:["Always zero","Never exists","Remains above zero","Only flows in diode"],c:2}
];
function loadQuiz(){
  const box=document.getElementById("quizBox");box.innerHTML=quiz.map((x,i)=>`<div class="quiz-question">${i+1}. ${x.q}</div>`+x.a.map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${a}</label>`).join("")).join("");
}
document.getElementById("checkQuiz").onclick=()=>{let score=0;quiz.forEach((x,i)=>{const v=document.querySelector(`input[name=q${i}]:checked`);if(v&&Number(v.value)===x.c)score++});document.getElementById("quizScore").textContent=`Score: ${score}/${quiz.length}`};
loadQuiz();
