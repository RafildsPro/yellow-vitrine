const WPP = 'https://wa.me/5531984622230';
const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
let todosProdutos = [];
let filtroAtivo = 'Todos';
let filtroTipo = 'Todos';
let filtroBusca = '';
let ordemAtiva = 'padrao';

const COR_TIPO = {
  'Caixa de Booster':          '#e63946',
  'Blister Triplo':            '#2a9d8f',
  'Blister Quádruplo':         '#2a9d8f',
  'Coleção Treinador Avançado':'#7209b7',
  'Box':                       '#f4a261',
  'Single':                    '#457b9d',
  'Combo de Pacotes':          '#e76f51',
  'Mini Tin':                  '#606c38',
  'Outros':                    '#888',
};

const CATEGORIAS = [
  { arquivo: 'produtos/caixa-booster.json',    tipo: 'Caixa de Booster' },
  { arquivo: 'produtos/blister-triplo.json',   tipo: 'Blister Triplo' },
  { arquivo: 'produtos/blister-quadruplo.json',tipo: 'Blister Quádruplo' },
  { arquivo: 'produtos/colecao-treinador.json',tipo: 'Coleção Treinador Avançado' },
  { arquivo: 'produtos/box.json',              tipo: 'Box' },
  { arquivo: 'produtos/single.json',           tipo: 'Single' },
  { arquivo: 'produtos/combo.json',            tipo: 'Combo de Pacotes' },
  { arquivo: 'produtos/mini-tin.json',          tipo: 'Mini Tin' },
  { arquivo: 'produtos/outros.json',            tipo: 'Outros' },
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
  todosProdutos = resultados.flat();
  popularFiltro();
  renderizar();
}

function popularFiltro() {
  const select = document.getElementById('filtro-select');
  const base = filtroTipo === 'Todos' ? todosProdutos : todosProdutos.filter(p => p.tipo === filtroTipo);
  const edicoes = [...new Set(base.map(p => p.edicao).filter(Boolean))].sort();
  select.innerHTML = '<option value="Todos">Todas as Edições</option>';
  edicoes.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e;
    opt.textContent = e;
    select.appendChild(opt);
  });
}

function compartilhar(nome) {
  const url = window.location.href.split('?')[0] + '?q=' + encodeURIComponent(nome);
  if (navigator.share) {
    navigator.share({ title: nome, url });
  } else {
    navigator.clipboard.writeText(url);
    alert('Link copiado!');
  }
}

function criarCard(p) {
  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome} (R$ ${p.preco.toFixed(2).replace('.', ',')})`);
  const imgHtml = p.imagem
    ? `<img class="card-img" src="${p.imagem}" alt="${p.nome}" onerror="this.outerHTML='<div class=\\'card-img-placeholder\\'>📦</div>'" />`
    : `<div class="card-img-placeholder">📦</div>`;
  const cor = COR_TIPO[p.tipo] || '#0d1f3c';

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    ${p.ultimo ? `<div class="badge-ultimo">🔥 Último!</div>` : ''}
    ${imgHtml}
    <div class="card-body">
      <div class="card-top">
        <span class="card-edicao" style="background:${cor}">${p.edicao}</span>
        ${p.lingua ? `<span class="card-lingua">${p.lingua.toUpperCase()}</span>` : ''}
      </div>
      <div class="card-nome">${p.nome}</div>
    </div>
    <div class="card-footer">
      <div class="card-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
      <a class="card-wpp" href="${WPP}?text=${msg}" target="_blank">💬 Quero</a>
    </div>
  `;
  return card;
}

function ordenar(lista) {
  if (ordemAtiva === 'menor') return [...lista].sort((a,b) => a.preco - b.preco);
  if (ordemAtiva === 'maior') return [...lista].sort((a,b) => b.preco - a.preco);
  if (ordemAtiva === 'az')    return [...lista].sort((a,b) => a.nome.localeCompare(b.nome));
  return lista;
}

function renderizar() {
  grid.innerHTML = '';

  const filtrados = ordenar(todosProdutos.filter(p => {
    const porTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
    const porEdicao = filtroAtivo === 'Todos' || p.edicao === filtroAtivo;
    const porBusca = !filtroBusca || p.nome.toLowerCase().includes(filtroBusca.toLowerCase());
    return porTipo && porEdicao && porBusca;
  }));

  if (filtrados.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  // Modo Netflix: agrupa por categoria
  const modoNetflix = filtroTipo === 'Todos' && filtroAtivo === 'Todos';

  if (modoNetflix) {
    CATEGORIAS.forEach(cat => {
      const itens = filtrados.filter(p => p.tipo === cat.tipo);
      if (itens.length === 0) return;

      const secao = document.createElement('div');
      secao.className = 'netflix-secao';
      secao.innerHTML = `<h2 class="netflix-titulo">${cat.tipo} <span class="netflix-count">${itens.length}</span></h2>`;

      const row = document.createElement('div');
      row.className = 'netflix-row';
      itens.forEach(p => row.appendChild(criarCard(p)));

      secao.appendChild(row);
      grid.appendChild(secao);
    });
  } else {
    // Modo grid normal quando filtro ativo
    grid.classList.add('grid-ativo');
    filtrados.forEach(p => grid.appendChild(criarCard(p)));
    grid.classList.remove('grid-ativo');
    // Reaplica classe correta
    const wrapper = document.createElement('div');
    wrapper.className = 'grid-filtrado';
    filtrados.forEach(p => wrapper.appendChild(criarCard(p)));
    grid.appendChild(wrapper);
  }
}

document.getElementById('filtro-select').addEventListener('change', (e) => {
  filtroAtivo = e.target.value;
  renderizar();
});

document.getElementById('filtro-busca').addEventListener('input', (e) => {
  filtroBusca = e.target.value;
  renderizar();
});

document.getElementById('filtro-ordem').addEventListener('change', (e) => {
  ordemAtiva = e.target.value;
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
