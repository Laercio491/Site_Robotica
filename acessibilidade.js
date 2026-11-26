const aumentarFonte = document.getElementById("aumentar-fonte");
const fontePadrao = document.getElementById("fonte-padrao");
const diminuirFonte = document.getElementById("diminuir-fonte");
const modoClaro = document.getElementById("modo-claro");

let tamanhoFonte = Number(localStorage.getItem("tamanhoFonte")) || 16;
let temaClaro = localStorage.getItem("temaClaro") === "true";

function aplicarAcessibilidade() {
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;

    document.body.classList.toggle("modo-claro", temaClaro);

    if (modoClaro) {
        modoClaro.textContent = temaClaro ? "☾" : "☀";
    }
}

aumentarFonte?.addEventListener("click", () => {
    tamanhoFonte = Math.min(tamanhoFonte + 2, 30);
    localStorage.setItem("tamanhoFonte", tamanhoFonte);
    aplicarAcessibilidade();
});

fontePadrao?.addEventListener("click", () => {
    tamanhoFonte = 16;
    localStorage.setItem("tamanhoFonte", tamanhoFonte);
    aplicarAcessibilidade();
});

diminuirFonte?.addEventListener("click", () => {
    tamanhoFonte = Math.max(tamanhoFonte - 2, 10);
    localStorage.setItem("tamanhoFonte", tamanhoFonte);
    aplicarAcessibilidade();
});

modoClaro?.addEventListener("click", () => {
    temaClaro = !temaClaro;
    localStorage.setItem("temaClaro", temaClaro);
    aplicarAcessibilidade();
});

aplicarAcessibilidade();
