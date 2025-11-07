//Iniciar sesion
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

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
    }

    function limpiarErrores() {
        
        emailInput.classList.remove('is-invalid');
        
        emailError.textContent = '';
        
        passwordInput.classList.remove('is-invalid');
        passwordError.textContent = '';
    }
});