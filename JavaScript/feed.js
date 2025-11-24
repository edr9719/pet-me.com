// ==========================================
// 1. VARIABLES GLOBALES Y DATOS
// ==========================================

// Array para guardar temporalmente las fotos que el usuario selecciona antes de subir
let archivosSeleccionados = [];

// Array de publicaciones (global)
let publicaciones = [
  {
    id: 1730312001000,
    nombre: 'Luna',
    descripcion: 'Cachorra muy juguetona que busca un hogar 🐾',
    especie: 'Perro',
    sexo: 'Hembra',
    tamaño: 'Mediano',
    edad: '6 meses',
    ubicacion: 'CDMX',
    imagen: '/Img/adop2.webp', // Soporte legacy (una sola foto)
    imagenes: ['/Img/adop2.webp'], // Array estandarizado
    fecha: '2025-10-30T15:00:01',
  },
  {
    id: 1730312002000,
    nombre: 'Michi',
    descripcion: 'Gato tranquilo, le encanta el sol.',
    especie: 'Gato',
    sexo: 'Macho',
    tamaño: 'Pequeño',
    edad: '2 años',
    ubicacion: 'Polanco',
    imagen: '/Img/istockphoto-820785324-612x612.pnj.webp',
    imagenes: ['/Img/istockphoto-820785324-612x612.pnj.webp'],
    fecha: '2025-10-29T10:30:00',
  },
  {
    id: 1730312003000,
    nombre: 'Bunny',
    descripcion: 'Conejo rescatado, muy social.',
    especie: 'Conejo',
    sexo: 'Hembra',
    tamaño: 'Pequeño',
    edad: '2 años',
    ubicacion: 'Roma Norte',
    imagen: '/Img/photo-1609151354448-c4a53450c6e9.avif',
    imagenes: ['/Img/photo-1609151354448-c4a53450c6e9.avif'],
    fecha: '2025-10-28T09:00:00',
  },
];

// ==========================================
// 2. FUNCIONES DE UTILIDAD (FECHAS, ETC)
// ==========================================

function formatearFecha(fecha) {
  const date = new Date(fecha);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('es-MX', options);
}

// Función auxiliar: Convertir File a Base64 usando Promesas
// (Necesaria para manejar múltiples archivos a la vez)
function convertirFileABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// ==========================================
// 3. RENDERIZADO DE TARJETAS (FEED)
// ==========================================

function crearTarjetaPublicacion(publicacion, index) {
  const delay = index * 0.1;
  const especieEmoji = {
    Perro: '🐶',
    Gato: '🐱',
    Conejo: '🐰',
    Otro: '🐾',
  };
  const emoji = especieEmoji[publicacion.especie] || '🐾';

  // --- Formato de Edad ---
  let edadTexto = publicacion.edad;
  if (publicacion.edad && !isNaN(publicacion.edad)) {
    edadTexto = `${publicacion.edad} años`;
  }
  if (publicacion.edad && /mes|año/i.test(publicacion.edad)) {
    edadTexto = publicacion.edad;
  }
  const detalles = `${publicacion.especie}, ${edadTexto}, ${publicacion.tamaño}`;

  // --- LÓGICA DE CARRUSEL (CORREGIDA PARA QUE NO SE MUEVA SOLO) ---
  const listaImagenes = publicacion.imagenes || (publicacion.imagen ? [publicacion.imagen] : []);
  const carouselId = `carousel-${publicacion.id}`;
  let mediaHtml = '';

  if (listaImagenes.length > 1) {
    // CASO MULTIPLE: Carrusel estático (manual)
    const indicadores = listaImagenes
      .map(
        (_, i) =>
          `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" class="${
            i === 0 ? 'active' : ''
          }" aria-label="Slide ${i + 1}"></button>`
      )
      .join('');

    const items = listaImagenes
      .map(
        (img, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}" style="height: 350px; background-color: #f0f0f0;">
          <img src="${img}" class="d-block w-100" alt="Mascota" style="height: 100%; object-fit: cover;">
        </div>
      `
      )
      .join('');

    // CAMBIO IMPORTANTE AQUÍ:
    // 1. Quitamos 'data-bs-ride="carousel"' (esto causaba que iniciara solo).
    // 2. Mantenemos 'data-bs-interval="false"' (esto asegura que no rote automáticamente nunca).
    mediaHtml = `
      <div id="${carouselId}" class="carousel slide" data-bs-interval="false"> 
        <div class="carousel-indicators">${indicadores}</div>
        <div class="carousel-inner">${items}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true" style="filter: invert(1);"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true" style="filter: invert(1);"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
    `;
  } else {
    // CASO ÚNICO
    const imgUrl = listaImagenes.length > 0 ? listaImagenes[0] : '/Img/placeholder.png';
    mediaHtml = `<div class="pet-image" style="background-image: url('${imgUrl}'); height: 350px; background-size: cover; background-position: center;"></div>`;
  }

  // --- Retorno del HTML ---
  return `
    <div class="pet-card" style="animation-delay: ${delay}s;">
      <div class="pet-card-header">
        <div class="profile-pic" style="background-color: var(--petme-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">HT</div>
        <div>
          <p class="profile-name">Happy Tails Shelter</p>
          <p class="profile-location">${publicacion.ubicacion}</p>
        </div>
      </div>
      
      ${mediaHtml}

      <div class="pet-card-body">
        <div class="pet-info-header">
          <div>
            <p class="pet-name">${emoji} ${publicacion.nombre}</p>
            <p class="pet-details">${detalles}</p>
          </div>
          <button class="btn-adopt petme-btn-contact" data-pet-id="${publicacion.id}">
            <span>Adóptame</span>
          </button>
        </div>
        <p class="pet-description">${publicacion.descripcion}</p>
      </div>
      <div class="pet-card-footer">
        <button class="action-btn like-btn">
          <span class="material-symbols-outlined">favorite</span>
          <p class="action-count">0</p>
        </button>
        <button class="action-btn comment-btn">
          <span class="material-symbols-outlined">chat_bubble</span>
          <p class="action-count">0</p>
        </button>
        <button class="action-btn share-btn">
          <span class="material-symbols-outlined">share</span>
          <p class="action-count">0</p>
        </button>
      </div>
      <div class="comment-section d-none mt-3">
        <textarea class="comment-input form-control mb-2" placeholder="Escribe tu comentario..."></textarea>
        <button class="submit-comment btn btn-sm btn-primary">Enviar</button>
        <div class="comment-list mt-2"></div>
      </div>
    </div>
  `;
}

function renderizarPublicaciones() {
  const contenedor = document.querySelector('.pet-cards-wrapper'); // Ajustado a la clase correcta de tu HTML nuevo
  if (!contenedor) return;

  const htmlTarjetas = publicaciones.map(crearTarjetaPublicacion).join('');
  contenedor.innerHTML = htmlTarjetas;

  agregarEventosBotones();
  agregarEventosComentarios();
}

// ==========================================
// 4. LÓGICA DE INTERACCIÓN (LIKES, COMMENTS)
// ==========================================

function agregarEventosBotones() {
  // Botones de Adóptame
  document.querySelectorAll('.petme-btn-contact').forEach((button) => {
    button.addEventListener('click', (e) => {
      const petId = e.currentTarget.dataset.petId;
      alert(`Iniciando contacto para mascota ID: ${petId}. 🐶`);
    });
  });

  // Botones de Like
  document.querySelectorAll('.like-btn').forEach((btn) => {
    // Removemos listeners previos para evitar duplicados si se renderiza de nuevo
    const nuevoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(nuevoBtn, btn);

    nuevoBtn.addEventListener('click', () => {
      const icon = nuevoBtn.querySelector('span');
      const countEl = nuevoBtn.querySelector('.action-count');
      let count = parseInt(countEl.textContent.replace(/[^\d]/g, ''));

      const isLiked = nuevoBtn.classList.toggle('liked');
      countEl.textContent = isLiked ? `${count + 1}` : `${count - 1}`;
      icon.textContent = 'favorite';
      icon.classList.toggle('filled', isLiked);
      
      if(isLiked) icon.style.color = 'red';
      else icon.style.color = '';
    });
  });
  
  // Botones Share
  document.querySelectorAll('.share-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({ title: 'PetMe', url: window.location.href }).catch(console.error);
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Enlace copiado! 📋');
        }
    });
  });
}

function agregarEventosComentarios() {
  // Toggle sección comentarios
  document.querySelectorAll('.comment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pet-card');
      const commentSection = card.querySelector('.comment-section');
      commentSection.classList.toggle('d-none');
    });
  });

  // Enviar comentario
  document.querySelectorAll('.submit-comment').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pet-card');
      const input = card.querySelector('.comment-input');
      const list = card.querySelector('.comment-list');
      const texto = input.value.trim();

      if (texto.length > 0) {
        const comentario = document.createElement('div');
        comentario.classList.add('comment-item', 'mb-2');
        comentario.innerHTML = `<strong>Tú:</strong> ${texto}`;
        list.appendChild(comentario);
        input.value = '';
      }
    });
  });
}

// ==========================================
// 5. LÓGICA DE NUEVA PUBLICACIÓN (MULTIPLE)
// ==========================================

// A) Manejo de previsualización y eliminación de fotos
function inicializarVistaPrevia() {
  const imagenInput = document.getElementById('post-imagen');
  const previewContainer = document.getElementById('preview-container');
  const alerta = document.getElementById('alerta-post'); // Usaremos la alerta existente

  if (imagenInput) {
    imagenInput.addEventListener('change', (e) => {
      const nuevosArchivos = Array.from(e.target.files);
      const LIMITE = 3; // Definimos el límite máximo de fotos
      let archivosAgregados = 0;
      alerta.innerHTML = ''; // Limpiar alertas anteriores

      // Iterar sobre los nuevos archivos
      nuevosArchivos.forEach(file => {
        // Solo agregar si es una imagen, si el límite no se ha alcanzado, y si hay espacio.
        if (file.type.startsWith('image/') && archivosSeleccionados.length < LIMITE) {
          archivosSeleccionados.push(file);
          archivosAgregados++;
        }
      });

      // Si se intentó subir más del límite, mostramos una alerta
      if (archivosSeleccionados.length === LIMITE && nuevosArchivos.length > archivosAgregados) {
        alerta.innerHTML = `
          <div class="alert alert-danger" role="alert">
            Máximo de fotos alcanzado: Solo puedes subir ${LIMITE} imágenes.
          </div>
        `;
      }
      
      renderizarPrevisualizacion();
      
      // Limpiar input para permitir seleccionar más fotos si se desea (aunque se exceda el límite)
      imagenInput.value = '';
    });
  }
}

function renderizarPrevisualizacion() {
  const container = document.getElementById('preview-container');
  if (!container) return;

  container.innerHTML = ''; // Limpiar

  if (archivosSeleccionados.length > 0) {
    container.classList.remove('d-none');
    
    archivosSeleccionados.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Creamos un wrapper para la imagen y la X
        const col = document.createElement('div');
        col.className = 'col-4 position-relative'; 
        
        // Estilo inline para asegurar visualización correcta
        col.innerHTML = `
          <div style="position: relative; height: 100px; width: 100%;">
            <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" alt="Preview">
            <button type="button" 
                    onclick="eliminarImagenDelArray(${index})"
                    style="position: absolute; top: -5px; right: -5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; display: flex; justify-content: center; align-items: center; cursor: pointer;">
              ✕
            </button>
          </div>
        `;
        container.appendChild(col);
      };
      reader.readAsDataURL(file);
    });
  } else {
    container.classList.add('d-none');
  }
}

// Función global para poder llamarla desde el onclick del HTML generado
window.eliminarImagenDelArray = function(index) {
  archivosSeleccionados.splice(index, 1);
  renderizarPrevisualizacion();
};

// B) Manejo del envío del formulario
function handleNewPost(event) {
  event.preventDefault();

  const alerta = document.getElementById('alerta-post');
  
  // Validar que haya al menos una imagen en el array
  if (archivosSeleccionados.length === 0) {
    alerta.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Por favor, selecciona al menos una foto. 📸
      </div>
    `;
    return;
  }

  // Convertir todas las imágenes seleccionadas a Base64
  Promise.all(archivosSeleccionados.map(convertirFileABase64))
    .then((imagenesBase64) => {
      const nuevaPublicacion = {
        id: Date.now(),
        nombre: document.getElementById('post-nombre').value.trim(),
        descripcion: document.getElementById('post-descripcion').value.trim(),
        especie: document.getElementById('post-especie').value,
        sexo: document.getElementById('post-sexo').value,
        tamaño: document.getElementById('post-tamaño').value,
        edad: document.getElementById('post-edad').value.trim(),
        ubicacion: document.getElementById('post-ubicacion').value.trim(),
        // Guardamos Array
        imagenes: imagenesBase64,
        // Guardamos la primera como fallback
        imagen: imagenesBase64[0], 
        fecha: new Date().toISOString(),
        comentarios: [],
      };

      publicaciones.unshift(nuevaPublicacion);
      localStorage.setItem('postsGuardados', JSON.stringify(publicaciones));
      
      renderizarPublicaciones();

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
      if (modal) modal.hide();

      // Limpieza
      document.getElementById('newPostForm').reset();
      archivosSeleccionados = [];
      document.getElementById('preview-container').innerHTML = '';
      document.getElementById('preview-container').classList.add('d-none');
      alerta.innerHTML = '';
      
    })
    .catch((err) => {
      console.error(err);
      alerta.innerHTML = '<div class="alert alert-danger">Error procesando imágenes</div>';
    });
}

// ==========================================
// 6. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // A. Cargar datos
  const guardados = localStorage.getItem('postsGuardados');
  if (guardados) {
    publicaciones = JSON.parse(guardados);
  }
  
  // B. Renderizar
  renderizarPublicaciones();

  // C. Listeners Formulario
  const newPostForm = document.getElementById('newPostForm');
  if (newPostForm) {
    newPostForm.addEventListener('submit', handleNewPost);
  }
  
  // D. Inicializar lógica de subida de archivos
  inicializarVistaPrevia();

  // E. Limpieza al cerrar modal
  const modalElement = document.getElementById('newPostModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      archivosSeleccionados = [];
      document.getElementById('preview-container').classList.add('d-none');
      document.getElementById('preview-container').innerHTML = '';
      if(newPostForm) newPostForm.reset();
      const alerta = document.getElementById('alerta-post');
      if(alerta) alerta.innerHTML = '';
    });
  }

  // F. Filtros Móvil (Sidebar)
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const mobileSidebar = document.getElementById('mobileSidebar');

  if (mobileFilterBtn && mobileSidebar) {
    mobileFilterBtn.addEventListener('click', () => {
      mobileSidebar.classList.toggle('active');
    });
    mobileSidebar.addEventListener('click', (e) => {
      if (e.target === mobileSidebar) {
        mobileSidebar.classList.remove('active');
      }
    });
  }

  // G. Slider de Edad
  const ageSlider = document.getElementById('ageSlider');
  const ageValueDisplay = document.getElementById('ageValue');

  if (ageSlider && ageValueDisplay) {
    function updateAgeDisplay(value) {
      let text = '';
      if (value === 0) text = 'Cualquier edad';
      else if (value === 0.5) text = 'Hasta 6 meses';
      else if (value === 1) text = 'Hasta 1 año';
      else if (value === 5) text = 'Hasta 5 años o más';
      else {
        const years = Math.floor(value);
        const months = (value % 1) * 12;
        text = months === 0 ? `Hasta ${years} años` : `Hasta ${years} años y ${months} meses`;
      }
      ageValueDisplay.textContent = text;
    }
    updateAgeDisplay(parseFloat(ageSlider.value));
    ageSlider.addEventListener('input', (e) => updateAgeDisplay(parseFloat(e.target.value)));
  }
});
