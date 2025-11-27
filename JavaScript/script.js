// Iniciar sesión
document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');

    const identifierError = document.getElementById('identifierError');
    const passwordError = document.getElementById('passwordError');

    // --- Mostrar / ocultar contraseña ---
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword) {
        const passwordIcon = document.getElementById('passwordIcon');

        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            if (passwordIcon) {
                passwordIcon.classList.toggle('bi-eye-slash-fill');
                passwordIcon.classList.toggle('bi-eye-fill');
            }
        });
    }

    // --- Validación frontend ---
    function mostrarError(input, errorDiv, mensaje) {
        input.classList.add('is-invalid');
        errorDiv.textContent = mensaje;
        errorDiv.classList.add('d-block');
    }

    function limpiarErrores() {
        identifierInput.classList.remove('is-invalid');
        identifierError.textContent = '';
        identifierError.classList.remove('d-block');

        passwordInput.classList.remove('is-invalid');
        passwordError.textContent = '';
        passwordError.classList.remove('d-block');
    }

    // --- CONECTAR AL BACKEND ---
    const API_BASE = 'http://localhost:8080';
    const TOKEN_KEY = 'access_token';

    // --- Evento submit (único y correcto) ---
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        limpiarErrores();

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        if (!identifier) {
            mostrarError(identifierInput, identifierError, 'Ingresa tu usuario o correo.');
            return;
        }

        if (!password) {
            mostrarError(passwordInput, passwordError, 'Ingresa tu contraseña.');
            return;
        }

        try {
            const resp = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: identifier,
                    email: identifier,
                    password: password
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                mostrarError(passwordInput, passwordError, data || 'Usuario o contraseña incorrectos');
                return;
            }

            // Guardar token
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem('username', identifier);
            localStorage.setItem('userId', data.userId);

            // Redirigir al feed
            window.location.href = '/componentes/feed.html';

        } catch (err) {
            console.error(err);
            alert('Error al conectar con el servidor');
        }
    });
});