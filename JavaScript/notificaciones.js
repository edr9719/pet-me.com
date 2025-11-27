document.addEventListener("DOMContentLoaded", () => {
    
    // Configuración
    // ⚠️ CAMBIAR POR TU IP DE AWS EL VIERNES
    const API_URL = "http://localhost:8080/api/v1/notificaciones"; 

    // --- CORRECCIÓN AQUÍ: Usamos las mismas llaves que tu login.js ---
    const token = localStorage.getItem("access_token"); 
    const userId = localStorage.getItem("userId");      

    // Referencias al DOM
    const listaContainer = document.getElementById("lista-notificaciones");
    const btnMarcarTodas = document.getElementById("btn-marcar-todas");
    const modalNotificaciones = document.getElementById('notificacionesModal');
    const badge = document.getElementById("badge-notificaciones"); // El punto rojo

    // --- 1. VALIDACIÓN DE SEGURIDAD ---
    if (!token || !userId) {
        console.warn("No hay sesión activa o faltan credenciales.");
        return; 
    }

    // --- 2. HEADERS ---
    const authHeaders = () => {
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    };

    // --- 3. FUNCIÓN BADGE (Punto Rojo) ---
    function verificarBadge() {
        if (!badge) return; // Si no pusiste el HTML del badge, no hace nada

        fetch(`${API_URL}/usuario/${userId}/sin-leer`, {
            method: "GET",
            headers: authHeaders()
        })
        .then(res => {
            if (res.ok) return res.json();
            return [];
        })
        .then(data => {
            if (data.length > 0) {
                badge.classList.remove("d-none"); // Muestra el punto
            } else {
                badge.classList.add("d-none");    // Oculta el punto
            }
        })
        .catch(err => console.error("Error badge:", err));
    }

    // --- 4. FUNCIÓN CARGAR LISTA ---
    function cargarNotificaciones() {
        // Poner "Cargando..." mientras esperamos
        if(listaContainer) {
            listaContainer.innerHTML = '<div class="text-center mt-3 text-white-50">Cargando...</div>';
        }

        fetch(`${API_URL}/usuario/${userId}`, {
            method: "GET",
            headers: authHeaders()
        })
        .then(response => {
            if (response.status === 403 || response.status === 401) {
                console.error("Sesión expirada");
                return null;
            }
            return response.json();
        })
        .then(data => {
            // Actualizar badge al abrir también
            if(data && badge) {
                const haySinLeer = data.some(n => !n.leida);
                haySinLeer ? badge.classList.remove("d-none") : badge.classList.add("d-none");
            }

            if (!listaContainer) return;
            listaContainer.innerHTML = ""; // Limpiar "Cargando..."

            if (!data || data.length === 0) {
                listaContainer.innerHTML = `
                    <div class="d-flex flex-column align-items-center justify-content-center mt-4">
                        <i class="bi bi-bell-slash text-white-50" style="font-size: 2rem;"></i>
                        <p class="text-white-50 mt-2">No tienes notificaciones nuevas.</p>
                    </div>`;
                return;
            }

            // Renderizar
            data.forEach(notif => {
                const item = document.createElement("div");
                const leidaClass = notif.leida ? "opacity-50" : "";
                
                let icon = '<i class="bi bi-bell-fill me-3 text-white fs-4"></i>';
                const tipo = notif.tipo ? notif.tipo.toString().toLowerCase() : 'sistema';

                if(tipo === 'adopcion') icon = '<i class="bi bi-heart-fill me-3 text-warning fs-4"></i>';
                if(tipo === 'mensaje') icon = '<i class="bi bi-chat-dots-fill me-3 text-info fs-4"></i>';
                if(tipo === 'sistema') icon = '<i class="bi bi-info-circle-fill me-3 text-light fs-4"></i>';

                if(tipo === 'like') { 
                icon = '<i class="bi bi-heart-fill me-3 text-danger fs-4"></i>'; 
                }
                if(tipo === 'comentario') {
                icon = '<i class="bi bi-chat-quote-fill me-3 text-success fs-4"></i>';
                }

                // Fecha formateada
                const fecha = notif.fechaCreacion ? new Date(notif.fechaCreacion).toLocaleDateString() : '';

                item.className = `d-flex align-items-center mb-3 pb-2 border-bottom position-relative ${leidaClass}`;
                item.innerHTML = `
                    ${icon}
                    <div class="flex-grow-1" style="cursor: pointer;" onclick="leerNotificacion(${notif.id})">
                        <p class="mb-0 fw-bold text-white">${notif.titulo}</p>
                        <small class="text-white-50">${notif.contenido}</small>
                        <div class="text-white-50" style="font-size: 0.75rem;">${fecha}</div>
                    </div>
                    <button class="btn btn-sm text-danger ms-2" onclick="borrarNotificacion(event, ${notif.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
                listaContainer.appendChild(item);
            });
        })
        .catch(err => {
            console.error("Error cargando:", err);
            if(listaContainer) listaContainer.innerHTML = '<p class="text-danger text-center">Error al cargar datos.</p>';
        });
    }

    // --- 5. INICIALIZACIÓN Y EVENTOS ---

    // Checar badge apenas cargue la página
    verificarBadge();

    // Evento Modal
    if(modalNotificaciones) {
        modalNotificaciones.addEventListener('show.bs.modal', cargarNotificaciones);
    }

    // Botón Marcar Todas
    if(btnMarcarTodas) {
        btnMarcarTodas.addEventListener("click", () => {
            fetch(`${API_URL}/usuario/${userId}/leer-todas`, {
                method: "PUT",
                headers: authHeaders()
            }).then(res => { 
                if(res.ok) {
                    cargarNotificaciones();
                    if(badge) badge.classList.add("d-none");
                }
            });
        });
    }

    // Funciones Globales
    window.leerNotificacion = (id) => {
        fetch(`${API_URL}/${id}/leer`, { method: "PUT", headers: authHeaders() })
            .then(res => { if(res.ok) cargarNotificaciones(); });
    };

    window.borrarNotificacion = (e, id) => {
        e.stopPropagation();
        if(!confirm("¿Borrar notificación?")) return;
        fetch(`${API_URL}/${id}`, { method: "DELETE", headers: authHeaders() })
            .then(res => { if(res.ok || res.status === 204) cargarNotificaciones(); });
    };
});