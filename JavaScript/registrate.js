// CAMBIAR POR TU IP DE AWS EL VIERNES
const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
  // 1. LLENAR SELECT DE ESTADOS (Para que no esté vacío)
  const selectEstado = document.getElementById('estado');
  const estadosMexico = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Ciudad de México',
    'Coahuila',
    'Colima',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ];

  // Opción por defecto
  selectEstado.innerHTML =
    '<option value="" selected disabled>Selecciona un estado</option>';
  estadosMexico.forEach((estado) => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    selectEstado.appendChild(option);
  });

  // 2. MOSTRAR / OCULTAR CONTRASEÑA
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePasswordBtn.addEventListener('click', () => {
    const type =
      passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    const icon = togglePasswordBtn.querySelector('i');
    if (type === 'text') {
      icon.classList.remove('bi-eye');
      icon.classList.add('bi-eye-slash');
    } else {
      icon.classList.remove('bi-eye-slash');
      icon.classList.add('bi-eye');
    }
  });

  // 3. LÓGICA DE REGISTRO
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar errores previos (visuales de Bootstrap)
    document
      .querySelectorAll('.is-invalid')
      .forEach((el) => el.classList.remove('is-invalid'));

    // --- RECOLECCIÓN DE DATOS ---
    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const estado = document.getElementById('estado');
    const ciudad = document.getElementById('ciudad');
    const terminos = document.getElementById('terminos');

    let esValido = true;

    // --- VALIDACIONES FRONTEND ---

    // Campos vacíos simples
    [nombre, apellidos, username, ciudad].forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        esValido = false;
      }
    });

    // Email (Regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.classList.add('is-invalid');
      esValido = false;
    }

    // Estado (Select)
    if (!estado.value) {
      estado.classList.add('is-invalid');
      esValido = false;
    }

    // Términos
    if (!terminos.checked) {
      terminos.classList.add('is-invalid');
      esValido = false;
    }

    // Contraseña (Validación fuerte)
    // Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passRegex.test(password.value)) {
      password.classList.add('is-invalid');
      document.getElementById('password-hint').classList.remove('d-none'); // Mostrar ayuda
      document.getElementById('password-feedback').textContent =
        'La contraseña no cumple los requisitos.';
      esValido = false;
    } else {
      document.getElementById('password-hint').classList.add('d-none');
    }

    if (!esValido) return; // Si algo falló, no enviamos nada

    // --- PREPARAR JSON PARA BACKEND ---
    const btnSubmit = document.getElementById('createAccountBtn');
    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = 'Creando cuenta...';
    btnSubmit.disabled = true;

    const newUser = {
      name: nombre.value.trim(),
      lastname: apellidos.value.trim(),
      email: email.value.trim(),
      username: username.value.trim(),
      password: password.value,
      // Tu HTML no tiene teléfono, enviamos 0 para cumplir con el modelo Java
      telephone: 0,
      country: estado.value,
      city: ciudad.value.trim(),
      // Enviamos la fecha actual en formato YYYY-MM-DD
      registerDate: new Date().toISOString().split('T')[0],
    };

    // --- PETICIÓN AL SERVIDOR ---
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/new-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        // 201 Created
        alert('¡Cuenta creada con éxito! Bienvenido a PetMe 🐾');
        window.location.href = '/index.html';
      } else if (response.status === 409) {
        alert('Error: El correo o nombre de usuario ya están registrados.');
        // Opcional: resaltar los campos
        email.classList.add('is-invalid');
        username.classList.add('is-invalid');
      } else {
        const text = await response.text();
        console.error('Error backend:', text);
        alert('Hubo un error al crear la cuenta. Intenta más tarde.');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor.');
    } finally {
      btnSubmit.textContent = originalText;
      btnSubmit.disabled = false;
    }
  });
});
