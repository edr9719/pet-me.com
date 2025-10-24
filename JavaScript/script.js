// Iniciar sesión y mandar al feed
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault(); // evita el envío real del formulario -- modificar
      // aquí podrías validar credenciales antes de redirigir
        window.location.href ='/componentes/feed.html';
    });
    }
});