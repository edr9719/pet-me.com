/*document.addEventListener('DOMContentLoaded', () => {
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryInput = document.getElementById('recovery-input');
    const recoveryFeedback = document.getElementById('recovery-feedback');

    if (recoveryForm) {
        recoveryForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Detiene el envío de formulario HTML por defecto

            const email = recoveryInput.value;
            // Aquí debes usar la URL de tu endpoint de backend
            const backendUrl = '/api/forgot-password'; 

            try {
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();

                if (response.ok) {
                    // ÉXITO: El servidor procesó la solicitud (no significa que el correo exista, por seguridad)
                    recoveryFeedback.style.display = 'block';
                    recoveryFeedback.classList.remove('text-danger');
                    recoveryFeedback.classList.add('text-success');
                    recoveryFeedback.textContent = 'Si tu correo está registrado, recibirás un enlace de recuperación en breve.';
                } else {
                    // ERROR: El servidor respondió con un error (ej. 500)
                    recoveryFeedback.style.display = 'block';
                    recoveryFeedback.classList.remove('text-success');
                    recoveryFeedback.classList.add('text-danger');
                    recoveryFeedback.textContent = 'Hubo un error al procesar tu solicitud. Inténtalo de nuevo.';
                }
            } catch (error) {
                // ERROR DE CONEXIÓN: El servidor no está disponible
                console.error('Error de conexión:', error);
                recoveryFeedback.style.display = 'block';
                recoveryFeedback.classList.remove('text-success');
                recoveryFeedback.classList.add('text-danger');
                recoveryFeedback.textContent = 'No se pudo conectar al servidor. Verifica tu conexión.';
            }
        });
    }
});*/

// --- SIMULACIÓN DE REGISTROS con localstorage ---
const cuentasRegistradas = [
    { correo: 'test@petme.com' },
    { correo: 'demo@petme.com' }
];
localStorage.setItem('cuentas_petme', JSON.stringify(cuentasRegistradas));
console.log('Cuentas de prueba cargadas en Local Storage.');

document.addEventListener('DOMContentLoaded', () => {
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryInput = document.getElementById('recovery-input');
    const recoveryFeedback = document.getElementById('recovery-feedback');

    if (recoveryForm) {
        recoveryForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Detenemos el envío del formulario

            const emailIngresado = recoveryInput.value.trim().toLowerCase();
            
            // 1. Obtener "cuentas" del Local Storage
            const cuentasJSON = localStorage.getItem('cuentas_petme');
            const cuentas = cuentasJSON ? JSON.parse(cuentasJSON) : [];
            
            // 2. Simular Verificación en Base de Datos
            const cuentaExiste = cuentas.some(cuenta => cuenta.correo === emailIngresado);
            
            // --- MOSTRAR FEEDBACK EN LA INTERFAZ ---
            recoveryFeedback.style.display = 'block';
            
            if (cuentaExiste) {
                // SIMULACIÓN DE ÉXITO: El correo existe
                
                // Limpiar estilos de error
                recoveryFeedback.classList.remove('text-danger');
                
                // Aplicar estilos de éxito (usaremos text-success de Bootstrap)
                recoveryFeedback.classList.add('text-success');
                
                // Mensaje de éxito simulado (no confirmamos si el correo existe por seguridad)
                recoveryFeedback.textContent = 'Si tu correo está registrado, hemos enviado las instrucciones de recuperación. Revisa tu bandeja de entrada.';
                
            } else {
                // SIMULACIÓN DE ERROR: El correo NO existe
                
                // Limpiar estilos de éxito
                recoveryFeedback.classList.remove('text-success');
                
                // Aplicar estilos de error
                recoveryFeedback.classList.add('text-danger');
                
                // Mensaje de error
                recoveryFeedback.textContent = 'El correo electrónico proporcionado no está asociado a ninguna cuenta PetMe. Por favor, verifica e inténtalo de nuevo.';
            }
        });
    }
});