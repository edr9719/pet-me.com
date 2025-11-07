// Array de publicaciones (global para poder modificarlo)
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
    imagen: '/IMG/bla.jpg',
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
    fecha: '2025-10-28T09:00:00',
  },
];

// Función para formatear la fecha a un formato legible
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

// Función para crear el HTML de una tarjeta de publicación
function crearTarjetaPublicacion(publicacion, index) {
  const delay = index * 0.1;
  const especieEmoji = {
    Perro: "🐶",
    Gato: "🐱",
    Conejo: "🐰",
    Otro: "🐾",
  };
  const emoji = especieEmoji[publicacion.especie] || "🐾";
  const detalles = `${publicacion.especie}, ${publicacion.edad}`;

  return `
    <div class="pet-card" style="animation-delay: ${delay}s;">
      <div class="pet-card-header">
        <div class="profile-pic" style="background-image: url('https://via.placeholder.com/100');"></div>
        <div>
          <p class="profile-name">Happy Tails Shelter</p>
          <p class="profile-location">${publicacion.ubicacion}</p>
        </div>
      </div>
      <div class="pet-image" style="background-image: url('${publicacion.imagen}');"></div>
      <div class="pet-card-body">
        <div class="pet-info-header">
          <div>
            <p class="pet-name">${emoji} ${publicacion.nombre}</p>
            <p class="pet-details">${detalles}</p>
          </div>
          <button class="btn-adopt">
            <span>Adopt Me</span>
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
    </div>
  `;
}

// Función principal para renderizar todas las publicaciones
function renderizarPublicaciones() {
  const contenedor = document.querySelector('.pet-cards-wrapper');
  if (!contenedor) return;

  // Mapea y une el HTML, luego lo inyecta
  const htmlTarjetas = publicaciones.map(crearTarjetaPublicacion).join('');
  contenedor.innerHTML = htmlTarjetas;

  // Añadir eventos después de la renderización
  agregarEventosBotones();
}

// Función para agregar la lógica de los botones
function agregarEventosBotones() {
  document.querySelectorAll('.petme-btn-favorite').forEach((button) => {
    button.addEventListener('click', (e) => {
      const petId = e.currentTarget.dataset.petId;
      e.currentTarget.classList.toggle('active'); // Simulación de estado favorito
      console.log(`Mascota ${petId} favorita toggled.`);
    });
  });

  document.querySelectorAll('.petme-btn-contact').forEach((button) => {
    button.addEventListener('click', (e) => {
      const petId = e.currentTarget.dataset.petId;
      alert(`Iniciando contacto para mascota ${petId}.`);
    });
  });
}

/**
 * Maneja el envío del formulario para crear una nueva publicación (corregido para file input).
 */
/*function handleNewPost(event) {
  event.preventDefault();

  const form = document.getElementById('newPostForm');
  const imagenInput = document.getElementById('post-imagen');

  // Obtener la URL de la imagen (temporal o por defecto)
  let imagenURL = '/Img/default.jpg';

  // Si se seleccionó un archivo, creamos una URL temporal para mostrar la imagen
  if (imagenInput.files && imagenInput.files[0]) {
    imagenURL = URL.createObjectURL(imagenInput.files[0]);
  }

  // Crea un nuevo ID basado en la marca de tiempo
  const newId = Date.now();

  // Captura la información del formulario
  const nuevaPublicacion = {
    id: newId,
    nombre: document.getElementById('post-nombre').value.trim(),
    descripcion: document.getElementById('post-descripcion').value.trim(),
    especie: document.getElementById('post-especie').value,
    sexo: document.getElementById('post-sexo').value,
    tamaño: 'Mediano', // Valor por defecto
    edad: document.getElementById('post-edad').value.trim(),
    ubicacion: document.getElementById('post-ubicacion').value.trim(),
    imagen: imagenURL,
    fecha: new Date().toISOString(),
  };
  // 1. Agrega la nueva publicación al inicio del array (unshift)
  publicaciones.unshift(nuevaPublicacion);
  localStorage.setItem("postsGuardados", JSON.stringify(publicaciones));

  // 2. Vuelve a renderizar todo el feed
  const guardados = localStorage.getItem("postsGuardados");
  if (guardados) {
  publicaciones = JSON.parse(guardados);
  }
  console.log("Publicación creada:", nuevaPublicacion);

renderizarPublicaciones();

  // 3. Cierra el modal de Bootstrap
  const modalElement = document.getElementById('newPostModal');
  const modal =
    bootstrap.Modal.getInstance(modalElement) ||
    new bootstrap.Modal(modalElement);
  modal.hide();

  // 4. Limpia el formulario
  form.reset();
} */
function handleNewPost(event) {
  event.preventDefault();

  const form = document.getElementById('newPostForm');
  const imagenInput = document.getElementById('post-imagen');

  const procesarPublicacion = (imagenURL) => {
    const nuevaPublicacion = {
      id: Date.now(),
      nombre: document.getElementById('post-nombre').value.trim(),
      descripcion: document.getElementById('post-descripcion').value.trim(),
      especie: document.getElementById('post-especie').value,
      sexo: document.getElementById('post-sexo').value,
      tamaño: 'Mediano',
      edad: document.getElementById('post-edad').value.trim(),
      ubicacion: document.getElementById('post-ubicacion').value.trim(),
      imagen: imagenURL,
      fecha: new Date().toISOString(),
    };

    publicaciones.unshift(nuevaPublicacion);
    localStorage.setItem("postsGuardados", JSON.stringify(publicaciones));
    renderizarPublicaciones();

    const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
    if (modal) modal.hide();

    form.reset();
  };

  if (imagenInput.files && imagenInput.files[0]) {
    convertirImagenABase64(imagenInput.files[0], procesarPublicacion);
  } else {
    procesarPublicacion('/Img/default.jpg');
  }
}
// Para convertir a base64 
  function convertirImagenABase64(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => callback(reader.result); // reader.result es la imagen en base64
  reader.readAsDataURL(file);
}
// Inicialización de Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar publicaciones guardadas desde localStorage
  const guardados = localStorage.getItem("postsGuardados");
  if (guardados) {
    publicaciones = JSON.parse(guardados);
  }
  console.log("Publicaciones cargadas:", publicaciones);

  // 2. Renderiza el feed
  renderizarPublicaciones();

  // 2. Agrega el listener para el formulario de nueva publicación
  const newPostForm = document.getElementById('newPostForm');
  if (newPostForm) {
    newPostForm.addEventListener('submit', handleNewPost);
  }

  // 3. Mobile filter toggle
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const mobileSidebar = document.getElementById('mobileSidebar');

  if (mobileFilterBtn && mobileSidebar) {
    mobileFilterBtn.addEventListener('click', () => {
      mobileSidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside the content
    mobileSidebar.addEventListener('click', (e) => {
      if (e.target === mobileSidebar) {
        mobileSidebar.classList.remove('active');
      }
    });
  }
// BOTONES LIKE-COMMENT
  document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('span');
    const countEl = btn.querySelector('.action-count');
    let count = parseInt(countEl.textContent.replace(/[^\d]/g, ''));

    const isLiked = btn.classList.toggle('liked');
    countEl.textContent = isLiked ? `${count + 1}` : `${count - 1}`;

    // Cambia el estilo del ícono
    icon.textContent = 'favorite';
    icon.classList.toggle('filled', isLiked);
  });
});


 document.querySelectorAll('.comment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Aquí puedes abrir un modal, mostrar un textarea, etc.
    alert('Abrir sección de comentarios 📝');
  });
});
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const countEl = btn.querySelector('.action-count');
    let count = parseInt(countEl.textContent);
    countEl.textContent = `${count + 1}`;

    if (navigator.share) {
      navigator.share({
        title: 'Adopta esta ratita madre 🐭',
        url: window.location.href
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles 📋');
    }
  });
});


  
});
