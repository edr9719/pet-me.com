// Array de publicaciones (global para poder modificarlo)
let publicaciones = [
    {
        id: 1730312001000,
        nombre: "Luna",
        descripcion: "Cachorra muy juguetona que busca un hogar 🐾",
        especie: "Perro",
        sexo: "Hembra",
        tamaño: "Mediano",
        edad: "6 meses",
        ubicacion: "CDMX",
        imagen: "/IMG/bla.jpg",
        fecha: "2025-10-30T15:00:01"
    },
    {
        id: 1730312002000,
        nombre: "Michi",
        descripcion: "Gato tranquilo, le encanta el sol.",
        especie: "Gato",
        sexo: "Macho",
        tamaño: "Pequeño",
        edad: "2 años",
        ubicacion: "Polanco",
        imagen: "/Img/istockphoto-820785324-612x612.pnj.webp",
        fecha: "2025-10-29T10:30:00"
    },
    {
        id: 1730312003000,
        nombre: "Bunny",
        descripcion: "Conejo rescatado, muy social.",
        especie: "Conejo",
        sexo: "Hembra",
        tamaño: "Pequeño",
        edad: "2 años",
        ubicacion: "Roma Norte",
        imagen: "/Img/photo-1609151354448-c4a53450c6e9.avif",
        fecha: "2025-10-28T09:00:00"
    }
];

// Función para formatear la fecha a un formato legible
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('es-MX', options);
}

// Función para crear el HTML de una tarjeta de publicación
function crearTarjetaPublicacion(publicacion, index) {
    const detalles = `${publicacion.edad} · ${publicacion.sexo} · ${publicacion.ubicacion}`;
    
    let emoji;
    if (publicacion.especie === "Perro") {
        emoji = "🐶";
    } else if (publicacion.especie === "Gato") {
        emoji = "🐱";
    } else {
        emoji = "🐾";
    }

    // Calcula el delay de la animación para un efecto escalonado (0.1s de retraso)
    const delay = index * 0.1;

    return `
        <div class="col-12 col-md-6 col-lg-4 mb-4 pet-card-col" style="animation-delay: ${delay}s;">
            <div class="card pet-card">
                <img src="${publicacion.imagen}" class="card-img-top pet-img" alt="${publicacion.nombre}" />
                <div class="card-body">
                    <h5 class="card-title pet-name">${emoji} ${publicacion.nombre}</h5>
                    <p class="card-text pet-details">${detalles}</p>
                    <p class="card-text pet-description">${publicacion.descripcion}</p>
                    <p class="card-text text-muted" style="font-size: 0.75rem;">Publicado el: ${formatearFecha(publicacion.fecha)}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn pet-action-btn petme-btn-favorite" data-pet-id="${publicacion.id}">
                            <i class="bi bi-heart-fill"></i> Favorito
                        </button>
                        <button class="btn pet-action-btn petme-btn-contact" data-pet-id="${publicacion.id}">
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función principal para renderizar todas las publicaciones
function renderizarPublicaciones() {
    const contenedor = document.querySelector('.pet-cards-container');
    if (!contenedor) return;

    // Mapea y une el HTML, luego lo inyecta
    const htmlTarjetas = publicaciones.map(crearTarjetaPublicacion).join('');
    contenedor.innerHTML = htmlTarjetas;

    // Añadir eventos después de la renderización
    agregarEventosBotones();
}

// Función para agregar la lógica de los botones
function agregarEventosBotones() {
    document.querySelectorAll('.petme-btn-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            const petId = e.currentTarget.dataset.petId;
            e.currentTarget.classList.toggle('active'); // Simulación de estado favorito
            console.log(`Mascota ${petId} favorita toggled.`);
        });
    });

    document.querySelectorAll('.petme-btn-contact').forEach(button => {
        button.addEventListener('click', (e) => {
            const petId = e.currentTarget.dataset.petId;
            alert(`Iniciando contacto para mascota ${petId}.`);
        });
    });
}

/**
 * Maneja el envío del formulario para crear una nueva publicación (corregido para file input).
 */
function handleNewPost(event) {
    event.preventDefault();

    const form = document.getElementById('newPostForm');
    const imagenInput = document.getElementById('post-imagen');
    
    // Obtener la URL de la imagen (temporal o por defecto)
    let imagenURL = "/Img/default.jpg";
    
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
        tamaño: "Mediano", // Valor por defecto
        edad: document.getElementById('post-edad').value.trim(),
        ubicacion: document.getElementById('post-ubicacion').value.trim(),
        imagen: imagenURL,
        fecha: new Date().toISOString()
    };

    // 1. Agrega la nueva publicación al inicio del array (unshift)
    publicaciones.unshift(nuevaPublicacion); 
    
    // 2. Vuelve a renderizar todo el feed
    renderizarPublicaciones();

    // 3. Cierra el modal de Bootstrap
    const modalElement = document.getElementById('newPostModal');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
    
    // 4. Limpia el formulario
    form.reset(); 
}

// Inicialización de Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderiza las publicaciones iniciales
    renderizarPublicaciones();

    // 2. Agrega el listener para el formulario de nueva publicación
    const newPostForm = document.getElementById('newPostForm');
    if (newPostForm) {
        newPostForm.addEventListener('submit', handleNewPost);
    }
});