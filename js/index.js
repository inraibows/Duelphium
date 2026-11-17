function stringfyojetos(){
  let cartas = [
  { classe: "mago-negro", vida: 2500, ataque: 2500 },
  { classe: "dragao-negro", vida: 2400, ataque: 2400 },
  { classe: "dragao-branco", vida: 3000, ataque: 3000 },
  { classe: "guerreiro", vida: 1800, ataque: 1800 },
  { classe: "exodia-cabeca", vida: 1000, ataque: 1000, tipo: "exodia" },
  { classe: "exodia-braco-direito", vida: 200, ataque: 200, tipo: "exodia" },
  { classe: "exodia-braco-esquerdo", vida: 200, ataque: 200, tipo: "exodia" },
  { classe: "exodia-perna-direita", vida: 200, ataque: 200, tipo: "exodia" },
  { classe: "exodia-perna-esquerda", vida: 200, ataque: 200, tipo: "exodia" },
  { classe: "raio-divino", tipo: "magica", efeito: "dano", valor: 500 },
  { classe: "cura-sagrada", tipo: "magica", efeito: "cura", valor: 500 },
  { classe: "pote-da-ganancia", tipo: "magica", efeito: "comprar", valor: 0 }
]
if(localStorage.getItem("cartas") == null){
localStorage.setItem("cartas",JSON.stringify(cartas))
}
}
function guardarcampo() {
  let campojogo = [];
  for (let l = 0; l < 2; l++) {
    campojogo[l] = [];
    for (let c = 0; c < 5; c++) {
      campojogo[l][c] = null;
    }
  }
  if (localStorage.getItem("campojogo") == null) {
    localStorage.setItem("campojogo", JSON.stringify(campojogo));
  }
}
function lerNomes(){
let nome1 = document.getElementById("nome-me").value
let nome2 = document.getElementById("nome-op").value
if (nome1 === "") nome1 = "Jogador 1";
  if (nome2 === "") nome2 = "Jogador 2";
  localStorage.setItem("nomes", JSON.stringify({ me: nome1, op: nome2 }));
  msg.textContent = nome1 + " vs " + nome2 + " confirmados!";
   
 
}
