const WPP_LB = 'https://wa.me/5531984622230';

const lb = document.createElement('div');
lb.id = 'lightbox';
lb.innerHTML = `
  <div class="lb-overlay"></div>
  <div class="lb-box">
    <button class="lb-close">✕</button>
    <div class="lb-img-wrap">
      <button class="lb-nav lb-prev">‹</button>
      <img class="lb-img" src="" alt="" />
      <button class="lb-nav lb-next">›</button>
    </div>
    <div class="lb-img-dots"></div>
    <div class="lb-info">
      <div class="lb-badges"></div>
      <div class="lb-nome"></div>
      <div class="lb-preco"></div>
      <a class="lb-wpp card-wpp" href="#" target="_blank">💬 Tenho interesse</a>
    </div>
  </div>
`;
document.body.appendChild(lb);

let lbImgs = [];
let lbIdx = 0;

function renderLbImg() {
  lb.querySelector('.lb-img').src = lbImgs[lbIdx];
  const dots = lb.querySelectorAll('.lb-img-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === lbIdx));
}

// Nova assinatura: abrirLightbox(imgs[], startIdx, nome, preco, edicao, lingua, cor)
function abrirLightbox(imgs, startIdx, nome, preco, edicao, lingua, cor) {
  lbImgs = Array.isArray(imgs) ? imgs : [imgs];
  lbIdx = startIdx || 0;

  const msg = encodeURIComponent(`Olá! Tenho interesse no produto: ${nome} (R$ ${preco})`);
  lb.querySelector('.lb-img').alt = nome;
  lb.querySelector('.lb-nome').textContent = nome;
  lb.querySelector('.lb-preco').textContent = `R$ ${preco}`;
  lb.querySelector('.lb-wpp').href = `${WPP_LB}?text=${msg}`;
  lb.querySelector('.lb-badges').innerHTML = `
    <span class="card-edicao" style="background:${cor || '#0d1f3c'}">${edicao}</span>
    ${lingua ? `<span class="card-lingua">${lingua.toUpperCase()}</span>` : ''}
  `;

  // Dots
  const dotsEl = lb.querySelector('.lb-img-dots');
  if (lbImgs.length > 1) {
    dotsEl.innerHTML = lbImgs.map((_, i) => `<span class="lb-img-dot${i === lbIdx ? ' active' : ''}"></span>`).join('');
    dotsEl.querySelectorAll('.lb-img-dot').forEach((d, i) => {
      d.addEventListener('click', () => { lbIdx = i; renderLbImg(); });
    });
    lb.querySelector('.lb-prev').hidden = false;
    lb.querySelector('.lb-next').hidden = false;
  } else {
    dotsEl.innerHTML = '';
    lb.querySelector('.lb-prev').hidden = true;
    lb.querySelector('.lb-next').hidden = true;
  }

  renderLbImg();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

lb.querySelector('.lb-overlay').addEventListener('click', fecharLightbox);
lb.querySelector('.lb-close').addEventListener('click', fecharLightbox);
lb.querySelector('.lb-prev').addEventListener('click', (e) => {
  e.stopPropagation();
  lbIdx = (lbIdx - 1 + lbImgs.length) % lbImgs.length;
  renderLbImg();
});
lb.querySelector('.lb-next').addEventListener('click', (e) => {
  e.stopPropagation();
  lbIdx = (lbIdx + 1) % lbImgs.length;
  renderLbImg();
});
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') fecharLightbox();
  if (e.key === 'ArrowLeft') { lbIdx = (lbIdx - 1 + lbImgs.length) % lbImgs.length; renderLbImg(); }
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbImgs.length; renderLbImg(); }
});

window.abrirLightbox = abrirLightbox;
