// slide

const wrap = document.querySelector(".slider-wrap");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slider figure");
const botaoAnterior = document.querySelector(".slider-btn.prev");
const botaoProximo = document.querySelector(".slider-btn.next");

let slideAtual = 0;
let temporizador;

// vai até o slide de número "numero" (começa em 0)
function mostrarSlide(numero) {
  if (numero >= slides.length) {
    numero = 0;
  }
  if (numero < 0) {
    numero = slides.length - 1;
  }

  slider.scrollTo({
    left: numero * slider.clientWidth,
    behavior: "smooth",
  });
}

// cria uma bolinha para cada slide
const bolinhas = document.createElement("div");
bolinhas.className = "slider-dots";

for (let i = 0; i < slides.length; i++) {
  const bolinha = document.createElement("button");
  bolinha.setAttribute("aria-label", "Ir para o slide " + (i + 1));
  bolinha.addEventListener("click", function () {
    mostrarSlide(i);
  });
  bolinhas.appendChild(bolinha);
}

wrap.appendChild(bolinhas);

// marca a bolinha do slide que está aparecendo
function atualizarBolinhas() {
  for (let i = 0; i < bolinhas.children.length; i++) {
    if (i === slideAtual) {
      bolinhas.children[i].classList.add("ativo");
    } else {
      bolinhas.children[i].classList.remove("ativo");
    }
  }
}

// sempre que o slider rolar, descobre qual slide está visível
slider.addEventListener("scroll", function () {
  slideAtual = Math.round(slider.scrollLeft / slider.clientWidth);
  atualizarBolinhas();
});

// botões de anterior e próximo
botaoProximo.addEventListener("click", function () {
  mostrarSlide(slideAtual + 1);
});

botaoAnterior.addEventListener("click", function () {
  mostrarSlide(slideAtual - 1);
});

// troca automática a cada 5 segundos
function pararTroca() {
  clearInterval(temporizador);
}

function iniciarTroca() {
  pararTroca();

  // respeita quem desativou animações no sistema
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  temporizador = setInterval(function () {
    mostrarSlide(slideAtual + 1);
  }, 5000);
}

// pausa quando o usuário está usando o slider
wrap.addEventListener("mouseenter", pararTroca);
wrap.addEventListener("mouseleave", iniciarTroca);
wrap.addEventListener("focusin", pararTroca);
wrap.addEventListener("focusout", iniciarTroca);
wrap.addEventListener("touchstart", pararTroca);
wrap.addEventListener("touchend", iniciarTroca);

atualizarBolinhas();
iniciarTroca();

// menu hamburguer

const botaoMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");
const linksMenu = menu.querySelectorAll("a");

function abrirMenu() {
  menu.classList.add("aberto");
  botaoMenu.setAttribute("aria-expanded", "true");
  botaoMenu.setAttribute("aria-label", "Fechar menu");
}

function fecharMenu() {
  menu.classList.remove("aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
}

botaoMenu.addEventListener("click", function () {
  if (menu.classList.contains("aberto")) {
    fecharMenu();
  } else {
    abrirMenu();
  }
});

// fecha o menu ao clicar em um link
for (let i = 0; i < linksMenu.length; i++) {
  linksMenu[i].addEventListener("click", fecharMenu);
}

// fecha se a tela ficar grande de novo
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    fecharMenu();
  }
});

// formulário de contato

const formulario = document.querySelector("#form-contato");
const campoNome = document.querySelector("#nome");
const campoEmail = document.querySelector("#email");
const campoAssunto = document.querySelector("#assunto");
const campoMensagem = document.querySelector("#mensagem");
const mensagemSucesso = document.querySelector("#sucesso");

// mostra o erro embaixo do campo
function mostrarErro(campo, texto) {
  const caixa = campo.parentElement;
  caixa.classList.add("invalido");
  caixa.classList.remove("valido");
  caixa.querySelector(".erro").textContent = texto;
  campo.setAttribute("aria-invalid", "true");
}

// marca o campo como correto e apaga o erro
function marcarValido(campo) {
  const caixa = campo.parentElement;
  caixa.classList.add("valido");
  caixa.classList.remove("invalido");
  caixa.querySelector(".erro").textContent = "";
  campo.setAttribute("aria-invalid", "false");
}

// cada função devolve true (campo certo) ou false (campo com erro)
function validarNome() {
  const valor = campoNome.value.trim();

  if (valor === "") {
    mostrarErro(campoNome, "Digite seu nome.");
    return false;
  }
  if (valor.length < 3) {
    mostrarErro(campoNome, "O nome precisa ter pelo menos 3 letras.");
    return false;
  }
  if (/[0-9]/.test(valor)) {
    mostrarErro(campoNome, "O nome não pode ter números.");
    return false;
  }

  marcarValido(campoNome);
  return true;
}

function validarEmail() {
  const valor = campoEmail.value.trim();
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (valor === "") {
    mostrarErro(campoEmail, "Digite seu e-mail.");
    return false;
  }
  if (!formatoEmail.test(valor)) {
    mostrarErro(campoEmail, "Digite um e-mail válido, como nome@email.com.");
    return false;
  }

  marcarValido(campoEmail);
  return true;
}

function validarAssunto() {
  if (campoAssunto.value === "") {
    mostrarErro(campoAssunto, "Escolha um assunto.");
    return false;
  }

  marcarValido(campoAssunto);
  return true;
}

function validarMensagem() {
  const valor = campoMensagem.value.trim();

  if (valor === "") {
    mostrarErro(campoMensagem, "Escreva sua mensagem.");
    return false;
  }
  if (valor.length < 10) {
    mostrarErro(campoMensagem, "A mensagem precisa ter pelo menos 10 letras.");
    return false;
  }
  if (valor.length > 500) {
    mostrarErro(campoMensagem, "A mensagem pode ter no máximo 500 letras.");
    return false;
  }

  marcarValido(campoMensagem);
  return true;
}

campoNome.addEventListener("blur", validarNome);
campoEmail.addEventListener("blur", validarEmail);
campoAssunto.addEventListener("change", validarAssunto);
campoMensagem.addEventListener("blur", validarMensagem);

// depois que um campo deu erro, revalida enquanto o usuário digita
campoNome.addEventListener("input", function () {
  if (campoNome.parentElement.classList.contains("invalido")) {
    validarNome();
  }
});

campoEmail.addEventListener("input", function () {
  if (campoEmail.parentElement.classList.contains("invalido")) {
    validarEmail();
  }
});

campoMensagem.addEventListener("input", function () {
  if (campoMensagem.parentElement.classList.contains("invalido")) {
    validarMensagem();
  }
});

// valida tudo e só aceita se não houver erros
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nomeOk = validarNome();
  const emailOk = validarEmail();
  const assuntoOk = validarAssunto();
  const mensagemOk = validarMensagem();

  if (!nomeOk || !emailOk || !assuntoOk || !mensagemOk) {
    // leva o usuário até o primeiro campo com erro
    const primeiroErro = formulario.querySelector(
      ".invalido input, .invalido select, .invalido textarea",
    );
    primeiroErro.focus();
    return;
  }

  formulario.reset();

  const caixas = formulario.querySelectorAll(".campo");
  for (let i = 0; i < caixas.length; i++) {
    caixas[i].classList.remove("valido");
  }

  mensagemSucesso.hidden = false;
  setTimeout(function () {
    mensagemSucesso.hidden = true;
  }, 6000);
});

/* animação de rolagem */

const secoes = document.querySelectorAll(".tema, .contato");

const observador = new IntersectionObserver(
  function (entradas) {
    for (let i = 0; i < entradas.length; i++) {
      if (entradas[i].isIntersecting) {
        entradas[i].target.classList.add("visivel");
        observador.unobserve(entradas[i].target); // anima só uma vez
      }
    }
  },
  { threshold: 0.1 },
);

for (let i = 0; i < secoes.length; i++) {
  secoes[i].classList.add("revelar");
  observador.observe(secoes[i]);
}
