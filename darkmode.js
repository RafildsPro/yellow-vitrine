const btn = document.getElementById('dark-toggle');
const body = document.body;

function aplicarTema(dark) {
  if (dark) {
    body.classList.add('dark');
    btn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    btn.textContent = '🌙';
  }
}

// Carrega preferência salva
aplicarTema(localStorage.getItem('dark') === 'true');

btn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  btn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('dark', isDark);
});
