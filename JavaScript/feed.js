document.addEventListener('DOMContentLoaded', () => {
    console.log('La aplicación Pet-Me ha cargado completamente.');

    // Ejemplo de funcionalidad: Alerta al hacer clic en un botón de Contactar
    const contactButtons = document.querySelectorAll('.pet-action-btn.btn-dark');
    contactButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const petCard = event.target.closest('.pet-card');
            if (petCard) {
                const petNameElement = petCard.querySelector('.pet-name');
                const petName = petNameElement ? petNameElement.textContent.replace('😊 ', '').replace('😻 ', '').replace('🐰 ', '').trim() : 'una mascota';
                alert(`Has hecho clic en Contactar para ${petName}. ¡Esperamos que encuentres un buen compañero!`);
            } else {
                alert('Has hecho clic en Contactar. ¡Esperamos que encuentres un buen compañero!');
            }
        });
    });

    // Ejemplo de funcionalidad: Cambiar el estado del botón "Favorito"
    const favoriteButtons = document.querySelectorAll('.pet-action-btn.btn-warning');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Alternar una clase para cambiar el estilo o el texto
            event.target.classList.toggle('active-favorite');
            if (event.target.classList.contains('active-favorite')) {
                event.target.innerHTML = '<i class="bi bi-heart-fill"></i> Favorito'; // Podrías cambiar a "Guardado"
                event.target.style.backgroundColor = '#dc3545'; // Ejemplo: color rojo
                event.target.style.borderColor = '#dc3545';
            } else {
                event.target.innerHTML = '<i class="bi bi-heart-fill"></i> Favorito';
                event.target.style.backgroundColor = '#ffc107'; // Volver al color original
                event.target.style.borderColor = '#ffc107';
            }
            const petCard = event.target.closest('.pet-card');
            const petNameElement = petCard ? petCard.querySelector('.pet-name') : null;
            const petName = petNameElement ? petNameElement.textContent.replace('😊 ', '').replace('😻 ', '').replace('🐰 ', '').trim() : 'la mascota';
            console.log(`${petName} ha sido ${event.target.classList.contains('active-favorite') ? 'añadida a' : 'eliminada de'} favoritos.`);
        });
    });

    // Puedes agregar más interactividad aquí, como:
    // - Lógica para los filtros
    // - Carga dinámica de mascotas
    // - Navegación a perfiles de mascotas
});

// Función para cargar mascotas dinámicamente (ejemplo)
function loadPets() {
    // Aquí podrías hacer una llamada a una API o cargar datos de un array
    console.log('Cargando más mascotas...');
    // const newPetData = [
    //     { name: "Max", age: "1 año", gender: "Macho", location: "Narvarte", description: "Energético y juguetón.", imageUrl: "https://via.placeholder.com/300x200?text=Max" },
    //     // ... más mascotas
    // ];
    // newPetData.forEach(pet => {
    //     const newCard = createPetCard(pet);
    //     document.querySelector('.pet-cards-container').appendChild(newCard);
    // });
}

// Puedes crear una función para generar tarjetas de mascotas dinámicamente si es necesario
function createPetCard(pet) {
    const cardHtml = `
        <div class="card pet-card mb-3">
            <img src="${pet.imageUrl}" class="card-img-top pet-img" alt="${pet.name}">
            <div class="card-body">
                <h5 class="card-title pet-name">${pet.emoji ? pet.emoji + ' ' : ''}${pet.name}</h5>
                <p class="card-text pet-details">${pet.age} · ${pet.gender} · ${pet.location}</p>
                <p class="card-text pet-description">${pet.description}</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-warning pet-action-btn"><i class="bi bi-heart-fill"></i> Favorito</button>
                    <button class="btn btn-dark pet-action-btn">Contactar</button>
                </div>
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = cardHtml.trim();
    return div.firstChild;
}