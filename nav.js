// Pequenos ajustes compartilhados pelas páginas.

// "Cartas em Destaque" só aparece no menu quando existe alguma carta em cartas.json.
// Sem cartas a página fica vazia: o link fica escondido e quem abrir cartas.html vai para o início.
(function () {
  const links = document.querySelectorAll('a[href="cartas.html"]');

  fetch('cartas.json')
    .then(r => r.json())
    .then(dados => {
      const cartas = dados.items || dados;
      if (cartas.length) {
        links.forEach(a => a.classList.remove('nav-cartas-oculto'));
      } else if (/cartas(\.html)?$/.test(location.pathname)) {
        location.replace('index.html');
      }
    })
    .catch(() => {});
})();

// Ano do rodapé
document.querySelectorAll('[data-ano]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// "Estoque atualizado em 25/10 às 05:11". O arquivo atualizado.json é gravado pelo sistema de
// estoque a cada publicação; se ainda não existir, nada aparece.
(function () {
  const alvo = document.getElementById('atualizado-em');
  if (!alvo) return;

  fetch('atualizado.json')
    .then(r => (r.ok ? r.json() : Promise.reject()))
    .then(dados => {
      const quando = new Date(dados.atualizadoEm);
      if (isNaN(quando)) return;
      const fuso = { timeZone: 'America/Sao_Paulo' };
      const dia = quando.toLocaleDateString('pt-BR', { ...fuso, day: '2-digit', month: '2-digit' });
      const hora = quando.toLocaleTimeString('pt-BR', { ...fuso, hour: '2-digit', minute: '2-digit' });
      alvo.textContent = `Estoque atualizado em ${dia} às ${hora}`;
    })
    .catch(() => {});
})();
