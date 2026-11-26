// 1. Importa o Prismic direto da CDN
import * as prismic from "https://cdn.jsdelivr.net/npm/@prismicio/client@7/+esm";

// 2. Cria o client apontando para o repositório "curso"
const client = prismic.createClient("site-autobots", {
    // accessToken: "seu-token-aqui", // só se o repositório for privado
});

// 3. Busca os posts
const response = await client.getByType("destaques");

// Outras formas de buscar conteúdo no Prismic:
// client.getByType("post", { pageSize: 5, page: 2 })          → paginação (padrão: 20 por página)
// client.getByType("post", {
//   orderings: [{ field: "document.first_publication_date", direction: "desc" }],
// })                                                         → mais recentes primeiro
// client.getAllByType("post")                                → TODOS os posts, sem paginação (devolve um array direto)
// client.getFirst()                                          → só o primeiro documento encontrado
// client.getByID("ID_DO_DOCUMENTO")                          → um documento pelo ID
// client.getByIDs(["ID_1", "ID_2"])                          → vários documentos pelos IDs
// client.getByUID("post", "meu-primeiro-post")               → um documento pelo UID (precisa do campo UID no custom type)
// client.getSingle("home")                                   → custom type do tipo Single (ex.: página inicial)
// client.getByTag("destaque")                                → documentos com uma tag
// client.get({ filters: [prismic.filter.fulltext("document", "prismic")] }) → busca por texto

// 4. Monta o card de um post
const modal = document.querySelector("#modal");

function criarCard(destaques) {
    const { title, image, resumo, content, category } = destaques.data;
    //const data = new Date(post.first_publication_date).toLocaleDateString("pt-BR");

    // title e description são Rich Text: o asText transforma em texto puro
    const titulo = prismic.asText(title);
    const resumoT = prismic.asText(resumo);

    // category é um Content Relationship: o link traz o uid da categoria
    const nomeCategoria = category?.uid ?? "";
    

    const card = document.createElement("article");
    card.className = "card-projeto";
    card.innerHTML = `
                <img src="${image.url}" alt="${image.alt ?? ""}">

                <div class="card-conteudo">
                    <h3>${titulo}</h3>
                    <p>${resumoT}</p>
                </div>                
    `;


    return card;
}

// 5. Coloca um card na tela para cada post
const lista = document.querySelector("#destaques");

response.results.forEach((destaques) => {
    //lista.append(criarCard(destaques));
});


// 7. Seção de uma categoria: troque o UID para mostrar outra categoria
const categorias = await client.getAllByType("category");
const destaques = await client.getAllByType("destaques", {
    orderings: [
        {
            field: "document.first_publication_date",
            direction: "desc"
        }
    ]
});

categorias.forEach((categoria) => {
    const secao = document.createElement("section");
    secao.className = "categoria-secao";

    const titulo = document.createElement("h3");
    titulo.className = "titulo-categoria";
    titulo.textContent = prismic.asText(categoria.data.tipo);

    const cards = document.createElement("div");
    cards.className = "cards";

    secao.appendChild(titulo);
    secao.appendChild(cards);
    lista.appendChild(secao);

    // Filtra os destaques da categoria e limita a 4
    const destaquesCategoria = destaques
        .filter((destaque) => destaque.data.category?.id === categoria.id)
        .slice(0, 4);

    destaquesCategoria.forEach((destaque) => {
        cards.appendChild(criarCard(destaque));
    });

    
});

//separa--------------------------

const modalS = document.getElementById("modal-sobre");
const modalConteudo = document.getElementById("modal-conteudo");

const tituloSobre = document.getElementById("sobre-titulo");
const resumoSobre = document.getElementById("sobre-resumo");
const btnLerSobre = document.getElementById("btn-ler-sobre");

const fecharModal = document.getElementById("fechar-modal");

// Busca o documento Sobre no Prismic
const documentoSobre = await client.getSingle("historia");

function carregarSobre(documento) {

    const titulo = prismic.asText(documento.data.title);
    const resumo = prismic.asText(documento.data.resumo);
    const conteudo = documento.data.conteudo;
    const imagem = documento.data.image;

    // Exibe o resumo na página
    tituloSobre.textContent = titulo;
    resumoSobre.textContent = resumo;

    // Abre o modal com o conteúdo completo
    btnLerSobre.addEventListener("click", () => {

        modalConteudo.innerHTML = `
            ${prismic.isFilled.image(imagem) ? `
                <img src="${prismic.asImageSrc(imagem)}"
                     alt="${imagem.alt ?? ""}"
                     class="imagem-modal">
            ` : ""}

            <div class="post-texto">
                <h1>${titulo}</h1>

                <p class="resumo">${resumo}</p>

                <div class="conteudo">
                    ${prismic.asHTML(conteudo)}
                </div>
            </div>
        `;

        modalS.showModal();
        modalS.scrollTop = 0;
    });
}

// Carrega as informações do Sobre
carregarSobre(documentoSobre);

// Fecha o modal
fecharModal.addEventListener("click", () => {
    modalS.close();
});