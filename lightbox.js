const WPP_LB = 'https://wa.me/5531984622230';

// Cria o lightbox no DOM
const lb = document.createElement('div');
lb.id = 'lightbox';
lb.innerHTML = `
  <div class="lb-overlay"></div>
  <div class="lb-box">
    <button class="lb-close">✕</button>
    <div class="lb-img-wrap">
      <img class="lb-img" src="" alt="" />
    </div>
    <div class="lb-info">
      <div class="lb-badges"></div>
      <div class="lb-nome"></div>
      <div class="lb-preco"></div>
      <a class="lb-wpp card-wpp" href="#" target="_blank">💬 Tenho interesse</a>
    </div>
  </div>
`;
document.body.appendChild(lb);

function abrirLightbox(img, nome, preco, edicao, lingua, cor) {
  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${nome} (R$ ${preco})`);
  lb.querySelector('.lb-img').src = img;
  lb.querySelector('.lb-img').alt = nome;
  lb.querySelector('.lb-nome').textContent = nome;
  lb.querySelector('.lb-preco').textContent = `R$ ${preco}`;
  lb.querySelector('.lb-wpp').href = `${WPP_LB}?text=${msg}`;
  lb.querySelector('.lb-badges').innerHTML = `
    <span class="card-edicao" style="background:${cor || '#0d1f3c'}">${edicao}</span>
    ${lingua ? `<span class="card-lingua">${lingua.toUpperCase()}</span>` : ''}
  `;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

lb.querySelector('.lb-overlay').addEventListener('click', fecharLightbox);
lb.querySelector('.lb-close').addEventListener('click', fecharLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharLightbox(); });

// Expõe a função globalmente para o app.js usar
window.abrirLightbox = abrirLightbox;
