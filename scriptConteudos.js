
import * as prismic from "https://cdn.jsdelivr.net/npm/@prismicio/client@7/+esm";

const client = prismic.createClient("site-autobots");

const container = document.getElementById("listaCategorias");
const modal = document.getElementById("modal-detalhes");
const modalPost = document.getElementById("modal-post");
const fecharModal = document.getElementById("fechar-modal");

function texto(campo) {
    if (Array.isArray(campo)) {
        return prismic.asText(campo);
    }

    return campo || "";
}

async function carregarCategorias() {
    try {
        const categorias = await client.getAllByType("category");
        const destaques = await client.getAllByType("destaques");

        container.innerHTML = "";

        if (categorias.length === 0) {
            container.innerHTML = "<p class='carregando'>Nenhuma categoria cadastrada.</p>";
            return;
        }

        const abas = document.createElement("div");
        abas.className = "categorias-abas";

        const areaConteudos = document.createElement("div");
        areaConteudos.className = "categorias-conteudo";

        container.appendChild(abas);
        container.appendChild(areaConteudos);

        categorias.forEach((categoria, index) => {
            const idCategoria = categoria.id;
            const nomeCategoria = texto(categoria.data.tipo);

            const botao = document.createElement("button");
            botao.className = "categoria-aba";
            botao.textContent = nomeCategoria;

            const painel = document.createElement("section");
            painel.className = "categoria-painel";

            if (index === 0) {
                botao.classList.add("ativa");
                painel.classList.add("ativo");
            }

            const lista = document.createElement("div");
            lista.className = "lista-conteudos";

            const destaquesCategoria = destaques.filter(destaque =>
                destaque.data.category?.id === idCategoria
            );

            destaquesCategoria.forEach(destaque => {
                const titulo = texto(destaque.data.title);
                const resumo = texto(destaque.data.resumo);

                const item = document.createElement("div");
                item.className = "item-conteudo";

                if (destaque.data.image?.url) {
                    const imagem = document.createElement("img");
                    imagem.src = destaque.data.image.url;
                    imagem.alt = titulo;
                    item.appendChild(imagem);
                }

                const informacoes = document.createElement("div");
                informacoes.className = "item-conteudo-info";

                const h3 = document.createElement("h3");
                h3.textContent = titulo;

                const p = document.createElement("p");
                p.textContent = resumo;

                informacoes.appendChild(h3);
                informacoes.appendChild(p);

                const botaoDetalhes = document.createElement("button");
                botaoDetalhes.className = "btn-detalhes";
                botaoDetalhes.textContent = "Ver detalhes";

                botaoDetalhes.addEventListener("click", () => {
                    abrirModal(destaque);
                });

                item.appendChild(informacoes);
                item.appendChild(botaoDetalhes);

                lista.appendChild(item);
            });

            if (destaquesCategoria.length === 0) {
                lista.innerHTML = "<p class='carregando'>Nenhum conteúdo nesta categoria.</p>";
            }

            painel.appendChild(lista);

            botao.addEventListener("click", () => {
                document.querySelectorAll(".categoria-aba").forEach(aba => {
                    aba.classList.remove("ativa");
                });

                document.querySelectorAll(".categoria-painel").forEach(painel => {
                    painel.classList.remove("ativo");
                });

                botao.classList.add("ativa");
                painel.classList.add("ativo");
            });

            abas.appendChild(botao);
            areaConteudos.appendChild(painel);
        });

    } catch (erro) {
        console.error("Erro ao carregar conteúdos:", erro);
        container.innerHTML = "<p class='carregando'>Erro ao carregar as categorias e conteúdos.</p>";
    }
}

function abrirModal(destaque) {
    const titulo = texto(destaque.data.title);
    const conteudo = destaque.data.content;

    modalPost.innerHTML = "";

    const h2 = document.createElement("h2");
    h2.textContent = titulo;
    modalPost.appendChild(h2);

    if (destaque.data.image?.url) {
        const imagem = document.createElement("img");
        imagem.src = destaque.data.image.url;
        imagem.alt = titulo;
        imagem.className = "imagem-modal-conteudo";
        modalPost.appendChild(imagem);
    }

    const textoCompleto = document.createElement("div");
    textoCompleto.innerHTML = prismic.asHTML(conteudo || []);

    modalPost.appendChild(textoCompleto);

    modal.showModal();
}

fecharModal.addEventListener("click", () => {
    modal.close();
});

modal.addEventListener("click", evento => {
    if (evento.target === modal) {
        modal.close();
    }
});

carregarCategorias();
