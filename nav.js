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
