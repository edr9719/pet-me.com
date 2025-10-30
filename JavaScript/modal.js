// Simular funcionalidad de selección de opciones
document.querySelectorAll('.post-option').forEach((option) => {
  option.addEventListener('click', function () {
    // Remover clase activa de todas las opciones
    document.querySelectorAll('.post-option').forEach((el) => {
      el.classList.remove('active');
    });
    // Agregar clase activa a la opción seleccionada
    this.classList.add('active');
  });
});

// Simular funcionalidad de selección de sentimientos
document.querySelectorAll('.badge').forEach((badge) => {
  badge.addEventListener('click', function () {
    this.classList.toggle('bg-primary');
    this.classList.toggle('text-white');
    this.classList.toggle('bg-light');
    this.classList.toggle('text-dark');
  });
});
