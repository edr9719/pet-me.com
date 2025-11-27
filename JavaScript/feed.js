// ⚠️ CAMBIAR POR TU IP DE AWS EL VIERNES
const API_URL = 'http://localhost:8080/api/v1';

// Variables globales
let imagenesSeleccionadas = [];
let publicaciones = [];
let filtrosAvanzados = { especie: null, tamano: null, edad: null };

// Credenciales
const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

document.addEventListener('DOMContentLoaded', () => {
  cargarPublicaciones();
  inicializarEventos();
  inicializarBusqueda();
});

// =======================
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
// 1.1 FILTROS AVANZADOS (BACKEND)
// =======================
async function aplicarFiltrosAvanzados() {
    console.log("Aplicando filtros avanzados:", filtrosAvanzados);

    // Construir los Query Parameters
    const params = new URLSearchParams();
    if (filtrosAvanzados.especie) params.append('especie', filtrosAvanzados.especie);
    if (filtrosAvanzados.tamano) params.append('tamano', filtrosAvanzados.tamano);
    // Asumimos que la edad en el backend es un número entero
    if (filtrosAvanzados.edad && filtrosAvanzados.edad > 0) params.append('edad', filtrosAvanzados.edad);

    // Si no hay filtros activos, recargar todo
    if (params.toString() === '') {
        cargarPublicaciones();
        return;
    }
    
    // Muestra un loader o spinner mientras llega la respuesta
    const contenedor = document.querySelector('.pet-cards-wrapper');
    if (contenedor) contenedor.innerHTML =
      '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p>Filtrando resultados...</p></div>';
    try {
        // Llama al endpoint de Spring Boot
        const response = await fetch(`${API_URL}/mascotas/buscar?${params.toString()}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error('Error al buscar en el servidor');

        const data = await response.json();
        
        // Actualizamos la lista global solo con los resultados del filtro
        // Esto permite que la búsqueda de texto siga funcionando sobre el resultado filtrado.
        publicaciones = data.sort((a, b) => b.id - a.id); 

        renderizarPublicaciones(publicaciones);

    } catch (error) {
        console.error("Error aplicando filtros:", error);
        if (contenedor) contenedor.innerHTML =
            `<p class="text-center text-danger mt-5">Error al filtrar: ${error.message}</p>`;
    }
}

// =======================
// 2. CARGAR PUBLICACIONES (GET)
// =======================
function cargarPublicaciones() {
  const contenedor = document.querySelector('.pet-cards-wrapper');
  if (contenedor)
    contenedor.innerHTML =
      '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p>Cargando huellitas...</p></div>';

  fetch(`${API_URL}/publicaciones`, {
    method: 'GET',
    headers: getHeaders(),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Error al cargar el feed');
      return response.json();
    })
    .then((data) => {
      publicaciones = data.sort((a, b) => b.id - a.id);
      renderizarPublicaciones(publicaciones);
    })
    .catch((err) => {
      console.error(err);
      if (contenedor)
        contenedor.innerHTML =
          '<p class="text-center text-danger mt-5">No se pudieron cargar las publicaciones.</p>';
    });
}

// =======================
// 3. CREAR PUBLICACIÓN (POST)
// =======================
async function handleNewPost(event) {
  event.preventDefault();
  const userId = localStorage.getItem('userId');

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

  // 🌟 CORRECCIÓN CRÍTICA (Manejo de edad para evitar NaN)
  const edadInput = form['post-edad'].value;
  const edadValue = edadInput ? parseInt(edadInput) : null;
  // --------------------------------------------------------

  const nuevaPublicacion = {
    titulo: `En adopción: ${form['post-nombre'].value}`,
    tipo: 'adopcion',
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
}

// =======================
// 4. RENDERIZADO (TARJETAS)
// =======================
function renderizarPublicaciones(lista) {
  const contenedor = document.querySelector('.pet-cards-wrapper');
  if (!contenedor) return;

  if (lista.length === 0) {
    contenedor.innerHTML =
      '<p class="text-center mt-5 text-muted">Aún no hay publicaciones.</p>';
    return;
  }

  contenedor.innerHTML = lista
    .map((item) => {
      const esPublicacionCompleta = item.mascota && item.usuario; 
      
      const mascota = esPublicacionCompleta ? item.mascota : item; 
      const usuario = esPublicacionCompleta ? item.usuario : (item.user || { username: 'Anónimo' }); 
      
      // Usamos el ID de publicación o el ID de mascota como fallback
      const pubId = esPublicacionCompleta ? item.id : mascota.id_mascotas; 
      const likes = esPublicacionCompleta ? item.likes : 0; // 0 likes si es resultado de filtro
      
      const foto = mascota.foto_principal || '/Img/placeholder.png';
      const emoji = mascota.especie === 'Gato' ? '🐱' : '🐶';

      // --- CAMBIO 1: DECIDIR QUÉ FOTO USAR ---
      // Si el usuario tiene 'photoProfile', úsala. Si no, usa la de letras (UI Avatars).
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

            <div class="pet-image" style="background-image: url('${foto}'); height: 350px; background-size: cover; background-position: center;"></div>

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
                      pubId
                    })">
                        <span class="material-symbols-outlined text-danger">favorite</span>
                        <span class="action-count">${likes}</span>
                    </button>
                    
                    <button class="action-btn d-flex align-items-center gap-1 border-0 bg-transparent p-0" onclick="toggleComentarios(${
                      pubId
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
            </div>
        </div>
        `;
    })
    .join('');
}

// =======================
// 4. FUNCIONES GLOBALES (ACCIONES)
// =======================

// --- LIKE ---
window.darLike = (publicacionId) => {
  const userId = localStorage.getItem('userId');
  fetch(`${API_URL}/publicaciones/${publicacionId}/like?userId=${userId}`, {
    method: 'POST',
    headers: getHeaders(),
  }).then((res) => {
    if (res.ok) cargarPublicaciones();
  });
};

// --- TOGGLE COMENTARIOS ---
window.toggleComentarios = (id) => {
  const section = document.getElementById(`comentarios-${id}`);
  if (section) section.classList.toggle('d-none');
};

// --- ENVIAR COMENTARIO (CONECTADO AL BACKEND) ---
window.enviarComentario = (id) => {
  const userId = localStorage.getItem('userId');
  const input = document.getElementById(`input-comentario-${id}`);
  const texto = input.value.trim();

  if (!texto) return;

  // Llamamos al endpoint que creamos en Java: POST /{id}/comentario
  fetch(
    `${API_URL}/publicaciones/${id}/comentario?userId=${userId}&texto=${texto}`,
    {
      method: 'POST',
      headers: getHeaders(),
    }
  )
    .then((res) => {
      if (res.ok) {
        // Éxito visual
        const lista = document.getElementById(`lista-comentarios-${id}`);
        const nuevoComentario = document.createElement('div');
        nuevoComentario.innerHTML = `<strong>Tú:</strong> ${texto}`;
        lista.appendChild(nuevoComentario);
        input.value = ''; // Limpiar input
        alert('Comentario enviado 💬');
      } else {
        alert('Error al enviar comentario');
      }
    })
    .catch((err) => console.error(err));
};

// --- COMPARTIR ---
window.compartirPost = (nombreMascota) => {
  const data = {
    title: `Adopta a ${nombreMascota}`,
    text: `¡Mira esta mascota en PetMe! ${nombreMascota} busca hogar.`,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator.share(data).catch(console.error);
  } else {
    // Fallback para escritorio: Copiar al portapapeles
    navigator.clipboard.writeText(window.location.href);
    alert('Enlace copiado al portapapeles 📋');
  }
};

// --- MODAL ADOPCIÓN ---
window.iniciarAdopcion = (id, nombre) => {
  const modalElem = document.getElementById('adoptModal');
  const spanNombre = document.getElementById('nombreMascotaModal');
  const form = document.getElementById('adoptionForm');

  if (spanNombre) spanNombre.textContent = nombre;
  if (form) form.dataset.petId = id;

  const modal = new bootstrap.Modal(modalElem);
  modal.show();
};

// --- HELPERS IMAGEN ---
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
}

window.eliminarImagen = (index) => {
  imagenesSeleccionadas.splice(index, 1);
  actualizarPreview();
};

// --- EVENTOS INICIALES ---
function inicializarEventos() {
    // --- LÓGICA DE CREACIÓN DE PUBLICACIÓN (Mueve aquí el código de la sección eliminada) ---
    const newPostForm = document.getElementById('newPostForm');
    if (newPostForm) newPostForm.addEventListener('submit', handleNewPost);

    const fileInput = document.getElementById('post-imagen');
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            for (const file of files) {
                if (imagenesSeleccionadas.length >= 1) {
                    alert('Por ahora solo se permite 1 foto por publicación.');
                    break;
                }
                const base64 = await convertirFileABase64(file);
                imagenesSeleccionadas.push({ file, base64 });
            }
            actualizarPreview();
            fileInput.value = '';
        });
    }
    
    // --- LÓGICA DE FILTROS DE ESPECIE Y TAMAÑO ---
    function manejarClickFiltro(event) {
        event.preventDefault();
        const link = event.currentTarget;
        
        // Captura los valores del HTML corregido
        const tipo = link.dataset.tipo; 
        const valor = link.dataset.valor; 

        // Si por alguna razón el HTML está mal, salimos
        if (!tipo || !valor) {
            console.error("Error: El enlace de filtro no tiene atributos data-tipo o data-valor.");
            return;
        }

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
}
}