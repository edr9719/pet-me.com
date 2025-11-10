//Iniciar sesion
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

// --- OJO ---
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
// ---OJO ---

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 
        
        limpiarErrores();

        const email = emailInput.value;
        const password = passwordInput.value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userFound = users.find(user => user.email === email);

        if (!userFound) {

            mostrarError(emailInput, emailError, 'El correo electrónico no está registrado.');
        
        } else if (userFound.password === password) {
            
            sessionStorage.setItem('currentUser', JSON.stringify(userFound));
            window.location.href = '/componentes/feed.html'; 
        
        } else {
          
            mostrarError(passwordInput, passwordError, 'Contraseña incorrecta.');
        }
    });

    function mostrarError(input, errorDiv, mensaje) {
        input.classList.add('is-invalid');
        errorDiv.textContent = mensaje;
        errorDiv.classList.add('d-block');
    }

    function limpiarErrores() {
        
        emailInput.classList.remove('is-invalid');
        
        emailError.textContent = '';
        emailError.classList.remove('d-block');
        
        passwordInput.classList.remove('is-invalid');
        passwordError.textContent = '';
        passwordError.classList.remove('d-block');
    }
});