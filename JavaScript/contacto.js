document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const nombre = document.getElementById('nombre');
  const mensaje = document.getElementById('mensaje');
  const email = document.getElementById('email');
  const alerta = document.getElementById('alerta');
  const contadorNombre = document.getElementById('contador-nombre');
  const contadorMensaje = document.getElementById('contador');
  const formControls = document.querySelectorAll('input.form-control, textarea.form-control');

  // Validación de formato de correo
  function esCorreoValido(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(correo);
  }

  // Verifica si un input tiene contenido
  function checkInputContent(input) {
    if (input.value.trim() !== '') {
      input.classList.add('has-content');
    } else {
      input.classList.remove('has-content');
    }
  }

  // Contador de nombre
  function actualizarContadorNombre() {
    const longitud = nombre.value.trim().length;
    contadorNombre.textContent = `${longitud} / 10 caracteres mínimos ✍️`;
    contadorNombre.classList.toggle('valid', longitud >= 10);
    contadorNombre.classList.toggle('invalid', longitud < 10);
  }

  // Contador de mensaje
  function actualizarContadorMensaje() {
    const longitud = mensaje.value.trim().length;
    contadorMensaje.textContent = `${longitud} / 30 caracteres mínimos 🐾`;
    contadorMensaje.classList.toggle('valid', longitud >= 30);
    contadorMensaje.classList.toggle('invalid', longitud < 30);
  }

  // Eventos visuales
  formControls.forEach(function (input) {
    checkInputContent(input);
    input.addEventListener('input', function () {
      checkInputContent(this);
    });
    input.addEventListener('blur', function () {
      checkInputContent(this);
    });
    input.addEventListener('focus', function () {
      checkInputContent(this);
    });
  });

  // Eventos de contador
  nombre.addEventListener('input', actualizarContadorNombre);
  mensaje.addEventListener('input', actualizarContadorMensaje);

  // Validación al enviar
  form.addEventListener('submit', function (e) {
    const nombreVal = nombre.value.trim();
    const mensajeVal = mensaje.value.trim();
    const emailVal = email.value.trim();
    let errores = [];

    if (nombreVal.length < 10) {
      errores.push("El nombre debe tener al menos 10 caracteres.");
    }

    if (mensajeVal.length < 30) {
      errores.push("El mensaje debe tener al menos 30 caracteres.");
    }

    if (!esCorreoValido(emailVal)) {
      errores.push("El correo electrónico no tiene un formato válido.");
    }

    if (errores.length > 0) {
      e.preventDefault();
      alerta.innerHTML = `
        <div class="alert alert-warning" role="alert">
          ${errores.map(err => `<div>🐾 ${err}</div>`).join('')}
        </div>
      `;
    }
  });
});