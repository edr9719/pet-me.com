// Script para manejar el estado de los inputs en el formulario de contacto

document.addEventListener('DOMContentLoaded', function () {
  // Seleccionar todos los inputs y textareas del formulario
  const formControls = document.querySelectorAll(
    'input.form-control, textarea.form-control'
  );

  // Función para verificar si un input tiene contenido
  function checkInputContent(input) {
    if (input.value.trim() !== '') {
      input.classList.add('has-content');
    } else {
      input.classList.remove('has-content');
    }
  }

  // Añadir event listeners a todos los form controls
  formControls.forEach(function (input) {
    // Verificar contenido inicial (por si hay valores pre-llenados)
    checkInputContent(input);

    // Verificar en cada cambio de contenido
    input.addEventListener('input', function () {
      checkInputContent(this);
    });

    // Verificar cuando el input pierde el foco
    input.addEventListener('blur', function () {
      checkInputContent(this);
    });

    // Verificar cuando el input gana el foco
    input.addEventListener('focus', function () {
      checkInputContent(this);
    });
  });
});
