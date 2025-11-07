
  document.addEventListener('DOMContentLoaded', function() {
    const offcanvas = document.getElementById('offcanvasDarkNavbar');
    const logo = document.getElementById('offcanvas-logo');

    // Al abrir el menú
    offcanvas.addEventListener('show.bs.offcanvas', function () {
      logo.style.transform = 'rotate(5deg)';
      logo.style.transition = 'transform 0.3s ease-in-out';
    });

    // Al cerrar el menú
    offcanvas.addEventListener('hide.bs.offcanvas', function () {
      logo.style.transform = 'rotate(0deg)';
    });
  });