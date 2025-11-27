// OlvidasteContraseña.js
const API_BASE_URL = "http://localhost:8080"; 

document.addEventListener("DOMContentLoaded", () => {
    const recoveryForm = document.getElementById("recoveryForm");
    const feedback = document.getElementById("recovery-feedback");
    const submitBtn = document.querySelector("button[type='submit']");

    if(recoveryForm) {
        recoveryForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("recovery-input").value.trim();

            submitBtn.textContent = "Enviando...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    // ÉXITO: Ocultamos el formulario y mostramos mensaje
                    document.querySelector(".card-body").innerHTML = `
                        <div class="text-center">
                            <i class="bi bi-envelope-check-fill text-success" style="font-size: 3rem;"></i>
                            <h5 class="mt-3">¡Correo Enviado!</h5>
                            <p>Revisa tu bandeja de entrada y sigue el enlace para cambiar tu contraseña.</p>
                        </div>
                    `;
                    document.querySelector(".card-footer").style.display = "none";
                } else {
                    feedback.textContent = "No encontramos ese correo.";
                    feedback.style.display = "block";
                    submitBtn.textContent = "Buscar";
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error(error);
                feedback.textContent = "Error de conexión.";
                feedback.style.display = "block";
            }
        });
    }
});