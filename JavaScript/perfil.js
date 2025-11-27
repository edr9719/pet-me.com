document.addEventListener("DOMContentLoaded", () => {
    
    // ⚠️ CAMBIAR IP EN AWS
    const API_URL = "http://localhost:8080/api/v1"; 

    // Credenciales
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("access_token");

    // Elementos del DOM (Perfil)
    const profileName = document.querySelector('.profile-card h1');
    const profileDesc = document.querySelector('.profile-card .text-muted-custom.small.text-center');
    const profileEmail = document.querySelectorAll('.profile-card .d-flex.align-items-center span.small')[0];
    const profilePhone = document.querySelectorAll('.profile-card .d-flex.align-items-center span.small')[1];
    const profileLocation = document.querySelectorAll('.profile-card .d-flex.align-items-center span.small')[2];
    
    // Elementos del Modal de Edición
    const editNombre = document.getElementById('editNombre');
    const editApellido = document.getElementById('editApellido');
    const editDescription = document.getElementById('editDescription');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editLocation = document.getElementById('editLocation');
    const saveBtn = document.getElementById('saveProfileBtn');

    // Headers
    const authHeaders = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    // ==========================================
    // 1. CARGAR DATOS DEL USUARIO
    // ==========================================
    function cargarDatosUsuario() {
        if (!userId || !token) return;

        fetch(`${API_URL}/users/id-user/${userId}`, {
            method: "GET",
            headers: authHeaders
        })
        .then(res => res.json())
        .then(user => {
            // Llenar Tarjeta de Perfil
            const fullName = `${user.name} ${user.lastname}`;
            const ubicacion = `${user.city || ''}, ${user.country || ''}`;
            
            profileName.textContent = fullName;
            profileEmail.textContent = user.email;
            
            // Datos opcionales (si son null, ponemos un texto por defecto)
            profilePhone.textContent = user.telephone || "Agrega un teléfono";
            profileLocation.textContent = ubicacion !== ", " ? ubicacion : "Agrega tu ubicación";
            
            // Descripción: Como User.java NO TIENE campo de descripción,
            // usaremos localStorage temporalmente o mostraremos un default.
            // (Si quieres persistencia real, necesitas agregar el campo en la BD).
            const localDesc = localStorage.getItem(`desc_${userId}`);
            profileDesc.textContent = localDesc || "¡Hola! Soy nuevo en PetMe.";

            // Llenar Modal de Edición (Pre-cargar datos)
            editNombre.value = user.name;
            editApellido.value = user.lastname;
            editEmail.value = user.email;
            editPhone.value = user.telephone || "";
            // Separamos ciudad y pais si es posible, o ponemos todo en ciudad para editar
            editLocation.value = user.city || ""; 
            editDescription.value = localDesc || "";
        })
        .catch(err => console.error("Error cargando perfil:", err));
    }

    // ==========================================
    // 2. ACTUALIZAR PERFIL (PUT)
    // ==========================================
    if(saveBtn) {
        saveBtn.addEventListener("click", () => {
            // Armamos el objeto JSON tal como lo pide User.java
            // Nota: User.java pide 'city' y 'country'. Aquí asumiremos que el input de ubicación es la ciudad.
            const updatedUser = {
                name: editNombre.value.trim(),
                lastname: editApellido.value.trim(),
                email: editEmail.value.trim(),
                telephone: parseInt(editPhone.value.trim()) || 0,
                city: editLocation.value.trim(),
                country: "México",
                username: localStorage.getItem("username"),
                
                // 🔥 AGREGAMOS ESTO: Enviamos la foto que está en el navegador
                photoProfile: localStorage.getItem('profileImage') || "" 
            };

            // Guardamos descripción en LocalStorage (ya que no hay campo en BD)
            localStorage.setItem(`desc_${userId}`, editDescription.value.trim());

            // Enviar al Backend
            fetch(`${API_URL}/users/update-user/${userId}`, {
                method: "PUT",
                headers: authHeaders,
                body: JSON.stringify(updatedUser)
            })
            .then(res => {
                if(res.ok) {
                    // Cerrar modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
                    modal.hide();
                    
                    // Recargar datos visuales
                    cargarDatosUsuario();
                    alert("Perfil actualizado con éxito ✅");
                } else {
                    alert("Error al actualizar perfil. Verifica los datos.");
                }
            })
            .catch(err => console.error("Error updating:", err));
        });
    }

    // ==========================================
    // 3. CARGAR PUBLICACIONES (Ya lo tenías)
    // ==========================================
    const container = document.getElementById("mis-publicaciones-container");
    const tabPublicaciones = document.getElementById("publicacionesTab");

    if(tabPublicaciones) {
        tabPublicaciones.addEventListener("click", cargarMisPublicaciones);
    }

    function cargarMisPublicaciones() {
        if(!userId || !token) {
            container.innerHTML = '<p class="text-center text-danger">Inicia sesión.</p>';
            return;
        }

        fetch(`${API_URL}/publicaciones/usuario/${userId}`, {
            method: "GET",
            headers: authHeaders
        })
        .then(res => res.json())
        .then(data => {
            container.innerHTML = ""; 

            if(data.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-camera text-muted" style="font-size: 3rem;"></i>
                        <p class="text-muted mt-3">Aún no has publicado nada.</p>
                    </div>`;
                return;
            }

            data.forEach(pub => {
                const mascota = pub.mascota || {};
                const esAdoptado = mascota.estado_adopcion === "ADOPTADO";
                let botonAccion = "";
                
                if (esAdoptado) {
                    botonAccion = `<span class="badge bg-success"><i class="bi bi-check-circle"></i> ¡Adoptado!</span>`;
                } else {
                    botonAccion = `
                        <button class="btn btn-sm btn-outline-success" onclick="marcarAdoptado(${mascota.id_mascotas})">
                            <i class="bi bi-house-heart-fill"></i> Marcar como Adoptado
                        </button>`;
                }

                const foto = mascota.foto_principal || "/Img/placeholder.png";
                const fecha = pub.fechaPublicacion ? new Date(pub.fechaPublicacion).toLocaleDateString() : "";

                const cardHTML = `
                <div class="col-12">
                    <div class="profile-card p-4 shadow-sm border rounded mb-3">
                        <div class="d-flex align-items-start gap-3">
                            <img src="${foto}" alt="${mascota.nombre_mascotas}" 
                                 class="rounded" style="width: 120px; height: 120px; object-fit: cover" />
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start">
                                    <h5 class="font-display fw-bold mb-2">${pub.titulo}</h5>
                                    ${botonAccion}
                                </div>
                                <p class="text-muted-custom small mb-2">Publicado el: ${fecha}</p>
                                <p class="mb-2 text-dark">${mascota.descripcion || "Sin descripción"}</p>
                                <div class="d-flex gap-2">
                                    <span class="badge bg-light text-dark border">❤️ ${pub.likes || 0} Likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        })
        .catch(err => console.error(err));
    }

    window.marcarAdoptado = (mascotaId) => {
        if(!confirm("¿Confirmas que fue adoptado?")) return;
        fetch(`${API_URL}/mascotas/${mascotaId}/estado?estado=ADOPTADO`, {
            method: "PUT",
            headers: authHeaders
        }).then(res => { if(res.ok) { cargarMisPublicaciones(); } });
    };

    // --- INICIALIZAR ---
    cargarDatosUsuario(); // Cargar datos del perfil al abrir la página
    inicializarEventos();
});
  // ==========================================
// 4. CERRAR SESIÓN (Definido fuera del DOMContentLoaded para mejor organización)
// ==========================================
function cerrarSesion() {
  // 1. Eliminar tokens y userId del almacenamiento local
  localStorage.removeItem('access_token');
  localStorage.removeItem('userId');

  // 2. Redirigir al usuario a la página de inicio de sesión
  window.location.href = '/componentes/InicioSesion.html';
}

// ==========================================
// 5. CONECTAR EVENTOS DE CERRAR SESIÓN
// ==========================================
function inicializarEventos() {
    // Conectar el botón de Cerrar Sesión del perfil (el nuevo)
    const logoutProfileBtn = document.getElementById('logoutProfileBtn');
    if (logoutProfileBtn) {
      logoutProfileBtn.addEventListener('click', cerrarSesion);
    }

    // Si también tienes botones de Logout en el navbar (Desktop/Mobile),
    // puedes conectarlos aquí:
    
    // const logoutDesktopBtn = document.getElementById('logoutDesktop');
    // if (logoutDesktopBtn) {
    //   logoutDesktopBtn.addEventListener('click', cerrarSesion);
    // }

    // const logoutMobileBtn = document.getElementById('logoutMobile');
    // if (logoutMobileBtn) {
    //   logoutMobileBtn.addEventListener('click', cerrarSesion);
    // }
}