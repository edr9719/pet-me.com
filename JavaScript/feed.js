// ⚠️ CAMBIAR POR TU IP DE AWS EL VIERNES
const API_URL = "http://localhost:8080/api/v1"; 

// Variables globales
let imagenesSeleccionadas = [];
let publicaciones = []; // Lista original (todas)
let filtrosAvanzados = { especie: null, tamano: null, edad: null };

// Credenciales
const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

document.addEventListener('DOMContentLoaded', () => {
    cargarPublicaciones();
    inicializarEventos();
    inicializarBusqueda(); // Funcionalidad de tu compañera
});

// ==========================================
// 1. BÚSQUEDA Y FILTROS (Lógica de tu compañera)
// ==========================================

function inicializarBusqueda() {
    const searchInputDesktop = document.getElementById('searchInputDesktop');
    const searchBtnDesktop = document.getElementById('searchBtnDesktop');
    const searchInputMobile = document.getElementById('searchInputMobile');
    const searchBtnMobile = document.getElementById('searchBtnMobile');

    function realizarBusqueda(input) {
        if (!input) return;
        const term = input.value.toLowerCase().trim();
        
        // Filtro local sobre las publicaciones ya cargadas
        const resultados = publicaciones.filter((pub) => {
            const mascota = pub.mascota || {};
            const usuario = pub.usuario || {};
            
            return (
                (mascota.nombre_mascotas || '').toLowerCase().includes(term) ||
                (usuario.username || '').toLowerCase().includes(term) ||
                (mascota.descripcion || '').toLowerCase().includes(term)
            );
        });

        renderizarPublicaciones(resultados);

        if (resultados.length === 0 && term) {
            const contenedor = document.querySelector('.pet-cards-wrapper');
            if (contenedor) {
                contenedor.innerHTML = `
                    <div class="text-center mt-5">
                        <i class="bi bi-search" style="font-size: 3rem; color: var(--primary-color);"></i>
                        <p class="mt-3 text-muted">No encontramos coincidencias para "${term}"</p>
                        <button class="btn btn-primary" onclick="cargarPublicaciones()">Ver todo</button>
                    </div>`;
            }
        }
    }

    if (searchBtnDesktop) searchBtnDesktop.addEventListener('click', () => realizarBusqueda(searchInputDesktop));
    if (searchInputDesktop) searchInputDesktop.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); realizarBusqueda(searchInputDesktop); }});
    
    if (searchBtnMobile) searchBtnMobile.addEventListener('click', () => realizarBusqueda(searchInputMobile));
    if (searchInputMobile) searchInputMobile.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); realizarBusqueda(searchInputMobile); }});
}

// Filtros avanzados (Llamada al Backend)
async function aplicarFiltrosAvanzados() {
    console.log("Aplicando filtros:", filtrosAvanzados);

    const params = new URLSearchParams();
    if (filtrosAvanzados.especie) params.append('especie', filtrosAvanzados.especie);
    if (filtrosAvanzados.tamano) params.append('tamano', filtrosAvanzados.tamano);
    if (filtrosAvanzados.edad && filtrosAvanzados.edad > 0) params.append('edad', filtrosAvanzados.edad);

    if (params.toString() === '') {
        cargarPublicaciones(); // Si no hay filtros, recargar normal
        return;
    }

    const contenedor = document.querySelector('.pet-cards-wrapper');
    if (contenedor) contenedor.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary"></div><p>Filtrando...</p></div>';

    try {
        // endpoint de búsqueda
        const response = await fetch(`${API_URL}/mascotas/buscar?${params.toString()}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error('Error al filtrar');

        const data = await response.json();
        
        // Adaptador: Convertimos Mascotas a formato Publicacion para que el render no falle
        const publicacionesFiltradas = data.map(m => ({
            id: m.id_mascotas, // ID temporal
            mascota: m,
            usuario: m.user || { username: "Desconocido" },
            likes: 0, 
            comentarios: []
        }));

        renderizarPublicaciones(publicacionesFiltradas);

    } catch (error) {
        console.error(error);
        if (contenedor) contenedor.innerHTML = `<p class="text-center text-danger mt-5">No se encontraron resultados.</p>`;
    }
}

// ==========================================
// 2. CARGAR PUBLICACIONES (Tu lógica)
// ==========================================
function cargarPublicaciones() {
    const contenedor = document.querySelector('.pet-cards-wrapper');
    if(contenedor) contenedor.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p>Cargando huellitas...</p></div>';

    fetch(`${API_URL}/publicaciones`, {
        method: "GET",
        headers: getHeaders()
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al cargar el feed");
        return response.json();
    })
    .then(data => {
        publicaciones = data.sort((a, b) => b.id - a.id); 
        renderizarPublicaciones(publicaciones);
    })
    .catch(err => {
        console.error(err);
        if(contenedor) contenedor.innerHTML = '<p class="text-center text-danger mt-5">No se pudieron cargar las publicaciones.</p>';
    });
}

// ==========================================
// 3. CREAR PUBLICACIÓN (Fusión: Tu lógica + validación de edad de ella)
// ==========================================
async function handleNewPost(event) {
    event.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Debes iniciar sesión para publicar.");
        window.location.href = "/componentes/InicioSesion.html";
        return;
    }

    const form = document.getElementById('newPostForm');
    const alerta = document.getElementById('alerta-post');

    if (imagenesSeleccionadas.length === 0) {
        alerta.innerHTML = `<div class="alert alert-warning">Por favor sube al menos una foto 📸</div>`;
        return;
    }

    // CORRECCIÓN DE TU COMPAÑERA (ParseInt seguro)
    const edadInput = form['post-edad'].value;
    const edadValue = edadInput ? parseInt(edadInput) : 0;

    const nuevaPublicacion = {
        titulo: `En adopción: ${form['post-nombre'].value}`,
        tipo: "adopcion",
        likes: 0,
        usuario: { id: userId },
        mascota: {
            nombre_mascotas: form['post-nombre'].value,
            especie: form['post-especie'].value,
            sexo: form['post-sexo'].value,
            edad: edadValue,
            tamaño: form['post-tamaño'].value,
            descripcion: `${form['post-descripcion'].value} (Ubicación: ${form['post-ubicacion'].value})`,
            foto_principal: imagenesSeleccionadas[0].base64, 
            estado_adopcion: "DISPONIBLE"
        }
    };

    try {
        const response = await fetch(`${API_URL}/publicaciones/new-publicacion`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(nuevaPublicacion)
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
            modal.hide();
            form.reset();
            imagenesSeleccionadas = [];
            actualizarPreview();
            alerta.innerHTML = '';
            
            cargarPublicaciones(); 
            alert("¡Publicación creada con éxito! 🐾");
        } else {
            const errorText = await response.text();
            alerta.innerHTML = `<div class="alert alert-danger">Error al crear: ${errorText}</div>`;
        }
    } catch (error) {
        console.error(error);
        alerta.innerHTML = `<div class="alert alert-danger">Error de conexión.</div>`;
    }
}

// ==========================================
// 4. RENDERIZADO (Tu versión visual completa)
// ==========================================
function renderizarPublicaciones(lista) {
    const contenedor = document.querySelector('.pet-cards-wrapper');
    if (!contenedor) return;

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="text-center mt-5 text-muted">Aún no hay publicaciones.</p>';
        return;
    }

    contenedor.innerHTML = lista.map(pub => {
        // Manejo seguro por si es resultado de filtro o publicación normal
        const mascota = pub.mascota || {};
        const usuario = pub.usuario || { username: "Anónimo" };
        const foto = mascota.foto_principal || "/Img/placeholder.png";
        const emoji = mascota.especie === 'Gato' ? '🐱' : '🐶';
        
        // Foto de perfil
        const fotoUsuario = usuario.photoProfile || `https://ui-avatars.com/api/?name=${usuario.username}&background=random`;

        // Likes locales
        const likesGuardados = JSON.parse(localStorage.getItem('mis_likes') || "[]");
        const yaDioLike = likesGuardados.includes(pub.id);
        const claseCorazon = yaDioLike ? "text-danger filled" : "text-danger";
        const iconoCorazon = yaDioLike ? "favorite" : "favorite_border"; 

        // Comentarios
        const listaComentarios = (pub.comentarios || []).map(c => `
            <div class="mb-1 border-bottom pb-1">
                <strong>${c.autor ? c.autor.username : 'Usuario'}:</strong> ${c.texto}
            </div>
        `).join('');
        const cantidadComentarios = pub.comentarios ? pub.comentarios.length : 0;

        return `
        <div class="pet-card fade-in mb-4">
            <div class="pet-card-header">
                <div class="profile-pic" style="background-image: url('${fotoUsuario}');"></div>
                <div>
                    <p class="profile-name">${usuario.username}</p>
                    <p class="profile-location">${mascota.estado_adopcion === 'ADOPTADO' ? '🟢 ADOPTADO' : '📍 Disponible'}</p>
                </div>
            </div>

            <div class="pet-image" style="background-image: url('${foto}'); height: 350px; background-size: cover; background-position: center;"></div>

            <div class="pet-card-body">
                <div class="pet-info-header">
                    <div>
                        <p class="pet-name">${emoji} ${mascota.nombre_mascotas || 'Sin nombre'}</p>
                        <p class="pet-details">${mascota.edad || '?'} años, ${mascota.tamaño || ''}, ${mascota.sexo || ''}</p>
                    </div>
                    ${mascota.estado_adopcion !== 'ADOPTADO' ? 
                        `<button class="btn-adopt" onclick="iniciarAdopcion(${mascota.id_mascotas}, '${mascota.nombre_mascotas}')">Adóptame</button>` : 
                        `<button class="btn btn-secondary btn-sm" disabled>Finalizado</button>`
                    }
                </div>
                <p class="pet-description">${mascota.descripcion || ''}</p>
            </div>

            <div class="pet-card-footer d-flex justify-content-between px-3 pb-3">
                <div class="d-flex gap-3">
                    <button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="darLike(${pub.id})" ${yaDioLike ? 'disabled' : ''}>
                        <span class="material-symbols-outlined ${claseCorazon}">${iconoCorazon}</span>
                        <span class="action-count">${pub.likes || 0}</span>
                    </button>
                    
                    <button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="toggleComentarios(${pub.id})">
                        <span class="material-symbols-outlined text-primary">chat_bubble</span>
                        <span class="action-count">${cantidadComentarios}</span>
                    </button>
                </div>

                <button class="action-btn border-0 bg-transparent p-0" onclick="compartirPost('${mascota.nombre_mascotas}')">
                    <span class="material-symbols-outlined text-dark">share</span>
                </button>
            </div>

            <div id="comentarios-${pub.id}" class="comment-section d-none px-3 pb-3">
                <div class="input-group mb-2">
                    <input type="text" id="input-comentario-${pub.id}" class="form-control form-control-sm" placeholder="Escribe un comentario...">
                    <button class="btn btn-sm btn-primary" onclick="enviarComentario(${pub.id})">Enviar</button>
                </div>
                <div class="mt-2 small text-muted" id="lista-comentarios-${pub.id}" style="max-height: 150px; overflow-y: auto;">
                    ${listaComentarios}
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// ==========================================
// 5. SOLICITUD DE ADOPCIÓN (WHATSAPP - Lógica de tu compañera)
// ==========================================

function getTelefonoUsuarioPorMascotaId(petId) {
    const pub = publicaciones.find(p => p.mascota && p.mascota.id_mascotas === petId);
    // Nota: backend usa 'telephone', frontend form usa 'telefono'
    return pub && pub.usuario ? pub.usuario.telephone : null; 
}

function handleAdoptionFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const petId = parseInt(form.dataset.petId);
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        alert('Completa todos los campos requeridos.');
        return;
    }

    const nombreCompleto = form.querySelector('#nombreCompleto').value;
    const nombreMascota = document.getElementById('nombreMascotaModal').textContent.trim();
    const telefonoDueno = getTelefonoUsuarioPorMascotaId(petId);

    if (!telefonoDueno || telefonoDueno === 0) {
        alert('⚠️ El dueño no ha registrado un teléfono. Envía la solicitud y le notificaremos por el sistema.');
        // Aquí podrías agregar la lógica de tu notificación interna si quisieras
        return;
    }

    const mensaje = `Hola, mi nombre es *${nombreCompleto}*. Me interesa adoptar a *${nombreMascota}*.`;
    const urlWhatsapp = `https://wa.me/${telefonoDueno}?text=${encodeURIComponent(mensaje)}`;

    window.open(urlWhatsapp, '_blank');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('adoptModal'));
    if (modal) modal.hide();
}

// ==========================================
// 6. FUNCIONES GLOBALES (Tus acciones)
// ==========================================

window.darLike = (publicacionId) => {
    const userId = localStorage.getItem("userId");
    let likesGuardados = JSON.parse(localStorage.getItem('mis_likes') || "[]");
    if (likesGuardados.includes(publicacionId)) return;

    fetch(`${API_URL}/publicaciones/${publicacionId}/like?userId=${userId}`, {
        method: "POST",
        headers: getHeaders()
    }).then(res => {
        if(res.ok) {
            likesGuardados.push(publicacionId);
            localStorage.setItem('mis_likes', JSON.stringify(likesGuardados));
            cargarPublicaciones(); 
        }
    });
};

window.toggleComentarios = (id) => {
    const section = document.getElementById(`comentarios-${id}`);
    if(section) section.classList.toggle('d-none');
};

window.enviarComentario = (id) => {
    const userId = localStorage.getItem("userId");
    const input = document.getElementById(`input-comentario-${id}`);
    const texto = input.value.trim();
    const miUsuario = localStorage.getItem("usuarioNombre") || "Tú"; 

    if(!texto) return;

    fetch(`${API_URL}/publicaciones/${id}/comentario?userId=${userId}&texto=${texto}`, {
        method: "POST",
        headers: getHeaders()
    })
    .then(res => {
        if(res.ok) {
            const lista = document.getElementById(`lista-comentarios-${id}`);
            const div = document.createElement('div');
            div.className = "mb-1 border-bottom pb-1";
            div.innerHTML = `<strong>${miUsuario}:</strong> ${texto}`;
            lista.appendChild(div);
            input.value = ""; 
        } else {
            alert("Error al enviar comentario");
        }
    })
    .catch(err => console.error(err));
};

window.compartirPost = (nombreMascota) => {
    const data = {
        title: `Adopta a ${nombreMascota}`,
        text: `¡Mira esta mascota en PetMe! ${nombreMascota} busca hogar.`,
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(data).catch(console.error);
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado 📋');
    }
};

window.iniciarAdopcion = (id, nombre) => {
    const modalElem = document.getElementById('adoptModal');
    const spanNombre = document.getElementById('nombreMascotaModal');
    const form = document.getElementById('adoptionForm');
    
    if(spanNombre) spanNombre.textContent = nombre;
    if(form) {
        form.dataset.petId = id;
        form.classList.remove('was-validated');
    }
    
    const modal = new bootstrap.Modal(modalElem);
    modal.show();
};

function convertirFileABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function actualizarPreview() {
    const container = document.getElementById('preview-container');
    if(!container) return;
    container.innerHTML = imagenesSeleccionadas.map((img, i) => `
        <div class="position-relative d-inline-block m-1">
            <img src="${img.base64}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
            <button class="btn btn-danger btn-sm position-absolute top-0 end-0 p-0" 
                    style="width: 20px; height: 20px; line-height: 1;"
                    onclick="eliminarImagen(${i})">×</button>
        </div>
    `).join('');
    container.classList.remove('d-none');
}

window.eliminarImagen = (index) => {
    imagenesSeleccionadas.splice(index, 1);
    actualizarPreview();
};

// ==========================================
// 7. INICIALIZACIÓN DE EVENTOS (Merged)
// ==========================================
function inicializarEventos() {
    const newPostForm = document.getElementById('newPostForm');
    if(newPostForm) newPostForm.addEventListener('submit', handleNewPost);

    // Evento para el form de adopción (WhatsApp)
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) adoptionForm.addEventListener('submit', handleAdoptionFormSubmit);

    const fileInput = document.getElementById('post-imagen');
    if(fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            for (const file of files) {
                if (imagenesSeleccionadas.length >= 1) { 
                    alert("Por ahora solo se permite 1 foto por publicación.");
                    break;
                }
                const base64 = await convertirFileABase64(file);
                imagenesSeleccionadas.push({ file, base64 });
            }
            actualizarPreview();
            fileInput.value = '';
        });
    }

    // Filtros de tu compañera
    document.querySelectorAll('.filter-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const el = e.currentTarget;
            const tipo = el.dataset.tipo;
            const valor = el.dataset.valor;

            if(!tipo) return;

            if (el.classList.contains('active')) {
                el.classList.remove('active');
                filtrosAvanzados[tipo] = null;
            } else {
                document.querySelectorAll(`.filter-link[data-tipo="${tipo}"]`).forEach(l => l.classList.remove('active'));
                el.classList.add('active');
                filtrosAvanzados[tipo] = valor;
            }
            aplicarFiltrosAvanzados();
        });
    });

    const ageSlider = document.getElementById('ageSlider');
    const ageValueEl = document.getElementById('ageValue');
    if (ageSlider && ageValueEl) {
        ageValueEl.textContent = 'Cualquier edad';
        ageSlider.addEventListener('input', () => {
            const valor = parseFloat(ageSlider.value);
            const entero = Math.round(valor);
            ageValueEl.textContent = valor > 0 ? `Máx. ${valor} años` : 'Cualquier edad';
            filtrosAvanzados.edad = (entero > 0) ? entero : null;
            aplicarFiltrosAvanzados();
        });
    }
}