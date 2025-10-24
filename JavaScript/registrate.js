document.addEventListener('DOMContentLoaded', function () {
    const createBtn = document.getElementById('createAccountBtn');
    if (createBtn) {
        createBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Si feed.html está en la misma carpeta 'componentes' usa 'feed.html'
            // Si prefieres ruta absoluta desde la raíz del servidor usa '/componentes/feed.html'
            window.location.href = '/componentes/feed.html';
        });
    }
});