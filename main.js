const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSE-67UVPqaQWgqZdIjD6x7zI-1LxQNwiVexHYcfYflsC9HX8p-FnlnfAvWk0HXfXZe1fC-FttdmlqV/pub?output=csv';
const WHATSAPP_NUMBER = '5490000000000';

// ===== MENÚ HAMBURGUESA =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ===== BARRA DE PROGRESO DE SCROLL =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = progress + '%';
});

// ===== BOTÓN VOLVER ARRIBA =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== TABS DE INFO =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector('.tab-content[data-tab="' + btn.dataset.tab + '"]').classList.add('active');
  });
});

// ===== CATÁLOGO DESDE GOOGLE SHEETS =====
const catalogGrid = document.getElementById('catalogGrid');

 function limpiarPrecio(texto) {
  if (!texto) return 0;
  return Number(texto.replace(/[^0-9.]/g, '')) || 0;
}

Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function(results) {
    const productos = results.data.filter(p => p.nombre && p.nombre.trim() !== '' && p.disponible && p.disponible.trim().toLowerCase() === 'si');
    productos.forEach(p => {
      try {
        const precioNormal = limpiarPrecio(p.precio);
        const tieneDescuento = p.tiene_descuento && p.tiene_descuento.trim().toLowerCase() === 'si';
        const precioFinal = tieneDescuento ? limpiarPrecio(p.precio_descuento) : precioNormal;
        const imagen = p.imagen && p.imagen.trim() !== '' ? p.imagen.trim() : 'https://via.placeholder.com/200x200/ffe3ef/ff8fc0?text=Sin+foto';
        const mensaje = encodeURIComponent('Hola! Quiero pedir el modelo ' + p.nombre);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = p.categoria || '';
        card.innerHTML = `
          ${tieneDescuento ? '<span class="product-card__badge">Descuento</span>' : ''}
           <img src="${imagen}" alt="${p.nombre}" class="product-card__img" loading="lazy" onload="this.classList.add('loaded')">
          <h3 class="product-card__name">${p.nombre}</h3>
          <p class="product-card__price">${tieneDescuento ? '<span class="product-card__price--old">$' + precioNormal.toLocaleString('es-AR') + '</span>' : ''}$${precioFinal.toLocaleString('es-AR')}</p>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}" class="nav-btn product-card__btn" target="_blank">Pedir</a>
        `;
        catalogGrid.appendChild(card);
      } catch (err) {
        console.error('Error con el producto:', p.nombre, err);
      }
    });
  },
  error: function(err) {
    console.error('Error cargando el Sheet:', err);
  }
});