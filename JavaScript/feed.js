// ⚠️ CAMBIAR POR TU IP DE AWS EL VIERNES
const API_URL = "http://localhost:8080/api/v1"; 

// Variables globales
let imagenesSeleccionadas = [];
let publicaciones = [];

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
});

// =======================
<<<<<<< HEAD
// 1. CARGAR PUBLICACIONES (GET)
=======
// 1. BÚSQUEDA DE PUBLICACIONES
// =======================
function filtrarPublicaciones(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    return publicaciones;
  }

  return publicaciones.filter((pub) => {
    const mascota = pub.mascota || {};
    const usuario = pub.usuario || {};

    const nombreMascota = (mascota.nombre_mascotas || '').toLowerCase();
    const nombreUsuario = (usuario.name || '').toLowerCase();
    const username = (usuario.username || '').toLowerCase();
    const descripcion = (mascota.descripcion || '').toLowerCase();

    return (
      nombreMascota.includes(term) ||
      nombreUsuario.includes(term) ||
      username.includes(term) ||
      descripcion.includes(term)
    );
  });
}

function inicializarBusqueda() {
  const searchInputDesktop = document.getElementById('searchInputDesktop');
  const searchBtnDesktop = document.getElementById('searchBtnDesktop');
  const searchInputMobile = document.getElementById('searchInputMobile');
  const searchBtnMobile = document.getElementById('searchBtnMobile');

  function realizarBusqueda(input) {
    if (!input) return;

    const searchTerm = input.value;
    const resultados = filtrarPublicaciones(searchTerm);
    renderizarPublicaciones(resultados);

    if (resultados.length === 0 && searchTerm.trim()) {
      const contenedor = document.querySelector('.pet-cards-wrapper');
      if (contenedor) {
        contenedor.innerHTML = `
						<div class="text-center mt-5">
							<i class="bi bi-search" style="font-size: 3rem; color: var(--primary-color);"></i>
							<p class="mt-3 text-muted">No se encontraron publicaciones que coincidan con "${searchTerm}"</p>
							<button class="btn btn-primary" onclick="limpiarBusqueda()">Ver todas las publicaciones</button>
						</div>
					`;
      }
    }
  }

  if (searchBtnDesktop) {
    searchBtnDesktop.addEventListener('click', () =>
      realizarBusqueda(searchInputDesktop)
    );
  }

  if (searchInputDesktop) {
    searchInputDesktop.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        realizarBusqueda(searchInputDesktop);
      }
    });
  }

  if (searchBtnMobile) {
    searchBtnMobile.addEventListener('click', () =>
      realizarBusqueda(searchInputMobile)
    );
  }

  if (searchInputMobile) {
    searchInputMobile.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        realizarBusqueda(searchInputMobile);
      }
    });
  }
}

function limpiarBusqueda() {
  const searchInputDesktop = document.getElementById('searchInputDesktop');
  const searchInputMobile = document.getElementById('searchInputMobile');

  if (searchInputDesktop) searchInputDesktop.value = '';
  if (searchInputMobile) searchInputMobile.value = '';

  renderizarPublicaciones(publicaciones);
}

window.limpiarBusqueda = limpiarBusqueda;

// =======================
// 2. CARGAR PUBLICACIONES (GET)
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175
// =======================
function cargarPublicaciones() {
    const contenedor = document.querySelector('.pet-cards-wrapper');
    if(contenedor) contenedor.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p>Cargando huellitas...</p></div>';

    fetch(`${API_URL}/publicaciones`, {
        method: "GET",
        headers: getHeaders()
    })
<<<<<<< HEAD
    .then(response => {
        if (!response.ok) throw new Error("Error al cargar el feed");
        return response.json();
=======
    .then((data) => {
      // Ordenar: las más nuevas primero (por ID, ya que es autoincremental)
      publicaciones = data.sort((a, b) => b.id - a.id);
      renderizarPublicaciones(publicaciones);
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175
    })
    .then(data => {
        // Ordenar: las más nuevas primero
        publicaciones = data.sort((a, b) => b.id - a.id); 
        renderizarPublicaciones(publicaciones);
    })
    .catch(err => {
        console.error(err);
        if(contenedor) contenedor.innerHTML = '<p class="text-center text-danger mt-5">No se pudieron cargar las publicaciones.</p>';
    });
}

// =======================
// 2. CREAR PUBLICACIÓN (POST)
// =======================
async function handleNewPost(event) {
<<<<<<< HEAD
<<<<<<< HEAD
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

    const nuevaPublicacion = {
        titulo: `En adopción: ${form['post-nombre'].value}`,
        tipo: "adopcion",
        likes: 0,
        usuario: { id: userId },
        mascota: {
            nombre_mascotas: form['post-nombre'].value,
            especie: form['post-especie'].value,
            sexo: form['post-sexo'].value,
            edad: parseInt(form['post-edad'].value),
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
=======
  event.preventDefault();
  const userId = localStorage.getItem('userId');
=======
  event.preventDefault();
  const userId = localStorage.getItem('userId');
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9

  if (!userId) {
    alert('Debes iniciar sesión para publicar.');
    window.location.href = '/componentes/InicioSesion.html';
    return;
  }

  const form = document.getElementById('newPostForm');
  const alerta = document.getElementById('alerta-post');

  if (imagenesSeleccionadas.length === 0) {
    alerta.innerHTML = `<div class="alert alert-warning">Por favor sube al menos una foto 📸</div>`;
    return;
  }

  const nuevaPublicacion = {
    titulo: `En adopción: ${form['post-nombre'].value}`,
    tipo: 'adopcion',
    likes: 0,
    usuario: { id: userId },
    mascota: {
      nombre_mascotas: form['post-nombre'].value,
      especie: form['post-especie'].value,
      sexo: form['post-sexo'].value,
      edad: parseInt(form['post-edad'].value),
      tamaño: form['post-tamaño'].value,
      descripcion: `${form['post-descripcion'].value} (Ubicación: ${form['post-ubicacion'].value})`,
      foto_principal: imagenesSeleccionadas[0].base64,
      estado_adopcion: 'DISPONIBLE',
    },
  };

  try {
    const response = await fetch(`${API_URL}/publicaciones/new-publicacion`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(nuevaPublicacion),
    });

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('newPostModal')
      );
      modal.hide();
      form.reset();
      imagenesSeleccionadas = [];
      actualizarPreview();
      alerta.innerHTML = '';

<<<<<<< HEAD
    if (response.ok) {
      // ----------------------------------------------------
      // LÓGICA DE ÉXITO (FALTA EN TU SNIPPET)
      // ----------------------------------------------------
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('newPostModal')
      );
      modal.hide();
      form.reset();
      imagenesSeleccionadas = [];
      actualizarPreview();
      alerta.innerHTML = '';

      cargarPublicaciones();
      alert('¡Publicación creada con éxito! 🐾');
    } else {
      const errorText = await response.text();
      alerta.innerHTML = `<div class="alert alert-danger">Error al crear: ${errorText}</div>`;
    }
  } catch (error) {
    // ----------------------------------------------------
    // BLOQUE CATCH (FALTA EN TU SNIPPET)
    // ----------------------------------------------------
    console.error(error);
    alerta.innerHTML = `<div class="alert alert-danger">Error de conexión.</div>`;
  }
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175
=======
      cargarPublicaciones();
      alert('¡Publicación creada con éxito! 🐾');
    } else {
      const errorText = await response.text();
      alerta.innerHTML = `<div class="alert alert-danger">Error al crear: ${errorText}</div>`;
    }
  } catch (error) {
    console.error(error);
    alerta.innerHTML = `<div class="alert alert-danger">Error de conexión.</div>`;
  }
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9
}

// =======================
// 3. RENDERIZADO (TARJETAS + COMENTARIOS)
// =======================
function renderizarPublicaciones(lista) {
    const contenedor = document.querySelector('.pet-cards-wrapper');
    if (!contenedor) return;

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="text-center mt-5 text-muted">Aún no hay publicaciones.</p>';
        return;
    }

<<<<<<< HEAD
    contenedor.innerHTML = lista.map(pub => {
        const mascota = pub.mascota || {};
        const usuario = pub.usuario || { username: "Anónimo" };
        const foto = mascota.foto_principal || "/Img/placeholder.png";
        const emoji = mascota.especie === 'Gato' ? '🐱' : '🐶';
        
        // Foto de perfil del usuario (tu o genérica)
        const fotoUsuario = usuario.photoProfile || `https://ui-avatars.com/api/?name=${usuario.username}&background=random`;
=======
  contenedor.innerHTML = lista
<<<<<<< HEAD
    .map((item) => {
      const esPublicacionCompleta = item.mascota && item.usuario; 
      
      const mascota = esPublicacionCompleta ? item.mascota : item; 
      const usuario = esPublicacionCompleta ? item.usuario : (item.user || { username: 'Anónimo' }); 
      
      // Usamos el ID de publicación o el ID de mascota como fallback
      const pubId = esPublicacionCompleta ? item.id : mascota.id_mascotas; 
      const likes = esPublicacionCompleta ? item.likes : 0; // 0 likes si es resultado de filtro
      
      const foto = mascota.foto_principal || '/Img/placeholder.png';
      const emoji = mascota.especie === 'Gato' ? '🐱' : '🐶';
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175

        // --- LÓGICA DE COMENTARIOS ---
        // Generamos el HTML para cada comentario que venga de la BD
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
=======
    .map((pub) => {
      const mascota = pub.mascota || {};
      const usuario = pub.usuario || { username: 'Anónimo' };
      const foto = mascota.foto_principal || '/Img/placeholder.png';
      const emoji = mascota.especie === 'Gato' ? '🐱' : '🐶';

      // Decide qué foto de perfil usar
      const fotoUsuario =
        usuario.photoProfile ||
        `https://ui-avatars.com/api/?name=${usuario.username}&background=random`;

      return `
				<div class="pet-card fade-in mb-4">
					<div class="pet-card-header">
						<div class="profile-pic" style="background-image: url('${fotoUsuario}');"></div>
						
						<div>
							<p class="profile-name">${usuario.username}</p>
							<p class="profile-location">${
                mascota.estado_adopcion === 'ADOPTADO'
                  ? '🟢 ADOPTADO'
                  : '📍 Disponible'
              }</p>
						</div>
					</div>
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9

					<div class="pet-image" style="background-image: url('${foto}'); height: 350px; background-size: cover; background-position: center;"></div>

<<<<<<< HEAD
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
<<<<<<< HEAD
                    <button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="darLike(${pub.id})">
=======
                    <button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="darLike(${
                      pubId
                    })">
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175
                        <span class="material-symbols-outlined text-danger">favorite</span>
                        <span class="action-count">${likes}</span>
                    </button>
                    
<<<<<<< HEAD
                    <button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="toggleComentarios(${pub.id})">
=======
                    <button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="toggleComentarios(${
                      pubId
                    })">
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175
                        <span class="material-symbols-outlined text-primary">chat_bubble</span>
                        <span class="action-count">${cantidadComentarios}</span>
                    </button>
                </div>

                <button class="action-btn border-0 bg-transparent p-0" onclick="compartirPost('${mascota.nombre_mascotas}')">
                    <span class="material-symbols-outlined text-dark">share</span>
                </button>
            </div>

<<<<<<< HEAD
            <div id="comentarios-${pub.id}" class="comment-section d-none px-3 pb-3">
                <div class="input-group mb-2">
                    <input type="text" id="input-comentario-${pub.id}" class="form-control form-control-sm" placeholder="Escribe un comentario...">
                    <button class="btn btn-sm btn-primary" onclick="enviarComentario(${pub.id})">Enviar</button>
                </div>
                
                <div class="mt-2 small text-muted" id="lista-comentarios-${pub.id}" style="max-height: 150px; overflow-y: auto;">
                    ${listaComentarios}
                </div>
=======
            <div id="comentarios-${
              pubId
            }" class="comment-section d-none px-3 pb-3">
                <div class="input-group">
                    <input type="text" id="input-comentario-${
                      pubId
                    }" class="form-control form-control-sm" placeholder="Escribe un comentario...">
                    <button class="btn btn-sm btn-primary" onclick="enviarComentario(${
                      pubId
                    })">Enviar</button>
                </div>
                <div class="mt-2 small text-muted" id="lista-comentarios-${
                  pubId
                }"></div>
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175
            </div>
        </div>
        `;
    }).join('');
=======
					<div class="pet-card-body">
						<div class="pet-info-header">
							<div>
								<p class="pet-name">${emoji} ${
                mascota.nombre_mascotas || 'Sin nombre'
              }</p>
								<p class="pet-details">${mascota.edad || '?'} años, ${
                mascota.tamaño || ''
              }, ${mascota.sexo || ''}</p>
							</div>
							${
                mascota.estado_adopcion !== 'ADOPTADO'
                  ? `<button class="btn-adopt" onclick="iniciarAdopcion(${mascota.id_mascotas}, '${mascota.nombre_mascotas}')">Adóptame</button>`
                  : `<button class="btn btn-secondary btn-sm" disabled>Finalizado</button>`
              }
						</div>
						<p class="pet-description">${mascota.descripcion || ''}</p>
					</div>

					<div class="pet-card-footer d-flex justify-content-between px-3 pb-3">
						<div class="d-flex gap-3">
							<button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="darLike(${
                pub.id
              })">
								<span class="material-symbols-outlined text-danger">favorite</span>
								<span class="action-count">${pub.likes || 0}</span>
							</button>
							
							<button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="toggleComentarios(${
                pub.id
              })">
								<span class="material-symbols-outlined text-primary">chat_bubble</span>
								<span class="action-count">0</span>
							</button>
						</div>

						<button class="action-btn border-0 bg-transparent p-0" onclick="compartirPost('${
              mascota.nombre_mascotas
            }')">
								<span class="material-symbols-outlined text-dark">share</span>
						</button>
					</div>

					<div id="comentarios-${
            pub.id
          }" class="comment-section d-none px-3 pb-3">
						<div class="input-group">
							<input type="text" id="input-comentario-${
                pub.id
              }" class="form-control form-control-sm" placeholder="Escribe un comentario...">
							<button class="btn btn-sm btn-primary" onclick="enviarComentario(${
                pub.id
              })">Enviar</button>
						</div>
						<div class="mt-2 small text-muted" id="lista-comentarios-${
            pub.id
          }"></div>
					</div>
				</div>
			`;
    })
    .join('');
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9
}

// =======================
// 5. SOLICITUD DE ADOPCIÓN (WHATSAPP)
// =======================

/**
 * Busca una publicación por el ID de la mascota y devuelve el teléfono del dueño.
 * @param {number} petId - El ID de la mascota.
 * @returns {string|null} El número de teléfono del usuario o null si no se encuentra.
 */
function getTelefonoUsuarioPorMascotaId(petId) {
    const pub = publicaciones.find(p => p.mascota && p.mascota.id_mascotas === petId);
    
    // 💡 SOLUCIÓN: Cambiar 'telefono' por 'telephone' para que coincida con la API/DB.
    return pub && pub.usuario ? pub.usuario.telephone : null; 
}

/**
 * Maneja el envío del formulario de adopción, validando y enviando por WhatsApp.
 * @param {Event} event - El evento de envío del formulario.
 */
function handleAdoptionFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const petId = parseInt(form.dataset.petId); // Obtiene el ID de la mascota del dataset del form
    
    // Simple validación de campos requeridos (el HTML debe usar 'required')
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        alert('Por favor, completa todos los campos requeridos y acepta los términos.');
        return;
    }

    // Obtener los datos del formulario
    const nombreCompleto = form.querySelector('#nombreCompleto').value;
    const telefonoSolicitante = form.querySelector('#telefono').value;
    const correoElectronico = form.querySelector('#correoElectronico').value;
    const edad = form.querySelector('#edad').value;
    const tipoVivienda = form.querySelector('#tipoVivienda').value;
    const otrasMascotas = form.querySelector('#otrasMascotas').value;
    const adoptadoAntes = form.querySelector('#adoptadoAntes').value;
    const recursosCuidado = form.querySelector('#recursosCuidado').value;
    const nombreMascota = document.getElementById('nombreMascotaModal').textContent.trim();
    
    // 1. Buscar el teléfono del dueño
    const telefonoDueno = getTelefonoUsuarioPorMascotaId(petId);

    if (!telefonoDueno) {
        alert('❌ Error: No se pudo encontrar el número de contacto del dueño de la mascota.');
        return;
    }

    // 2. Construir el mensaje de WhatsApp (URL-encoded)
    const mensaje = `Hola, mi nombre es *${nombreCompleto}*. Estoy muy interesado/a en adoptar a *${nombreMascota}* (ID: ${petId}).

Mis datos y situación son:
* **Teléfono:** ${telefonoSolicitante}
* **Correo:** ${correoElectronico}
* **Edad:** ${edad} años
* **Vivienda:** ${tipoVivienda}
* **Otras Mascotas:** ${otrasMascotas}
* **Experiencia (Adopción Previa):** ${adoptadoAntes}
* **Recursos para Cuidado:** ${recursosCuidado}

¡Espero tu respuesta para coordinar! 🐾`;

    const mensajeURL = encodeURIComponent(mensaje);
    
    // 3. Abrir WhatsApp (usando el formato de URL wa.me)
    // Asegúrate de que el 'telefonoDueno' incluya el código de país (ej. 5218112345678)
    const urlWhatsapp = `https://wa.me/${telefonoDueno}?text=${mensajeURL}`;

    window.open(urlWhatsapp, '_blank');
    
    // Cerrar el modal y notificar al usuario
    const modal = bootstrap.Modal.getInstance(document.getElementById('adoptModal'));
    if (modal) modal.hide();
    alert(`✅ Solicitud de adopción enviada por WhatsApp al dueño de ${nombreMascota}. ¡Revisa el chat!`);
}

// =======================
// 6. FUNCIONES GLOBALES (ACCIONES)
// =======================

window.darLike = (publicacionId) => {
    const userId = localStorage.getItem("userId");
    
    // Evitar like infinito (básico en frontend)
    let likesGuardados = JSON.parse(localStorage.getItem('mis_likes') || "[]");
    if (likesGuardados.includes(publicacionId)) {
        alert("Ya le diste like a esta publicación ❤️");
        return;
    }

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
    // Nombre del usuario actual para feedback visual inmediato
    const miUsuario = localStorage.getItem("usuarioNombre") || "Tú"; 

    if(!texto) return;

    fetch(`${API_URL}/publicaciones/${id}/comentario?userId=${userId}&texto=${texto}`, {
        method: "POST",
        headers: getHeaders()
    })
    .then(res => {
        if(res.ok) {
            // Agregar visualmente el comentario para no tener que recargar toda la página
            const lista = document.getElementById(`lista-comentarios-${id}`);
            const div = document.createElement('div');
            div.className = "mb-1 border-bottom pb-1";
            div.innerHTML = `<strong>${miUsuario}:</strong> ${texto}`;
            lista.appendChild(div);
            
            input.value = ""; // Limpiar input
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
        alert('Enlace copiado al portapapeles 📋');
    }
};

window.iniciarAdopcion = (id, nombre) => {
<<<<<<< HEAD
    const modalElem = document.getElementById('adoptModal');
    const spanNombre = document.getElementById('nombreMascotaModal');
    const form = document.getElementById('adoptionForm');
    
    if(spanNombre) spanNombre.textContent = nombre;
    if(form) form.dataset.petId = id;
    
    const modal = new bootstrap.Modal(modalElem);
    modal.show();
=======
  const modalElem = document.getElementById('adoptModal');
  const spanNombre = document.getElementById('nombreMascotaModal');
  const form = document.getElementById('adoptionForm');

  if (spanNombre) spanNombre.textContent = nombre;
  if (form) {
    form.dataset.petId = id;
    form.classList.remove('was-validated'); // Limpiar validación previa
  }

  const modal = new bootstrap.Modal(modalElem);
  modal.show();
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9
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
<<<<<<< HEAD
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
=======
  const container = document.getElementById('preview-container');
  if (!container) return;
  container.innerHTML = imagenesSeleccionadas
    .map(
      (img, i) => `
			<div class="position-relative d-inline-block m-1">
				<img src="${img.base64}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
				<button class="btn btn-danger btn-sm position-absolute top-0 end-0 p-0" 
						style="width: 20px; height: 20px; line-height: 1;"
						onclick="eliminarImagen(${i})">×</button>
			</div>
		`
    )
    .join('');
  container.classList.remove('d-none');
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9
}

window.eliminarImagen = (index) => {
    imagenesSeleccionadas.splice(index, 1);
    actualizarPreview();
};

function inicializarEventos() {
<<<<<<< HEAD
<<<<<<< HEAD
    const newPostForm = document.getElementById('newPostForm');
    if(newPostForm) newPostForm.addEventListener('submit', handleNewPost);

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
=======
    // --- LÓGICA DE CREACIÓN DE PUBLICACIÓN (Mueve aquí el código de la sección eliminada) ---
    const newPostForm = document.getElementById('newPostForm');
    if (newPostForm) newPostForm.addEventListener('submit', handleNewPost);
=======
  const newPostForm = document.getElementById('newPostForm');
  if (newPostForm) newPostForm.addEventListener('submit', handleNewPost);
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9

  // 💡 CONEXIÓN DEL FORMULARIO DE ADOPCIÓN
  const adoptionForm = document.getElementById('adoptionForm');
  if (adoptionForm) adoptionForm.addEventListener('submit', handleAdoptionFormSubmit);

  const fileInput = document.getElementById('post-imagen');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const file of files) {
        if (imagenesSeleccionadas.length >= 1) {
          alert('Por ahora solo se permite 1 foto por publicación.');
          break;
        }
<<<<<<< HEAD

        // 1. LÓGICA DE ACTIVACIÓN/DESACTIVACIÓN
        if (link.classList.contains('active')) {
            // Desactivar: Quitar filtro
            link.classList.remove('active');
            filtrosAvanzados[tipo] = null; // Reinicia el filtro
        } else {
            // Activar: Quitar 'active' de cualquier otro link del mismo tipo
            document.querySelectorAll(`.filter-link[data-tipo="${tipo}"]`).forEach(l => {
                l.classList.remove('active');
            });
            // Activar el link actual y establecer el valor
            link.classList.add('active');
            filtrosAvanzados[tipo] = valor; // Establece el valor
        }
        
        console.log("Aplicando filtros avanzados:", filtrosAvanzados);

        // 3. Llamar a la función central de búsqueda del backend
        aplicarFiltrosAvanzados();
    }

    // Listener para Especie y Tamaño
    document.querySelectorAll('.filter-link').forEach(link => {
        link.addEventListener('click', manejarClickFiltro);
    });
const ageSlider = document.getElementById('ageSlider');
const ageValueEl = document.getElementById('ageValue');

if (ageSlider && ageValueEl) {
    
    ageSlider.addEventListener('input', () => {
        // Usamos parseFloat para leer el valor real (ej: 0.5, 1.5)
        const valorFlotante = parseFloat(ageSlider.value); 
        
        // Usamos Math.round() para obtener un número entero para el Backend
        const valorEnteroParaFiltro = Math.round(valorFlotante); 

        // Actualización del texto visible (Propiedad perdida)
        ageValueEl.textContent = valorFlotante > 0 
            ? `Máx. ${valorFlotante} años` 
            : 'Cualquier edad';
        
        // Actualiza el filtro global
        filtrosAvanzados.edad = (valorEnteroParaFiltro > 0) ? valorEnteroParaFiltro : null;
        
        // Llama a la función de filtro
        aplicarFiltrosAvanzados();
    });
    
    // Inicialización del texto al cargar la página
    ageValueEl.textContent = 'Cualquier edad'; 
>>>>>>> 480e0b01731d2ae14d47a2d15f4a1509b801f175
}
=======
        const base64 = await convertirFileABase64(file);
        imagenesSeleccionadas.push({ file, base64 });
      }
      actualizarPreview();
      fileInput.value = '';
    });
  }
>>>>>>> 2b641995428b4e8ec11d7311847040b7ce4e3db9
}