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
var campojogo = [];
// falta adicionar nessa versao: mais cartas e as imagens nelas, comprar carta compra só uma carta por turno, pode se comprar uma carta, atacar e por uma carta por turno, seria legal refazer a pagina inicial
for (let l = 0; l < 2; l++) {
  campojogo[l] = [];
  for (let c = 0; c < 5; c++) {
    campojogo[l][c] = null;
  }
}
// jeito bizarro de fzr matriz
function selecionarCarta(qual, quem) {
  let qualturno = testeturno()
  if (qualturno == quem) {
    let elementos = document.querySelectorAll(".carta.selecionada");
    for (let i = 0; i < elementos.length; i++) {
      elementos[i].classList.remove("selecionada");
    }
    qual.classList.add('selecionada')
  }
}
function comprarCarta(quem) {
  let qualturno = testeturno()
  let turno = document.querySelector('#turno')
  let cont = Number(document.querySelector('#contaturno').dataset.valor)
  let mao = [];

  if (qualturno == quem && turno.dataset.comprou != "sim") {

    if (quem == 'me') {
      mao = document.querySelectorAll("#maome .carta.vazia");
    }
    else {
      mao = document.querySelectorAll("#maop .carta.vazia");
    }

    // turnos normais: uma carta. Primeira rodada (cont 0 e 1) enche a mão toda
    let quantidade = 1;
    if (cont < 2) { // se for antes do segundo turno a quantidade de cartas compradas é igual a mao vazia
      quantidade = mao.length;
    }
    if (mao.length < quantidade) {
      quantidade = mao.length;
    }

    for (let i = 0; i < quantidade; i++) {
      let carta = mao[i];

      for (let j = 0; j < cartas.length; j++) {
        carta.classList.remove(cartas[j].classe);
      }

      let numero = Math.floor(Math.random() * cartas.length);
      carta.classList.add(cartas[numero].classe);

      carta.classList.remove("vazia");
    }

    // só gasta a compra do turno se alguma carta foi comprada
    if (quantidade > 0) {
      turno.dataset.comprou = "sim";
    }
  }
}
function testeturno() {
  let turno = document.querySelector('#turno')
  let qualturno = false
  if (turno.classList.contains("turno-me")) {
    qualturno = "me"
  }
  else {
    qualturno = "op"
  }
  return (qualturno)
}
function deploy(qual, quem, posicao) {
  let qualturno = testeturno()
  let turno = document.querySelector('#turno')
  let mao = [];
  let encontrada = null;
  let linha = 0;

  // restrição: tem que ser o seu turno e você ainda não pode ter lançado carta (turno.dataset.jogou)
  if (qualturno == quem && turno.dataset.jogou != "sim") {

    if (quem == 'me') {
      mao = document.querySelectorAll("#maome .carta.selecionada");
      linha = 1;
    }
    if (quem == 'op') {
      mao = document.querySelectorAll("#maop .carta.selecionada");
      linha = 0;
    }

    if (mao.length > 0 && qual.classList.contains("ocupada") == false) {
      let carta = mao[0];

      for (let i = 0; i < cartas.length; i++) {
        if (carta.classList.contains(cartas[i].classe)) {
          encontrada = cartas[i]; // a carta é o objeto por conta das demais manipulações necessarias para adicionar uma copia do objeto na matriz
        }
      }

      // magias não vão para a zona de monstros (elas usam o campo de cartas mágicas)
      if (encontrada != null && encontrada.tipo != "magica") {
        qual.classList.add(encontrada.classe);
        qual.classList.add("ocupada");
        qual.dataset.posicao = posicao
        // passa por valor
        campojogo[linha][posicao] = {
          classe: encontrada.classe,
          vida: encontrada.vida,
          ataque: encontrada.ataque,
          tipo: encontrada.tipo
        };

        carta.classList.remove("selecionada");
        carta.classList.add("vazia");

        turno.dataset.jogou = "sim";
        exodiaObliterar(quem)
        verificarFimDeTurno();
      }
    }
  }
}
function trocarTurno() {
  let turno = document.querySelector('#turno')
  let cont = document.querySelector('#contaturno')
  cont.dataset.valor = Number(cont.dataset.valor) + 1;
  cont.textContent = "Turno:" + cont.dataset.valor
  // reseta as acoes do jogador
  turno.dataset.comprou = "nao";
  turno.dataset.jogou = "nao";
  turno.dataset.atacou = "nao";
  turno.dataset.magica = "nao";

  let atacantes = document.querySelectorAll(".zona.atacante");
  for (let i = 0; i < atacantes.length; i++) {
    atacantes[i].classList.remove("atacante");
  } // remove o highlight de ataque

  let selecionadas = document.querySelectorAll(".carta.selecionada");
  for (let i = 0; i < selecionadas.length; i++) {
    selecionadas[i].classList.remove("selecionada");
  }// remove todas as selecionadas anteriormente

  if (turno.classList.contains("turno-me")) {
    turno.classList.remove("turno-me");
    turno.classList.add("turno-op");
    turno.textContent = "Turno do oponente";
  } // troca a classe do botao de turno para sinalizar 
  else {
    turno.classList.remove("turno-op");
    turno.classList.add("turno-me");
    turno.textContent = "Seu turno";
  }

}

function ataq(qual, quem, posicao) {
  let qualturno = testeturno()
  let turno = document.querySelector('#turno')
  let atacantes = document.querySelectorAll(".zona.atacante");
  let linhaAtacante = 0;
  let linhaAlvo = 0;
  let idPlacar = "";
  let fim = false;

  // tem o mesmo dataset do botao turno pra guardar a informação sobre o ataque, o alvo (quem) tem q ter a classe css ocupado também
  if (qualturno != quem && turno.dataset.atacou != "sim" &&
    qual.classList.contains("ocupada") && atacantes.length > 0) {

    if (qualturno == 'me') {
      linhaAtacante = 1;
      linhaAlvo = 0;
      idPlacar = "pontosop"; // determina de qual linha vai partir o ataque para manipular na matriz, o id placar é pra saber qual é pra diminuir, por isso é oposto ao turno do atacante
    }
    else {
      linhaAtacante = 0;
      linhaAlvo = 1;
      idPlacar = "pontos"; //mesma coisa do comentario de cima
    }

    let zonaAtacante = atacantes[0];
    let colunaAtacante = Number(zonaAtacante.dataset.posicao); // dataset vira string, q bobeira

    let atacante = campojogo[linhaAtacante][colunaAtacante];// manipulação dos objetos (passagem por parametro ja que vai mudar os valores na matriz também)
    let alvo = campojogo[linhaAlvo][posicao];// posicao é o 0 a 4 no html pra ,dnv, pra saber a posicao na matriz

    if (atacante != null && alvo != null) {
      alvo.vida = alvo.vida - atacante.ataque;

      if (alvo.vida <= 0) {
        campojogo[linhaAlvo][posicao] = null;
        qual.classList.remove(alvo.classe);
        qual.classList.remove("ocupada");

        // o que passou da vida do monstro vira dano nos pontos de vida do jogador, mesmo que no yu gi oh seja pelo ataque mas fzr oq, nao acho q ficaria intuitivo
        let excedente = 0 - alvo.vida;
        let placar = document.getElementById(idPlacar);
        let pontos = Number(placar.textContent) - excedente;

        if (pontos <= 0) {
          pontos = 0;
          fim = true;
        }
        placar.textContent = pontos;
      }

      // o atacante já atacou, tira a classe css de atacante e checa se o jogo acabou, se nao ele muda o valor de .atacou no dataset do botao pra sinalizar q ja jogou
      zonaAtacante.classList.remove("atacante");

      if (fim == true) {
        fimDeJogo(qualturno);
      }
      else {
        turno.dataset.atacou = "sim";
        verificarFimDeTurno();
      }
    }
  }
}
function selecionarmonstro(qual, quem) {
  let qualturno = testeturno()
  let atacantes = document.querySelectorAll(".zona.atacante");
  let selecionadas = document.querySelectorAll(".carta.selecionada");

  if (qualturno == quem && qual.classList.contains("ocupada")) {

    // só um atacante por vez
    for (let i = 0; i < atacantes.length; i++) {
      atacantes[i].classList.remove("atacante");
    }

    // tira a seleção da mão, para não haver dois destaques ao mesmo tempo
    for (let i = 0; i < selecionadas.length; i++) {
      selecionadas[i].classList.remove("selecionada");
    }

    qual.classList.add("atacante");
  }
}
// verificar se o jogador ja jogou uma carta no campo e atacaou (passa turno automatico)
function verificarFimDeTurno() {
  let turno = document.querySelector('#turno');

  if (turno.dataset.jogou == "sim" && turno.dataset.atacou == "sim") {
    trocarTurno();
  }
}
//desligar os botoes eh bom, confia.
function fimDeJogo(vencedor) {
  let turno = document.querySelector('#turno')
  let botoes = document.querySelectorAll("button");

  for (let i = 0; i < botoes.length; i++) {
    botoes[i].disabled = true;
  }

  if (vencedor == 'me') {
    turno.textContent = "Você venceu!";
  }
  else {
    turno.textContent = "O oponente venceu!";
  }
}
var dicas = [
  "Clique no seu baralho para comprar uma carta. Só é possível comprar uma por turno.",
  "Selecione uma carta da sua mão e clique em uma zona livre do seu lado para lançá-la.",
  "Clique em um monstro seu no campo para marcá-lo como atacante e depois no monstro do oponente.",
  "Cada turno permite lançar uma carta e atacar uma vez. Depois das duas ações, o turno passa sozinho.",
  "Sem ações possíveis? Use o botão do meio para passar o turno.",
  "Se o ataque for maior que a vida do monstro, o que sobrar vira dano nos pontos de vida do oponente.",
  "O dragão branco tem a maior vida do baralho: 3000 pontos.",
  "Taiwan nao é um país",
  "Exodia, Obliterar!!",
  "Em um conjunto finito, qualquer permutação de elementos pode ser revertida à configuração original!",
  "Kennedy was assassinated in Dallas at 12:30 p.m. Central Standard Time on November 22, 1963.",
  "o criador desse jogo divide aniversario com personalidades tais como Anne Hathaway ,Ryan Gosling, Charles Manson",
  "Esse jogo nao foi programado em Assembly.",
  " 1 Atm == 10^5 Pa volta true ",
  "De feliz aniversario a seus amigos e seja uma boa pessoa!!",
  "chega de dicas, voce ja entendeu. JOGA O JOGO!"
];

function mostrarDica() {
  let caixa = document.getElementById("caixa-dica");
  let indice = Number(caixa.dataset.indice);

  if (indice >= dicas.length) {
    indice = 0;
  }

  document.getElementById("texto-dica").textContent = dicas[indice];
  document.getElementById("contador-dica").textContent = "Dica " + (indice + 1) + " de " + dicas.length;

  caixa.classList.add("aberta");
  caixa.dataset.indice = indice + 1;
}

function fecharDica() {
  document.getElementById("caixa-dica").classList.remove("aberta");
}
// descobre qual é a carta por meio de comparar todas as classes das cartas no registro com a propriedade classlist da carta, retorna o objeto
function descobrirCarta(elemento) { // elemento pode ser qualquer carta
  let encontrada = null;

  for (let i = 0; i < cartas.length; i++) {
    if (elemento.classList.contains(cartas[i].classe)) {
      encontrada = cartas[i];
    }
  }

  return encontrada;
}

function enviarAoCemiterio(quem, classe) { // classe css guardada no registro e quem é o id
  let botao = document.getElementById("cemiterio" + quem);
  let topo = document.getElementById("topo" + quem);
  let contador = document.getElementById("qtd" + quem); //o quem define se o id é do oponente ou seu, o parametro recebe 'me' ou 'op'

  // tira a carta que estava por cima, removendo todas as classes das cartas e depois adicionando a especifica no elemento topo do cemiterio
  for (let i = 0; i < cartas.length; i++) {
    topo.classList.remove(cartas[i].classe);
  }
  topo.classList.add(classe);

  botao.dataset.qtd = Number(botao.dataset.qtd) + 1; // contador de cartas descartas com a propriedade dataset
  contador.textContent = botao.dataset.qtd;
}

function descartar(quem) { // pega uma carta com a classe css .selecionada , poe a classe vazia nela e poe a classe css no registro dela no cemiterio
  let qualturno = testeturno();
  let selecionadas = [];

  if (qualturno == quem) {

    if (quem == 'me') { // define de qual mao a carta selecionada vai ser pega para o descarte com base no turno atual
      selecionadas = document.querySelectorAll("#maome .carta.selecionada");
    }
    else {
      selecionadas = document.querySelectorAll("#maop .carta.selecionada");
    }

    if (selecionadas.length > 0) { // se tiver alguma carta delecionada 
      let carta = selecionadas[0];
      let registro = descobrirCarta(carta); // compara a lista de classes css da carta com a lista de classes no registro como eu disse na funcao msm e volta o objeto

      if (registro != null) {
        enviarAoCemiterio(quem, registro.classe);  // coloca no cemiterio de um dois jogadores a classe do objeto q descobrir carta pegou

        carta.classList.remove("selecionada"); // faz a carta ficar vazia, tira a classe selecionada e poe a classe vazia
        carta.classList.add("vazia");
      }
    }
  }
}

function jogarMagica(qual, quem) {
  let qualturno = testeturno();
  let turno = document.querySelector('#turno');
  let selecionadas = [];

  if (qualturno == quem) {

    if (qual.classList.contains("ocupada")) {
      let usada = descobrirCarta(qual);

      if (usada != null) {
        enviarAoCemiterio(quem, usada.classe);
        qual.classList.remove(usada.classe);
        qual.classList.remove("ocupada");
      }
    }
    else if (turno.dataset.magica != "sim") {

      if (quem == 'me') {
        selecionadas = document.querySelectorAll("#maome .carta.selecionada");
      }
      else {
        selecionadas = document.querySelectorAll("#maop .carta.selecionada");
      }

      if (selecionadas.length > 0) {
        let carta = selecionadas[0];
        let magia = descobrirCarta(carta);

        if (magia != null && magia.tipo == "magica") {
          qual.classList.add(magia.classe);
          qual.classList.add("ocupada");

          carta.classList.remove("selecionada");
          carta.classList.add("vazia");

          turno.dataset.magica = "sim";
          aplicarEfeito(magia, quem);
        }
      }
    }
  }
}

// efeitos: "dano" tira pontos do adversário, "cura" devolve pontos a quem jogou,
// "comprar" libera mais uma compra no turno
function aplicarEfeito(magia, quem) {
  let turno = document.querySelector('#turno');
  let idAdversario = "pontos";
  let idProprio = "pontosop";

  if (quem == 'me') {
    idAdversario = "pontosop";
    idProprio = "pontos";
  }

  if (magia.efeito == "dano") {
    let placar = document.getElementById(idAdversario);
    let pontos = Number(placar.textContent) - magia.valor;

    if (pontos <= 0) {
      pontos = 0;
      placar.textContent = pontos;
      fimDeJogo(quem);
    }
    else {
      placar.textContent = pontos;
    }
  }

  if (magia.efeito == "cura") {
    let placar = document.getElementById(idProprio);
    placar.textContent = Number(placar.textContent) + magia.valor;
  }

  if (magia.efeito == "comprar") {
    turno.dataset.comprou = "nao";
  }
}
function exodiaObliterar(quem) {
  let cont = 0
  let who = testeturno()
  let linha
  if (who == quem) {
    if (quem == 'op') {
      linha = 0
    }
    else {
      linha = 1
    }
    for (let i = 0; i < campojogo[linha].length; i++) {
      if (campojogo[linha][i].tipo == "exodia") {
        cont++
      }
    }
    if (cont == 5) {
      fimDeJogo(quem)

    }
  }
}