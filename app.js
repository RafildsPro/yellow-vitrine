const WPP = 'https://wa.me/5531984622230';
const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
let produtos = [];
let filtroAtivo = 'Todos';
let filtroTipo = 'Todos';

const CATEGORIAS = [
  { arquivo: 'produtos/caixa-booster.json',    tipo: 'Caixa de Booster' },
  { arquivo: 'produtos/blister-triplo.json',   tipo: 'Blister Triplo' },
  { arquivo: 'produtos/blister-quadruplo.json',tipo: 'Blister Quádruplo' },
  { arquivo: 'produtos/colecao-treinador.json',tipo: 'Coleção Treinador Avançado' },
  { arquivo: 'produtos/box.json',              tipo: 'Box' },
  { arquivo: 'produtos/single.json',           tipo: 'Single' },
  { arquivo: 'produtos/combo.json',            tipo: 'Combo de Pacotes' },
  { arquivo: 'produtos/outros.json',           tipo: 'Outros' },
];

async function carregarProdutos() {
  const resultados = await Promise.all(
    CATEGORIAS.map(async cat => {
      try {
        const res = await fetch(cat.arquivo);
        const data = await res.json();
        const items = data.items || [];
        return items.map(p => ({ ...p, tipo: cat.tipo }));
      } catch { return []; }
    })
  );
  produtos = resultados.flat();
  popularFiltro();
  renderizar();
}

function popularFiltro() {
  const select = document.getElementById('filtro-select');
  const base = filtroTipo === 'Todos' ? produtos : produtos.filter(p => p.tipo === filtroTipo);
  const edicoes = [...new Set(base.map(p => p.edicao).filter(Boolean))].sort();
  select.innerHTML = '<option value="Todos">Todas as Edições</option>';
  edicoes.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e;
    opt.textContent = e;
    select.appendChild(opt);
  });
}

function renderizar() {
  const filtrados = produtos.filter(p => {
    const porTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
    const porEdicao = filtroAtivo === 'Todos' || p.edicao === filtroAtivo;
    return porTipo && porEdicao;
  });

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
        <div class="card-top">
          <span class="card-edicao">${p.edicao}</span>
          ${p.lingua ? `<span class="card-lingua">${p.lingua.toUpperCase()}</span>` : ''}
        </div>
        <div class="card-nome">${p.nome}</div>
        <div class="card-tipo">${p.tipo || ''}</div>
      </div>
      <div class="card-footer">
        <div>
          <div class="card-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
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

document.getElementById('filtro-tipo').addEventListener('change', (e) => {
  filtroTipo = e.target.value;
  filtroAtivo = 'Todos';
  document.getElementById('filtro-select').value = 'Todos';
  popularFiltro();
  renderizar();
});

carregarProdutos();
