# Quiosque Céu Azul — versão organizada para GitHub Pages

Esta versão foi refatorada a partir do HTML original e mantém as 5 categorias e os 50 produtos.

## Estrutura

```text
index.html
assets/
  css/
    style.css
  js/
    catalogo.js
    app.js
  images/
    fallback.svg
    favicon.svg
    (suas imagens locais .png)
```

## Correções aplicadas

- Remove o uso de `event` global/implícito nas abas.
- Remove o caminho local do Windows (`D:\...`) que quebra fora do computador original.
- Unifica a proporção das imagens com `aspect-ratio`.
- Corrige o destaque da aba ativa no tema escuro.
- Salva a preferência de tema no navegador.
- Adiciona `loading="lazy"`, `decoding="async"` e fallback para imagens ausentes.
- Melhora a navegação por teclado e ARIA das abas.
- Separa HTML, CSS, lógica e dados do cardápio.
- Não usa `fetch()` nem módulos ES, então também pode abrir diretamente como arquivo local.

## Imagens locais que você precisa copiar do repositório antigo

Coloque os arquivos abaixo dentro de `assets/images/`:

- `antartica.png`
- `brahma.png`
- `budweiser.png`
- `crystal.png`
- `devassa.png`
- `heineken.png`
- `lokal.png`
- `skol.png`
- `stellaartois.png`
- `subzero.png`
- `peixe-frito.png` (substitui o antigo caminho `D:\Design sem nome (8).png`)

Se alguma dessas imagens estiver faltando, o site mostra `fallback.svg` automaticamente em vez de quebrar o card.

## Testar no VS Code

1. Abra a **pasta inteira** deste projeto no VS Code.
2. Abra `index.html`.
3. Você pode abrir o arquivo diretamente no navegador; esta versão funciona sem servidor local.
4. Se usar a extensão **Live Server**, clique em **Go Live** para simular a hospedagem.

## Testar no Visual Studio

Abra a pasta/projeto como conteúdo estático e execute `index.html` no navegador. Não é necessário ASP.NET, Node.js ou build.

## Publicar no GitHub Pages

Se seu repositório já está publicado pelo GitHub Pages:

1. Faça backup dos arquivos atuais.
2. Copie `index.html` e a pasta `assets/` para a raiz do repositório.
3. Copie suas imagens locais para `assets/images/`.
4. Faça commit e push para a branch usada pelo Pages.
5. Como `index.html` está na raiz e todos os caminhos são relativos, funciona tanto em `usuario.github.io` quanto em `usuario.github.io/nome-do-repositorio/`.

## Onde editar produtos e preços

Edite somente:

```text
assets/js/catalogo.js
```

Cada produto tem:

```js
{
  categoria: "cervejas",
  nome: "Brahma Duplo Malte",
  preco: "R$ 10,00",
  descricao: "...",
  imagem: "assets/images/brahma.png",
  alt: "Brahma",
  destaque: "NOVO"
}
```

Evite caminhos absolutos do Windows como `C:\...` ou `D:\...`.
