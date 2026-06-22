const WPP = 'https://wa.me/5531984622230';
const grid = document.getElementById('grid-cartas');
const empty = document.getElementById('empty-cartas');
let todasCartas = [];

async function carregarCartas() {
  const res = await fetch('cartas.json');
  const data = await res.json();
  todasCartas = data.items || data;
  renderizarCartas();
}

function renderizarCartas(busca = '') {
  const filtradas = busca
    ? todasCartas.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
    : todasCartas;

  grid.innerHTML = '';

  if (filtradas.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  filtradas.forEach(c => {
    const precoFmt = c.preco.toFixed(2).replace('.', ',');
    const msg = encodeURIComponent(`Olá! Tenho interesse na carta: ${c.nome} (R$ ${precoFmt})`);
    const imgHtml = c.imagem
      ? `<img class="card-img" src="${c.imagem}" alt="${c.nome}" style="cursor:zoom-in" onerror="this.outerHTML='<div class=\\'card-img-placeholder\\'>🃏</div>'" />`
      : `<div class="card-img-placeholder">🃏</div>`;

    const card = document.createElement('div');
    card.className = 'card card-carta';
    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <div class="card-top">
          <span class="card-edicao">${c.edicao}</span>
          <div style="display:flex;gap:4px;align-items:center;">
            ${c.lingua ? `<span class="card-lingua">${c.lingua.toUpperCase()}</span>` : ''}
            ${c.condicao ? `<span class="card-condicao">${c.condicao}</span>` : ''}
          </div>
        </div>
        <div class="card-nome">${c.nome}</div>
      </div>
      <div class="card-footer">
        <div class="card-preco">R$ ${precoFmt}</div>
        <a class="card-wpp" href="${WPP}?text=${msg}" target="_blank">💬 Quero</a>
      </div>
    `;
    if (c.imagem) {
      card.querySelector('.card-img').addEventListener('click', () => {
        abrirLightbox([c.imagem], 0, c.nome, precoFmt, c.edicao, c.lingua || '', '#0d1f3c');
      });
    }
    grid.appendChild(card);
  });
}

// Busca
document.addEventListener('DOMContentLoaded', () => {
  const busca = document.getElementById('busca-cartas');
  if (busca) {
    busca.addEventListener('input', e => renderizarCartas(e.target.value));
  }
});

carregarCartas();
