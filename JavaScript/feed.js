// =======================
// 1. Datos iniciales
// =======================
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
    imagen: '/Img/adop2.webp',
    fecha: '2025-10-30T15:00:01',
    comentarios: [],
    likes: 0,
    shares: 0,
    liked: false
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
    comentarios: [],
    likes: 0,
    shares: 0,
    liked: false
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
    comentarios: [],
    likes: 0,
    shares: 0,
    liked: false
  },
];

// =======================
// 2. Utilidades
// =======================
function guardarPublicaciones() {
  localStorage.setItem("postsGuardados", JSON.stringify(publicaciones));
}

function cargarPublicaciones() {
  const guardados = localStorage.getItem("postsGuardados");
  if (guardados) {
    publicaciones = JSON.parse(guardados);
    // Asegurar propiedades por si eran antiguas
    publicaciones = publicaciones.map(p => ({
      comentarios: [],
      likes: 0,
      shares: 0,
      liked: false,
      ...p,
      comentarios: Array.isArray(p.comentarios) ? p.comentarios : []
    }));
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function convertirImagenABase64(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => callback(reader.result);
  reader.readAsDataURL(file);
}

// =======================
// 3. Renderizado
// =======================
function crearTarjetaPublicacion(pub, index) {
  const delay = index * 0.1;
<<<<<<< Updated upstream
  const especieEmoji = {
    Perro: '🐶',
    Gato: '🐱',
    Conejo: '🐰',
    Otro: '🐾',
  };
  const emoji = especieEmoji[publicacion.especie] || '🐾';
  // --- Mostrar edad con unidad y tamaño ---
  let edadTexto = publicacion.edad;

  // Si el valor de edad es numérico, le agregamos "años" por defecto
  if (publicacion.edad && !isNaN(publicacion.edad)) {
    edadTexto = `${publicacion.edad} años`;
  }

  // Si el texto ya incluye "mes" o "año", se deja tal cual
  if (publicacion.edad && /mes|año/i.test(publicacion.edad)) {
    edadTexto = publicacion.edad;
  }

  // Armamos el detalle completo (especie, edad y tamaño)
  const detalles = `${publicacion.especie}, ${edadTexto}, ${publicacion.tamaño}`;
=======
  const especieEmoji = { Perro: "🐶", Gato: "🐱", Conejo: "🐰", Otro: "🐾" };
  const emoji = especieEmoji[pub.especie] || "🐾";
  const edadTexto = pub.edad;
  const detalles = `${pub.especie}, ${edadTexto}, ${pub.tamaño}`;
>>>>>>> Stashed changes

  return `
    <div class="pet-card" data-id="${pub.id}" style="animation-delay: ${delay}s;">
      <div class="pet-card-header">
        <div class="profile-pic" style="background-color: var(--petme-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">HT</div>
        <div>
          <p class="profile-name">Happy Tails Shelter</p>
          <p class="profile-location">${pub.ubicacion}</p>
        </div>
      </div>
      <div class="pet-image" style="background-image: url('${pub.imagen}');"></div>
      <div class="pet-card-body">
        <div class="pet-info-header">
          <div>
            <p class="pet-name">${emoji} ${pub.nombre}</p>
            <p class="pet-details">${detalles}</p>
          </div>
<<<<<<< Updated upstream
          <button class="btn-adopt petme-btn-contact" data-pet-id="${publicacion.id}">
            <span>Adóptame</span>
          </button>
=======
          <button class="btn-adopt"><span>Adóptame</span></button>
>>>>>>> Stashed changes
        </div>
        <p class="pet-description">${pub.descripcion}</p>
      </div>
      <div class="pet-card-footer">
        <button class="action-btn like-btn ${pub.liked ? 'liked' : ''}">
          <span class="material-symbols-outlined ${pub.liked ? 'filled' : ''}">favorite</span>
          <p class="action-count">${pub.likes}</p>
        </button>
        <button class="action-btn comment-btn">
          <span class="material-symbols-outlined">chat_bubble</span>
          <p class="action-count">${pub.comentarios.length}</p>
        </button>
        <button class="action-btn share-btn">
          <span class="material-symbols-outlined">share</span>
          <p class="action-count">${pub.shares}</p>
        </button>
      </div>
      <div class="comment-section d-none mt-3">
        <textarea class="comment-input form-control mb-2" placeholder="Escribe tu comentario..."></textarea>
        <button class="submit-comment btn btn-sm btn-primary">Enviar</button>
        <div class="comment-list mt-2">
          ${pub.comentarios.map(c => `<div class="comment-item"><strong>Kepler:</strong> ${c}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderizarPublicaciones() {
  const contenedor = document.querySelector('.main-content');
  if (!contenedor) return;
  contenedor.innerHTML = publicaciones.map(crearTarjetaPublicacion).join('');
  agregarEventosBotones();
  agregarEventosComentarios();
}
// =======================
// 4. Eventos (likes, shares)
// =======================
function agregarEventosBotones() {
  // Favorito/contacto (si los usas en otra parte)
  document.querySelectorAll('.petme-btn-favorite').forEach((button) => {
    button.addEventListener('click', (e) => {
      const petId = e.currentTarget.dataset.petId;
      e.currentTarget.classList.toggle('active');
      console.log(`Mascota ${petId} favorita toggled.`);
    });
  });

  document.querySelectorAll('.petme-btn-contact').forEach((button) => {
    button.addEventListener('click', (e) => {
      const petId = e.currentTarget.dataset.petId;
      alert(`Iniciando contacto para mascota ${petId}.`);
    });
  });
<<<<<<< Updated upstream
}
function agregarEventosComentarios() {
  document.querySelectorAll('.comment-btn').forEach((btn) => {
=======

  // Likes persistentes
  document.querySelectorAll('.like-btn').forEach(btn => {
>>>>>>> Stashed changes
    btn.addEventListener('click', () => {
      const card = btn.closest('.pet-card');
      const id = card.dataset.id;
      const post = publicaciones.find(p => String(p.id) === String(id));
      if (!post) return;

      const icon = btn.querySelector('span.material-symbols-outlined');
      const countEl = btn.querySelector('.action-count');
      const isLiked = btn.classList.toggle('liked');

      icon.textContent = 'favorite';
      icon.classList.toggle('filled', isLiked);

      const current = parseInt(countEl.textContent) || 0;
      const next = isLiked ? current + 1 : Math.max(0, current - 1);
      countEl.textContent = String(next);

      post.likes = next;
      post.liked = isLiked;
      guardarPublicaciones();
    });
  });

<<<<<<< Updated upstream
  document.querySelectorAll('.submit-comment').forEach((btn) => {
=======
  // Shares persistentes
  document.querySelectorAll('.share-btn').forEach(btn => {
>>>>>>> Stashed changes
    btn.addEventListener('click', () => {
      const card = btn.closest('.pet-card');
      const id = card.dataset.id;
      const post = publicaciones.find(p => String(p.id) === String(id));
      if (!post) return;

      const countEl = btn.querySelector('.action-count');
      const current = parseInt(countEl.textContent) || 0;
      const next = current + 1;
      countEl.textContent = String(next);
      post.shares = next;
      guardarPublicaciones();

      if (navigator.share) {
        navigator.share({ title: 'Adopta esta ratita madre 🐭', url: window.location.href })
          .catch(err => console.log('Error al compartir:', err));
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles 📋');
      }
    });
  });
}

// =======================
// 5. Comentarios persistentes
// =======================
function agregarEventosComentarios() {
  // Toggle sección
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pet-card');
      const section = card.querySelector('.comment-section');
      section.classList.toggle('d-none');
    });
  });

  // Enviar comentario y persistir
  document.querySelectorAll('.submit-comment').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pet-card');
      const id = card.dataset.id;
      const post = publicaciones.find(p => String(p.id) === String(id));
      if (!post) return;

      const input = card.querySelector('.comment-input');
      const list = card.querySelector('.comment-list');
      const texto = input.value.trim();
      if (!texto) return;

      post.comentarios.push(texto);

      // Actualizar UI
      const div = document.createElement('div');
      div.classList.add('comment-item');
      div.innerHTML = `<strong>Kepler:</strong> ${texto}`;
      list.appendChild(div);
      input.value = '';

      // Actualizar contador
      const countEl = card.querySelector('.comment-btn .action-count');
      countEl.textContent = String(post.comentarios.length);

      guardarPublicaciones();
    });
  });
}

// =======================
// 6. Nueva publicación
// =======================
function handleNewPost(event) {
  event.preventDefault();

  const form = document.getElementById('newPostForm');
  const imagenInput = document.getElementById('post-imagen');
  const alerta = document.getElementById('alerta-post');

  if (!imagenInput.files?.length) {
    alerta.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Por favor, selecciona una imagen para publicar. 🐾
      </div>`;
    return;
  }

  convertirImagenABase64(imagenInput.files[0], (imagenURL) => {
    const nuevaPublicacion = {
      id: Date.now(),
      nombre: form['post-nombre'].value.trim(),
      descripcion: form['post-descripcion'].value.trim(),
      especie: form['post-especie'].value,
      sexo: form['post-sexo'].value,
      tamaño: form['post-tamaño'].value,
      edad: form['post-edad'].value.trim(),
      ubicacion: form['post-ubicacion'].value.trim(),
      imagen: imagenURL,
      fecha: new Date().toISOString(),
      comentarios: [],
      likes: 0,
      shares: 0,
      liked: false
    };

    publicaciones.unshift(nuevaPublicacion);
<<<<<<< Updated upstream
    localStorage.setItem('postsGuardados', JSON.stringify(publicaciones));
    renderizarPublicaciones();

    const modal = bootstrap.Modal.getInstance(
      document.getElementById('newPostModal')
    );
    if (modal) modal.hide();

    form.reset();
    alerta.innerHTML = '';
  };

  convertirImagenABase64(imagenInput.files[0], procesarPublicacion);
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
  const guardados = localStorage.getItem('postsGuardados');
  if (guardados) {
    publicaciones = JSON.parse(guardados);
  }
  console.log('Publicaciones cargadas:', publicaciones);
=======
    guardarPublicaciones();
    renderizarPublicaciones();

    const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
    modal?.hide();

    form.reset();
    alerta.innerHTML = "";
  });
}

// =======================
// 7. Inicialización y UI extra
// =======================
document.addEventListener('DOMContentLoaded', () => {
  // Cargar publicaciones guardadas
  cargarPublicaciones();
>>>>>>> Stashed changes

  // Renderizar feed
  renderizarPublicaciones();

  // Listener para nueva publicación
  const newPostForm = document.getElementById('newPostForm');
<<<<<<< Updated upstream
  if (newPostForm) {
    newPostForm.addEventListener('submit', handleNewPost);
  }
=======
  newPostForm?.addEventListener('submit', handleNewPost);
>>>>>>> Stashed changes

  // --- Vista previa de imagen ---
  const imagenInput = document.getElementById('post-imagen');
  const previewContainer = document.getElementById('preview-container');
  const previewImage = document.getElementById('preview-image');

<<<<<<< Updated upstream
  // Mostrar previsualización cuando se elige una imagen
  if (imagenInput) {
    imagenInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImage.src = event.target.result;
          previewContainer.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
      } else {
        // Si se borra la imagen seleccionada
        previewContainer.classList.add('d-none');
        previewImage.src = '';
      }
    });
  }

  // --- Limpia la vista previa al cerrar el modal ---
  const modalElement = document.getElementById('newPostModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      previewContainer.classList.add('d-none');
      previewImage.src = '';
      imagenInput.value = '';
    });
  }
=======
  imagenInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewImage.src = event.target.result;
        previewContainer.classList.remove('d-none');
      };
      reader.readAsDataURL(file);
    } else {
      previewContainer.classList.add('d-none');
      previewImage.src = '';
    }
  });

  const modalElement = document.getElementById('newPostModal');
  modalElement?.addEventListener('hidden.bs.modal', () => {
    previewContainer.classList.add('d-none');
    previewImage.src = '';
    if (imagenInput) imagenInput.value = '';
  });
>>>>>>> Stashed changes

  // --- Mobile filter toggle ---
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const mobileSidebar = document.getElementById('mobileSidebar');

  mobileFilterBtn?.addEventListener('click', () => {
    mobileSidebar?.classList.toggle('active');
  });

  mobileSidebar?.addEventListener('click', (e) => {
    if (e.target === mobileSidebar) {
      mobileSidebar.classList.remove('active');
    }
  });

  // --- Slider de edad ---
  const ageSlider = document.getElementById('ageSlider');
  const ageValueDisplay = document.getElementById('ageValue');

  if (ageSlider && ageValueDisplay) {
    function updateAgeDisplay(value) {
      let text = '';
      if (value === 0) {
        text = 'Cualquier edad';
      } else if (value === 0.5) {
        text = 'Hasta 6 meses';
      } else if (value === 1) {
        text = 'Hasta 1 año';
      } else if (value === 5) {
        text = 'Hasta 5 años o más';
      } else {
        const years = Math.floor(value);
        const months = (value % 1) * 12;
        text = months === 0
          ? `Hasta ${years} años`
          : `Hasta ${years} años y ${months} meses`;
      }
      ageValueDisplay.textContent = text;
    }

    updateAgeDisplay(parseFloat(ageSlider.value));
    ageSlider.addEventListener('input', (event) => {
      updateAgeDisplay(parseFloat(event.target.value));
    });
  }
<<<<<<< Updated upstream
  // BOTONES LIKE-COMMENT
  document.querySelectorAll('.like-btn').forEach((btn) => {
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

  document.querySelectorAll('.comment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Aquí puedes abrir un modal, mostrar un textarea, etc.
      alert('Abrir sección de comentarios 📝');
    });
  });
  document.querySelectorAll('.share-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const countEl = btn.querySelector('.action-count');
      let count = parseInt(countEl.textContent);
      countEl.textContent = `${count + 1}`;

      if (navigator.share) {
        navigator
          .share({
            title: 'Adopta esta ratita madre 🐭',
            url: window.location.href,
          })
          .catch((err) => console.log('Error al compartir:', err));
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles 📋');
      }
    });
  });

  // ======Deslizante de edad

  const ageSlider = document.getElementById('ageSlider');
  const ageValueDisplay = document.getElementById('ageValue');

  if (ageSlider && ageValueDisplay) {
    // Función para convertir el valor decimal del slider a un texto de edad legible
    function updateAgeDisplay(value) {
      let text = '';

      // 0.0: Cualquier edad (valor por defecto)
      if (value === 0) {
        text = 'Cualquier edad';
        // 0.5: 6 meses
      } else if (value === 0.5) {
        text = 'Hasta 6 meses';
        // 1.0: 1 año
      } else if (value === 1) {
        text = 'Hasta 1 año';
        // 5.0: 5 años o más
      } else if (value === 5) {
        text = 'Hasta 5 años o más';
        // 1.5, 2.0, 2.5, etc.
      } else {
        const years = Math.floor(value);
        const months = (value % 1) * 12;

        if (months === 0) {
          text = `Hasta ${years} años`;
        } else {
          text = `Hasta ${years} años y ${months} meses`;
        }
      }

      ageValueDisplay.textContent = text;
    }

    // Inicializa el valor mostrado al cargar la página
    updateAgeDisplay(parseFloat(ageSlider.value));

    // Escucha los cambios en el slider y actualiza el texto
    ageSlider.addEventListener('input', (event) => {
      const currentValue = parseFloat(event.target.value);
      updateAgeDisplay(currentValue);
    });
  }

  // Fin de deslizante
});
=======
});
>>>>>>> Stashed changes
