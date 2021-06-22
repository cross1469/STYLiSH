const url = window.location.search;
const searchParams = new URLSearchParams(url);
const num = searchParams.get('number');

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('number').textContent = num;
});

// eslint-disable-next-line no-undef
cartHover();
