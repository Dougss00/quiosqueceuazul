(() => {
    'use strict';

    const FALLBACK_IMAGE = 'fallback.svg';
    const produtos = Array.isArray(window.CATALOGO) ? window.CATALOGO : [];
    const botoesAbas = [...document.querySelectorAll('.aba-btn')];
    const paineis = [...document.querySelectorAll('[data-painel]')];
    const temaBtn = document.getElementById('tema-btn');
    const temaIcone = document.getElementById('tema-icone');
    const temaTexto = document.getElementById('tema-texto');

    function criarElemento(tag, classe, texto) {
        const elemento = document.createElement(tag);
        if (classe) elemento.className = classe;
        if (texto !== undefined && texto !== null) elemento.textContent = texto;
        return elemento;
    }

    function criarCard(produto) {
        const artigo = criarElemento('article', 'item');

        if (produto.destaque) {
            artigo.appendChild(criarElemento('span', 'destaque', produto.destaque));
        }

        const imgContainer = criarElemento('div', 'item-img-container');
        const imagem = document.createElement('img');
        imagem.src = produto.imagem || FALLBACK_IMAGE;
        imagem.alt = produto.alt || produto.nome || 'Imagem do produto';
        imagem.loading = 'lazy';
        imagem.decoding = 'async';
        imagem.width = 600;
        imagem.height = 450;
        imagem.addEventListener('error', () => {
            // Compatibilidade com o repositório antigo: se a imagem ainda estiver
            // na raiz (ex.: brahma.png), tenta esse caminho antes do fallback.
            if (!imagem.dataset.tentativaLegacy && produto.imagem?.startsWith('assets/images/')) {
                const nomeArquivo = produto.imagem.split('/').pop();
                if (nomeArquivo && nomeArquivo !== 'peixe-frito.png') {
                    imagem.dataset.tentativaLegacy = 'true';
                    imagem.src = nomeArquivo;
                    return;
                }
            }

            if (!imagem.dataset.fallbackAplicado) {
                imagem.dataset.fallbackAplicado = 'true';
                imagem.src = FALLBACK_IMAGE;
                imagem.alt = `Imagem indisponível — ${produto.nome}`;
            }
        });
        imgContainer.appendChild(imagem);

        const info = criarElemento('div', 'item-info');
        const cabecalho = criarElemento('div', 'item-cabecalho');
        const nome = criarElemento('h2', 'item-nome', produto.nome);
        const preco = criarElemento('span', 'item-preco', produto.preco);
        const descricao = criarElemento('p', 'item-descricao', produto.descricao);

        cabecalho.append(nome, preco);
        info.append(cabecalho, descricao);
        artigo.append(imgContainer, info);

        return artigo;
    }

    const categoriasRenderizadas = new Set();

    function renderizarCategoria(categoria) {
        if (categoriasRenderizadas.has(categoria)) return;

        const lista = document.querySelector(`[data-lista="${categoria}"]`);
        if (!lista) return;

        const fragmento = document.createDocumentFragment();
        produtos
            .filter(produto => produto.categoria === categoria)
            .forEach(produto => fragmento.appendChild(criarCard(produto)));

        lista.replaceChildren(fragmento);
        categoriasRenderizadas.add(categoria);
    }

    function ativarAba(categoria, moverFoco = false) {
        renderizarCategoria(categoria);
        botoesAbas.forEach(botao => {
            const ativa = botao.dataset.aba === categoria;
            botao.classList.toggle('ativa', ativa);
            botao.setAttribute('aria-selected', String(ativa));
            botao.tabIndex = ativa ? 0 : -1;

            if (ativa && moverFoco) {
                botao.focus({ preventScroll: true });
            }
        });

        paineis.forEach(painel => {
            const ativo = painel.dataset.painel === categoria;
            painel.hidden = !ativo;
            painel.classList.toggle('ativa', ativo);
        });

        try {
            sessionStorage.setItem('categoriaAtiva', categoria);
        } catch (_) {
            // O site continua funcionando se o armazenamento estiver bloqueado.
        }
    }

    function configurarAbas() {
        botoesAbas.forEach((botao, indice) => {
            botao.addEventListener('click', () => ativarAba(botao.dataset.aba));

            botao.addEventListener('keydown', event => {
                let novoIndice = null;

                if (event.key === 'ArrowRight') novoIndice = (indice + 1) % botoesAbas.length;
                if (event.key === 'ArrowLeft') novoIndice = (indice - 1 + botoesAbas.length) % botoesAbas.length;
                if (event.key === 'Home') novoIndice = 0;
                if (event.key === 'End') novoIndice = botoesAbas.length - 1;

                if (novoIndice !== null) {
                    event.preventDefault();
                    const destino = botoesAbas[novoIndice];
                    ativarAba(destino.dataset.aba, true);
                    destino.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        });

        try {
            const salva = sessionStorage.getItem('categoriaAtiva');
            if (salva && botoesAbas.some(botao => botao.dataset.aba === salva)) {
                ativarAba(salva);
            }
        } catch (_) {
            // Sem armazenamento, fica na primeira aba.
        }
    }

    function aplicarTema(escuro, salvar = true) {
        document.body.classList.toggle('tema-escuro', escuro);
        temaIcone.textContent = escuro ? '☀️' : '🌙';
        temaTexto.textContent = escuro ? 'Tema Claro' : 'Tema Escuro';
        temaBtn.setAttribute('aria-pressed', String(escuro));
        temaBtn.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');

        if (salvar) {
            try {
                localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
            } catch (_) {
                // O site continua funcionando se o armazenamento estiver bloqueado.
            }
        }
    }

    function configurarTema() {
        let temaSalvo = null;
        try {
            temaSalvo = localStorage.getItem('tema');
        } catch (_) {}

        const prefereEscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
        aplicarTema(temaSalvo ? temaSalvo === 'escuro' : prefereEscuro, false);

        temaBtn.addEventListener('click', () => {
            aplicarTema(!document.body.classList.contains('tema-escuro'));
        });
    }

    configurarAbas();
    if (!document.querySelector('.conteudo-aba.ativa .item')) {
        ativarAba(document.querySelector('.aba-btn.ativa')?.dataset.aba || 'cervejas');
    }
    configurarTema();
})();
