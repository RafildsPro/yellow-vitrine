const WPP = 'https://wa.me/5531984622230';
const grid = document.getElementById('grid-cartas');
const empty = document.getElementById('empty-cartas');

async function carregarCartas() {
  const res = await fetch('cartas.json');
  const cartas = await res.json();

  if (cartas.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  cartas.forEach(c => {
    const msg = encodeURIComponent(`Olá! Tenho interesse na carta: ${c.nome} (R$ ${c.preco.toFixed(2).replace('.', ',')})`);
    const imgHtml = c.imagem
      ? `<img class="card-img" src="${c.imagem}" alt="${c.nome}" onerror="this.outerHTML='<div class=\\'card-img-placeholder\\'>🃏</div>'" />`
      : `<div class="card-img-placeholder">🃏</div>`;

    const card = document.createElement('div');
    card.className = 'card card-carta';
    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <span class="card-edicao">${c.edicao}</span>
        <div class="card-nome">${c.nome}</div>
        <div class="card-numero">${c.numero}</div>
        <div class="card-descricao">${c.descricao}</div>
      </div>
      <div class="card-footer">
        <div>
          <div class="card-preco">R$ ${c.preco.toFixed(2).replace('.', ',')}</div>
        </div>
        <a class="card-wpp" href="${WPP}?text=${msg}" target="_blank">
          💬 Quero
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

carregarCartas();
