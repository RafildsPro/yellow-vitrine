const WPP = 'https://wa.me/5531984622230';
const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
let produtos = [];
let filtroAtivo = 'Todos';

async function carregarProdutos() {
  const res = await fetch('produtos.json');
  const data = await res.json();
  produtos = data.items || data;
  renderizar();
}

function renderizar() {
  const filtrados = filtroAtivo === 'Todos'
    ? produtos
    : produtos.filter(p => p.edicao === filtroAtivo);

  grid.innerHTML = '';

  if (filtrados.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  filtrados.forEach(p => {
    const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome} (R$ ${p.preco.toFixed(2).replace('.', ',')})`);
    const imgHtml = p.imagem
      ? `<img class="card-img" src="${p.imagem}" alt="${p.nome}" onerror="this.outerHTML='<div class=\\'card-img-placeholder\\'>📦</div>'" />`
      : `<div class="card-img-placeholder">📦</div>`;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <span class="card-edicao">${p.edicao}</span>
        <div class="card-nome">${p.nome}</div>
        <div class="card-tipo">${p.tipo}</div>
      </div>
      <div class="card-footer">
        <div>
          <div class="card-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
          <div class="card-unidades">${p.unidades} unid. disponível${p.unidades !== 1 ? 'is' : ''}</div>
        </div>
        <a class="card-wpp" href="${WPP}?text=${msg}" target="_blank">
          💬 Quero
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.getElementById('filtro-select').addEventListener('change', (e) => {
  filtroAtivo = e.target.value;
  renderizar();
});

carregarProdutos();
