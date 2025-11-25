// =======================
// 1. Datos iniciales
// =======================
let imagenesSeleccionadas = [];
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
    imagen: '/Img/cachorro.jpg',
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
    descripcion: 'Parece un conejo pero es un gato, busca nuevo hogar.',
    especie: 'Gato',
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
    try {
      const parsed = JSON.parse(guardados);
      publicaciones = parsed.map(p => ({
        // toma lo que venga y asegura defaults
        ...p,
        likes: typeof p.likes === "number" ? p.likes : 0,
        shares: typeof p.shares === "number" ? p.shares : 0,
        liked: typeof p.liked === "boolean" ? p.liked : false,
        comentarios: Array.isArray(p.comentarios) ? p.comentarios : []
      }));
    } catch (err) {
      console.error("Error parseando postsGuardados:", err);
    }
  }
}

function convertirFileABase64(file, maxWidth = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Reducir tamaño manteniendo proporción
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", 0.7);

        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// =======================
// 3. Helpers y seguridad mínima
// =======================
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeHtmlAttr(str = '') {
  return escapeHtml(str).replaceAll('"', '&quot;');
}

// =======================
// 4. Media generator (si pub.imagenes existe -> carrusel, sino imagen simple)
// =======================
function generarMedia(pub) {
  // Preferir pub.imagenes (array). Si no, fallback a pub.imagen.
  const lista = Array.isArray(pub.imagenes) && pub.imagenes.length > 0
    ? pub.imagenes
    : (pub.imagen ? [pub.imagen] : []);

  // Si hay más de 1, crear carrusel manual (350px)
  if (lista.length > 1) {
    const id = `carrusel-${pub.id}`;
    const slides = lista.map((img, i) => {
      const left = i === 0 ? '0' : '100%';
      return `<div class="pet-carousel-slide" data-slide-index="${i}" style="
                position:absolute; top:0; left:${left}; width:100%; height:350px;
                background-image:url('${img}'); background-size:cover; background-position:center;
                transition:left .35s ease;">
              </div>`;
    }).join('');

    return `
      <div id="${id}" class="pet-carousel" data-index="0" style="position:relative; height:350px; overflow:hidden;">
        ${slides}
        <button class="pet-carousel-prev" data-target="${id}" aria-label="Anterior" style="position:absolute; left:8px; top:50%; transform:translateY(-50%); z-index:10; background:rgba(0,0,0,0.35); color:#fff; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">‹</button>
        <button class="pet-carousel-next" data-target="${id}" aria-label="Siguiente" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); z-index:10; background:rgba(0,0,0,0.35); color:#fff; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">›</button>
      </div>
    `;
  }

  // Si sólo hay 1 imagen o ninguna
  const url = lista[0] || '/Img/placeholder.png';
  return `<div class="pet-image" style="background-image: url('${url}'); height: 350px; background-size: cover; background-position: center;"></div>`;
}

// =======================
// 5. Renderizado
// =======================
function crearTarjetaPublicacion(pub, index) {
  const delay = index * 0.05;
  const especieEmoji = { Perro: "🐶", Gato: "🐱" };
  const emoji = especieEmoji[pub.especie] || "🐾";
  const edadTexto = pub.edad || "";
  const detalles = `${pub.especie || ""}${edadTexto ? ", " + edadTexto : ""}${pub.tamaño ? ", " + pub.tamaño : ""}`;

  // El botón Adóptame incluye data-nombre y data-id para usar luego
  return `
  <div class="pet-card" data-id="${pub.id}" style="animation-delay: ${delay}s;">
    <div class="pet-card-header">
      <div class="profile-pic" style="background-image: url('https://via.placeholder.com/100');"></div>
      <div>
        <p class="profile-name">Pet-Me</p>
        <p class="profile-location">${pub.ubicacion || ""}</p>
      </div>
    </div>

    ${generarMedia(pub)}

    <div class="pet-card-body">
      <div class="pet-info-header">
        <div>
          <p class="pet-name">${emoji} ${escapeHtml(pub.nombre)}</p>
          <p class="pet-details">${escapeHtml(detalles)}</p>
        </div>
        <button class="btn-adopt adoptar-btn" 
                data-nombre="${escapeHtmlAttr(pub.nombre)}" 
                data-id="${pub.id}"
                data-bs-toggle="modal" 
                data-bs-target="#adoptModal">
          <span>Adóptame</span>
        </button>
      </div>
      <p class="pet-description">${escapeHtml(pub.descripcion)}</p>
    </div>
    <div class="pet-card-footer">
      <button class="action-btn like-btn ${pub.liked ? 'liked' : ''}">
        <span class="material-symbols-outlined ${pub.liked ? 'filled' : ''}">favorite</span>
        <p class="action-count">${pub.likes || 0}</p>
      </button>
      <button class="action-btn comment-btn">
        <span class="material-symbols-outlined">chat_bubble</span>
        <p class="action-count">${(pub.comentarios || []).length}</p>
      </button>
      <button class="action-btn share-btn">
        <span class="material-symbols-outlined">share</span>
        <p class="action-count">${pub.shares || 0}</p>
      </button>
    </div>
    <div class="comment-section d-none mt-3">
      <textarea class="comment-input form-control mb-2" placeholder="Escribe tu comentario..."></textarea>
      <button class="submit-comment btn btn-sm btn-primary">Enviar</button>
      <div class="comment-list mt-2">
        ${(pub.comentarios || []).map(c => `<div class="comment-item"><strong>Tú:</strong> ${escapeHtml(c)}</div>`).join('')}
      </div>
    </div>
  </div>
  `;
}

function renderizarPublicaciones() {
  const contenedor = document.querySelector('.pet-cards-wrapper');
  if (!contenedor) return;
  contenedor.innerHTML = publicaciones.map(crearTarjetaPublicacion).join('');
}

// =======================
// 6. Delegación de eventos (único set de listeners)
// =======================
function inicializarDelegacion() {
  const contenedor = document.querySelector('.pet-cards-wrapper');
  if (!contenedor) return;

  // Clicks delegados en las cards (likes, comments, shares, adoptar, enviar comentario, carrusel)
  contenedor.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
      manejarLike(likeBtn);
      return;
    }

    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
      manejarShare(shareBtn);
      return;
    }

    const commentBtn = e.target.closest('.comment-btn');
    if (commentBtn) {
      const card = commentBtn.closest('.pet-card');
      const section = card.querySelector('.comment-section');
      section.classList.toggle('d-none');
      return;
    }

    const submitCommentBtn = e.target.closest('.submit-comment');
    if (submitCommentBtn) {
      manejarEnviarComentario(submitCommentBtn);
      return;
    }

    const adoptarBtn = e.target.closest('.adoptar-btn');
    if (adoptarBtn) {
      // Establecer nombre en modal y guardar id en el formulario para enviar
      const nombre = adoptarBtn.dataset.nombre || '';
      const id = adoptarBtn.dataset.id || '';
      const spanNombre = document.getElementById('nombreMascotaModal');
      if (spanNombre) spanNombre.textContent = nombre;
      const adoptionForm = document.getElementById('adoptionForm');
      if (adoptionForm) adoptionForm.dataset.petId = id;
      return;
    }

    // Carrusel prev/next
    const prev = e.target.closest('.pet-carousel-prev');
    const next = e.target.closest('.pet-carousel-next');
    if (prev || next) {
      const btn = prev || next;
      const id = btn.getAttribute('data-target');
      moverCarrusel(id, prev ? -1 : 1);
      return;
    }
  });
}

// =======================
// 7. Handlers para like/share/comentario
// =======================
function manejarLike(btn) {
  const card = btn.closest('.pet-card');
  if (!card) return;
  const id = card.dataset.id;
  const post = publicaciones.find(p => String(p.id) === String(id));
  if (!post) return;

  const icon = btn.querySelector('span.material-symbols-outlined');
  const countEl = btn.querySelector('.action-count');
  const isLiked = btn.classList.toggle('liked');

  icon.classList.toggle('filled', isLiked);
  const current = parseInt(countEl.textContent) || 0;
  const next = isLiked ? current + 1 : Math.max(0, current - 1);
  countEl.textContent = String(next);

  post.likes = next;
  post.liked = isLiked;
  guardarPublicaciones();
}

function manejarShare(btn) {
  const card = btn.closest('.pet-card');
  if (!card) return;
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
    navigator.share({ title: `Adopta a ${post.nombre}`, url: window.location.href })
      .catch(err => console.log('Error al compartir:', err));
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Enlace copiado al portapapeles 📋');
  }
}

function manejarEnviarComentario(btn) {
  const card = btn.closest('.pet-card');
  if (!card) return;
  const id = card.dataset.id;
  const post = publicaciones.find(p => String(p.id) === String(id));
  if (!post) return;

  const input = card.querySelector('.comment-input');
  const list = card.querySelector('.comment-list');
  const texto = (input?.value || '').trim();
  if (!texto) return;

  post.comentarios.push(texto);

  const div = document.createElement('div');
  div.classList.add('comment-item');
  div.innerHTML = `<strong>Kepler:</strong> ${escapeHtml(texto)}`;
  list.appendChild(div);
  input.value = '';

  const countEl = card.querySelector('.comment-btn .action-count');
  if (countEl) countEl.textContent = String(post.comentarios.length);

  guardarPublicaciones();
}

// =======================
// 8. Nueva publicación usando imagenesSeleccionadas[]
// =======================
function handleNewPost(event) {
  event.preventDefault();

  const form = document.getElementById('newPostForm');
  const alerta = document.getElementById('alerta-post');

  if (imagenesSeleccionadas.length === 0) {
    alerta.innerHTML = `
      <div class="alert alert-warning">Selecciona de 1 a 3 imágenes 🐾</div>
    `;
    return;
  }

  // Convertimos File → Base64
  const imagenesBase64 = imagenesSeleccionadas.map(obj => obj.base64);

  const nuevaPublicacion = {
    id: Date.now(),
    nombre: form['post-nombre'].value.trim() || 'Sin nombre',
    descripcion: form['post-descripcion'].value.trim(),
    especie: form['post-especie'].value,
    sexo: form['post-sexo'].value,
    tamaño: form['post-tamaño'].value,
    edad: form['post-edad'].value.trim(),
    ubicacion: form['post-ubicacion'].value.trim(),

    imagenes: imagenesBase64,
    imagen: imagenesBase64[0],

    fecha: new Date().toISOString(),
    comentarios: [],
    likes: 0,
    shares: 0,
    liked: false
  };

  publicaciones.unshift(nuevaPublicacion);
  guardarPublicaciones();
  renderizarPublicaciones();

  const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
  modal.hide();

  form.reset();
  imagenesSeleccionadas = [];
  actualizarPreview();
  alerta.innerHTML = '';
}

// =======================
// 9. Gestión de imágenes seleccionadas + preview con eliminación
// =======================
function actualizarPreview() {
  const previewContainer = document.getElementById('preview-container');
  if (!previewContainer) return;

  previewContainer.innerHTML = '';

  if (imagenesSeleccionadas.length === 0) {
    previewContainer.classList.add('d-none');
    return;
  }

  imagenesSeleccionadas.forEach((imgObj, index) => {
    const div = document.createElement('div');
    div.className = "preview-thumb";
    div.style.position = "relative";
    div.style.display = "inline-block";
    div.style.margin = "6px";

    div.innerHTML = `
      <img src="${imgObj.base64}" 
          style="width:100px; height:80px; object-fit:cover; border-radius:6px;">
      <button class="btn-delete-img" 
              data-index="${index}"
              style="position:absolute; top:0; right:0; 
                    background:red; color:white; 
                    border:none; border-radius:50%; 
                    width:22px; height:22px; font-size:14px; 
                    cursor:pointer;">×</button>
    `;
    previewContainer.appendChild(div);
  });

  previewContainer.classList.remove('d-none');
}

// Manejo de selección de archivos
document.getElementById('post-imagen')?.addEventListener('change', async (e) => {
  const nuevosArchivos = Array.from(e.target.files || []);

  if (imagenesSeleccionadas.length + nuevosArchivos.length > 3) {
    alert("Máximo 3 imágenes por publicación.");
    e.target.value = '';
    return;
  }

  for (const file of nuevosArchivos) {
    const base64 = await convertirFileABase64(file);
    imagenesSeleccionadas.push({ file, base64 });
  }

  actualizarPreview();
  e.target.value = '';
});

// Eliminar imagen del preview
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete-img')) {
    const index = parseInt(e.target.dataset.index);
    imagenesSeleccionadas.splice(index, 1);
    actualizarPreview();
  }
});

// =======================
// 10. Carrusel mover (controlar left de slides)
// =======================
function moverCarrusel(id, dir) {
  const carrusel = document.getElementById(id);
  if (!carrusel) return;
  const slides = Array.from(carrusel.querySelectorAll('.pet-carousel-slide'));
  if (!slides.length) return;
  let index = parseInt(carrusel.getAttribute('data-index') || '0', 10);
  index = (index + dir + slides.length) % slides.length;
  carrusel.setAttribute('data-index', String(index));
  slides.forEach((s, i) => {
    s.style.left = i === index ? '0' : '100%';
  });
}

// =======================
// 11. Validación formulario adopción
// =======================
function validarAdoptionForm(e) {
  e.preventDefault();
  let valido = true;

  const adoptionForm = document.getElementById("adoptionForm");
  if (!adoptionForm) return;

  const nombre = document.getElementById("nombreCompleto");
  const telefono = document.getElementById("telefono");
  const correo = document.getElementById("correoElectronico");
  const edad = document.getElementById("edad");
  const identificacion = document.getElementById("identificacion");
  const vivienda = document.getElementById("tipoVivienda");
  const mascotas = document.getElementById("otrasMascotas");
  const adoptadoAntes = document.getElementById("adoptadoAntes");
  const recursos = document.getElementById("recursosCuidado");
  const terms = document.getElementById("terms");

  ['errorNombre','errorTelefono','errorCorreo','errorIdentificacion','errorVivienda','errorOtrasMascotas','errorAdoptadoAntes','errorRecursos','errorTerms']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });

  // nombre
  if (!nombre || nombre.value.trim().length < 3) {
    nombre?.classList.add("is-invalid");
    const el = document.getElementById("errorNombre"); if (el) el.textContent = "Escribe tu nombre completo.";
    valido = false;
  } else {
    nombre.classList.remove("is-invalid");
  }

  // telefono
  if (!telefono || !/^[0-9]{10}$/.test(telefono.value.trim())) {
    telefono?.classList.add("is-invalid");
    const el = document.getElementById("errorTelefono"); if (el) el.textContent = "Debe ser un número de 10 dígitos.";
    valido = false;
  } else {
    telefono.classList.remove("is-invalid");
  }

  // correo
  if (!correo || !/^\S+@\S+\.\S+$/.test(correo.value.trim())) {
    correo?.classList.add("is-invalid");
    const el = document.getElementById("errorCorreo"); if (el) el.textContent = "Correo inválido.";
    valido = false;
  } else {
    correo.classList.remove("is-invalid");
  }

  // edad
  if (!edad || Number(edad.value) < 18) {
    edad?.classList.add("is-invalid");
    valido = false;
  } else {
    edad.classList.remove("is-invalid");
  }

  // identificacion
  if (!identificacion || !identificacion.files.length) {
    identificacion?.classList.add("is-invalid");
    const el = document.getElementById("errorIdentificacion"); if (el) el.textContent = "Debes subir una identificación.";
    valido = false;
  } else {
    identificacion.classList.remove("is-invalid");
  }

  // selects
  const selects = [
    { el: vivienda, id: 'errorVivienda', name: 'Tipo de vivienda' },
    { el: mascotas, id: 'errorOtrasMascotas', name: 'Otras mascotas' },
    { el: adoptadoAntes, id: 'errorAdoptadoAntes', name: '¿Adoptado antes?' },
    { el: recursos, id: 'errorRecursos', name: 'Recursos' }
  ];
  selects.forEach(s => {
    if (!s.el || !s.el.value) {
      s.el?.classList.add('is-invalid');
      const err = document.getElementById(s.id);
      if (err) err.textContent = "Este campo es obligatorio.";
      valido = false;
    } else s.el.classList.remove('is-invalid');
  });

  // terms
  if (!terms || !terms.checked) {
    terms?.classList.add("is-invalid");
    const el = document.getElementById("errorTerms"); if (el) el.textContent = "Debes aceptar los términos.";
    valido = false;
  } else {
    terms.classList.remove("is-invalid");
  }

  if (!valido) return;

  console.log("Formulario válido y listo para enviar");

  // cerrar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("adoptModal"));
  modal?.hide();

  // reset
  adoptionForm.reset();
}

// =======================
// 12. Inicialización
// =======================
document.addEventListener('DOMContentLoaded', () => {
  cargarPublicaciones();
  renderizarPublicaciones();
  inicializarDelegacion();

  // listeners que sólo deben existir una vez:
  const newPostForm = document.getElementById('newPostForm');
  newPostForm?.addEventListener('submit', handleNewPost);

  // limpiar preview al cerrar modal newPostModal
  const modalNewPostElem = document.getElementById('newPostModal');
  modalNewPostElem?.addEventListener('hidden.bs.modal', () => {
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    if (previewContainer) previewContainer.classList.add('d-none');
    if (previewImage) previewImage.src = '';
  });

  // mobile filter toggles (igual que antes)
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const mobileSidebar = document.getElementById('mobileSidebar');

  mobileFilterBtn?.addEventListener('click', () => {
    mobileSidebar?.classList.toggle('active');
  });

  mobileSidebar?.addEventListener('click', (e) => {
    if (e.target === mobileSidebar) mobileSidebar.classList.remove('active');
  });

  // slider edad
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

  // Adoption form submit listener
  const adoptionForm = document.getElementById('adoptionForm');
  adoptionForm?.addEventListener('submit', validarAdoptionForm);
});

  // export para pruebas si hace falta
window.feedHelpers = {
  guardarPublicaciones,
  cargarPublicaciones,
  renderizarPublicaciones
};