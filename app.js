const WPP = 'https://wa.me/5531984622230';
const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
let produtos = [];
let filtroAtivo = 'Todos';

async function carregarProdutos() {
  const res = await fetch('produtos.json');
  produtos = await res.json();
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

const dropdown = document.getElementById('dropdown-edicao');
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

dropdownBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

document.addEventListener('click', () => {
  dropdown.classList.remove('open');
});

dropdownMenu.addEventListener('click', (e) => e.stopPropagation());

document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroAtivo = btn.dataset.edicao;

    const edicao = btn.dataset.edicao;
    if (edicao !== 'Todos') {
      dropdownBtn.childNodes[0].textContent = edicao + ' ';
      dropdown.classList.remove('open');
    } else {
      dropdownBtn.childNodes[0].textContent = 'Filtrar por Edição ';
    }

    renderizar();
  });
});

carregarProdutos();
