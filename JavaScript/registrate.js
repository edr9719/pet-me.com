const API_URL = "http://localhost:8080/api/v1/users";
const estados = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
  'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
  'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];


document.addEventListener('DOMContentLoaded', function () {

    // --- SELECCIÓN DE ELEMENTOS 
    const form = document.getElementById('registerForm');
    const nombre = document.getElementById('name');
    const apellidos = document.getElementById('lastname');
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const country = document.getElementById('estado'); 
    const ciudad = document.getElementById('city');
    const telefono = document.getElementById('telephone');
    const terminos = document.getElementById('terminos');
    const togglePassword = document.getElementById('togglePassword');
    const passwordHint = document.getElementById('password-hint');
    
    const campos = [nombre, apellidos, email, username, password, country, ciudad,telefono, terminos];

    // ---  ESTADOS 
    if (country) {
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = ""; 
        defaultOption.textContent = "Selecciona un estado";
        defaultOption.selected = true;
        country.appendChild(defaultOption);

        // Añadimos cada estado del array
        estados.forEach((estadoNombre) => {
            const option = document.createElement('option');
            option.value = estadoNombre;
            option.textContent = estadoNombre;
            country.appendChild(option);
        });
    }
    
    // --- LISTENERS DE CONTRASEÑA 
    password.addEventListener('focus', function () {
        passwordHint.classList.remove('d-none');
    });
    password.addEventListener('blur', function () {
        passwordHint.classList.add('d-none');
    });
    togglePassword.addEventListener('click', function () {
        const icon = this.querySelector('i');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });

    // SUMBIT
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Detenemos el envío

        //  VALIDAR 
        if (validarFormulario()) {
            
            console.log('Formulario VÁLIDO. Guardando y redirigiendo...');

            // ... (Validar Formulario es true)

// --- GUARDAR EN LOCALSTORAGE ---
//const users = JSON.parse(localStorage.getItem('users')) || [];
const inputs = form.querySelectorAll('input[name]');
const select = document.getElementById('estado');

const newUser = {}; 
inputs.forEach((input) => {
    if (input.name && input.type !== 'checkbox') {
        newUser[input.name] = input.value;
    }
});
newUser["country"] = select.value;
newUser["status"] = true;
newUser[select.name] = select.value;
newUser["password"] = document.getElementById('password').value;
newUser["username"] = document.getElementById('username').value;
newUser["city"] = document.getElementById('city').value;

/* ============ SE COMENTA ALMACENAMIENTO LOCAL===========
  --- VALIDACIÓN DE DUPLICADOS ---
// Buscamos si ya existe un usuario con ese email
const userExists = users.find(user => user.email === newUser.email);

if (userExists) {
    // Si 'userExists' no es 'undefined', el usuario ya existe
    console.log('Formulario INVÁLIDO. El email ya está registrado.');
    alert('Este correo electrónico ya está registrado. Por favor, usa otro.');
    
    mostrarError(email); 

} else {
    // Si no existe (es undefined), lo agregamos
    console.log('Formulario VÁLIDO. Guardando y redirigiendo...');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Redirigir
    window.location.href = '/componentes/InicioSesion.html';
}*/

// --- Enviar al backend ---
        fetch(`${API_URL}/new-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
        .then(response => {
            if (response.status === 201) {
                window.location.href = "/componentes/InicioSesion.html";
            } else if (response.status === 409) {
                alert("Este correo o usuario ya está registrado.");
                mostrarError(email);
            } else {
                alert("Error inesperado al registrar. Intenta de nuevo.");
            }
        })
        .catch(error => {
            console.error("Error en el registro:", error);
            alert("No se pudo conectar con el servidor.");
        });
    }
});


  // =========VALIDACIONES=============
    function validarFormulario() {
        limpiarErrores();
        let esValido = true;

        const nombreVal = nombre.value.trim();
        const apellidosVal = apellidos.value.trim();
        const emailVal = email.value.trim();
        const usernameVal = username.value.trim();
        const passwordVal = password.value.trim();
        const estadoVal = country.value.trim();
        const telefonoVal = telefono.value.trim();
        const ciudadVal = ciudad.value.trim();
        const terminosVal = terminos.checked;
        
        // Validaciones
        
        if (nombreVal === '') {
            mostrarError(nombre);
            esValido = false;
        } else {
            mostrarExito(nombre);
        }
        if (apellidosVal === '') {
            mostrarError(apellidos);
            esValido = false;
        } else {
            mostrarExito(apellidos);
        }
        if (emailVal === '' || !esEmailValido(emailVal)) {
            mostrarError(email);
            esValido = false;
        } else {
            mostrarExito(email);
        }
        if (usernameVal === '') {
            mostrarError(username);
            esValido = false;
        } else {
            mostrarExito(username);
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const feedbackDiv = document.getElementById('password-feedback');

        if (passwordVal === '') {
            feedbackDiv.textContent = 'La contraseña es requerida.';
            mostrarError(password);
            esValido = false;
        } else if (!passwordRegex.test(passwordVal)) {
            feedbackDiv.textContent = 'Debe tener 8+ caracteres, 1 mayúscula, 1 minúscula y 1 número.';
            mostrarError(password);
            esValido = false;
        } else {
            mostrarExito(password);
        }
        
        if (estadoVal === '') {
            mostrarError(country);
            esValido = false;
        } else {
            mostrarExito(country);
        }
        if (ciudadVal === '') {
            mostrarError(ciudad);
            esValido = false;
        } else {
            mostrarExito(ciudad);
        }
        if (!terminosVal) {
            mostrarError(terminos);
            esValido = false;
        } else {
            mostrarExito(terminos);
        }

        return esValido;
    }

    function mostrarError(input) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    function mostrarExito(input) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    }

    function limpiarErrores() {
        campos.forEach(campo => {
            campo.classList.remove('is-invalid');
            campo.classList.remove('is-valid');
        });
        
        const feedbackDiv = document.getElementById('password-feedback');
        if (feedbackDiv) {
            feedbackDiv.textContent = 'La contraseña es requerida.';
        }
    }

    function esEmailValido(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

}); 