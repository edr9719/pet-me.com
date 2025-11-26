// Configuration - Update this with your backend URL
const API_BASE_URL = 'http://localhost:8080/api/v1/users';

// Get the current user ID from localStorage or session
// You can modify this based on how you're storing the logged-in user's ID
let currentUserId = null;

/**
 * Initialize the profile page
 */
document.addEventListener('DOMContentLoaded', function () {
  // Try to get the user ID from localStorage (you might have this set during login)
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (loggedInUser && loggedInUser.id) {
    currentUserId = loggedInUser.id;
    loadUserProfile(currentUserId);
  } else {
    // For testing purposes, you can hardcode a user ID here
    // Remove this in production and implement proper authentication
    console.warn('No user ID found. Using test user ID: 1');
    currentUserId = 1; // Default test user
    loadUserProfile(currentUserId);
  }

  // Set up the save button event listener
  document
    .getElementById('saveProfileBtn')
    .addEventListener('click', saveProfile);

  // Profile image upload handler
  document
    .getElementById('profileImageInput')
    .addEventListener('change', handleProfileImageUpload);

  // Tab switching functionality
  setupTabSwitching();
});

/**
 * Load user profile data from the backend
 */
async function loadUserProfile(userId) {
  try {
    const token = localStorage.getItem('jwtToken');

    const response = await fetch(`${API_BASE_URL}/id-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      throw new Error('Error al cargar el perfil');
    }

    const user = await response.json();
    console.log('Usuario cargado:', user);

    // Populate the profile display with user data
    populateProfileDisplay(user);

    // Populate the edit modal form with user data
    populateEditForm(user);
  } catch (error) {
    console.error('Error loading profile:', error);
    alert(
      'Error al cargar el perfil del usuario. Por favor, intenta de nuevo.'
    );
  }
}

/**
 * Populate the profile display section with user data
 */
function populateProfileDisplay(user) {
  // Update profile image - handle if photoProfile is null or empty
  const profileImg = document.getElementById('profileImage');
  if (profileImg) {
    if (user.photoProfile && user.photoProfile.trim() !== '') {
      profileImg.src = user.photoProfile;
    } else {
      // Use a default avatar if no photo is set
      profileImg.src =
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(user.name + '+' + user.lastname) +
        '&size=200&background=random';
    }
  }

  // Update name - IMPORTANT: Make sure we're selecting the right element
  const fullName = `${user.name} ${user.lastname}`;
  const nameElement = document.querySelector('.profile-card h1');
  if (nameElement) {
    nameElement.textContent = fullName;
  }

  // Update description/bio
  const descriptionElement = document.querySelector(
    '.profile-card .text-muted-custom.small.text-center'
  );
  if (descriptionElement) {
    descriptionElement.textContent =
      user.description ||
      `Usuario de PetMe desde ${user.registerDate || '2025-11-28'}.`;
  }

  // Update contact information
  const contactInfoElements = document.querySelectorAll(
    '.profile-card .d-flex.align-items-center span.small'
  );
  if (contactInfoElements.length >= 3) {
    // Email
    contactInfoElements[0].textContent = user.email;

    // Phone
    contactInfoElements[1].textContent = user.telephone
      ? `+52 ${user.telephone}`
      : 'No especificado';

    // Location (combining city and country)
    const location =
      [user.city, user.country].filter(Boolean).join(', ') || 'No especificado';
    contactInfoElements[2].textContent = location;
  }
}

/**
 * Populate the edit form modal with user data
 */
function populateEditForm(user) {
  document.getElementById('editNombre').value = user.name || '';
  document.getElementById('editApellido').value = user.lastname || '';
  document.getElementById('editDescription').value = user.description || '';
  document.getElementById('editEmail').value = user.email || '';
  document.getElementById('editPhone').value = user.telephone || '';

  // Combine country and city for location
  const location = [user.city, user.country].filter(Boolean).join(', ');
  document.getElementById('editLocation').value = location || '';
}

/**
 * Save profile changes to the backend
 */
async function saveProfile() {
  try {
    const token = localStorage.getItem('jwtToken');

    // Get form values
    const nombre = document.getElementById('editNombre').value.trim();
    const apellido = document.getElementById('editApellido').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const location = document.getElementById('editLocation').value.trim();

    // Basic validation
    if (!nombre || !apellido || !email) {
      alert(
        'Por favor, completa los campos obligatorios (Nombre, Apellido, Email).'
      );
      return;
    }

    // Parse location (assuming format: "City, Country")
    const locationParts = location.split(',').map((part) => part.trim());
    const city = locationParts[0] || '';
    const country = locationParts[1] || locationParts[0] || '';

    // Get current user data first to preserve fields we're not updating
    const currentUser = await fetch(
      `${API_BASE_URL}/id-user/${currentUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => res.json());

    // Prepare updated user data
    const updatedUser = {
      ...currentUser, // Keep existing fields
      name: nombre,
      lastname: apellido,
      email: email,
      telephone: phone
        ? parseInt(phone.replace(/\D/g, ''))
        : currentUser.telephone,
      city: city,
      country: country,
      // If you add a description field to your backend model, uncomment this:
      // description: description
    };

    // Send PUT request to update user
    const response = await fetch(
      `${API_BASE_URL}/update-user/${currentUserId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      throw new Error('Error al actualizar el perfil');
    }

    const result = await response.json();
    console.log('Perfil actualizado:', result);

    // Update the display with new data
    populateProfileDisplay(result);

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('editProfileModal')
    );
    modal.hide();

    // Show success message
    showSuccessMessage('¡Perfil actualizado correctamente!');
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Error al guardar los cambios. Por favor, intenta de nuevo.');
  }
}

/**
 * Handle profile image upload
 */
async function handleProfileImageUpload(e) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) {
    alert('Por favor, selecciona un archivo de imagen válido.');
    return;
  }

  // Convert image to base64
  const reader = new FileReader();
  reader.onload = async function (event) {
    const imageUrl = event.target.result;

    try {
      // Update profile image in the backend
      const response = await fetch(
        `${API_BASE_URL}/update-photo/${currentUserId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            photoProfile: imageUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar la foto de perfil');
      }

      const result = await response.json();
      console.log('Foto de perfil actualizada:', result);

      // Update the image in the UI
      document.getElementById('profileImage').src = imageUrl;

      showSuccessMessage('¡Foto de perfil actualizada!');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert(
        'Error al actualizar la foto de perfil. Por favor, intenta de nuevo.'
      );
    }
  };

  reader.readAsDataURL(file);
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
  // You can implement a better notification system here
  // For now, we'll use a simple alert
  alert(message);
}

/**
 * Setup tab switching functionality
 */
function setupTabSwitching() {
  const adoptadosTab = document.getElementById('adoptadosTab');
  const publicacionesTab = document.getElementById('publicacionesTab');
  const adoptadosContent = document.getElementById('adoptadosContent');
  const publicacionesContent = document.getElementById('publicacionesContent');

  adoptadosTab.addEventListener('click', function (e) {
    e.preventDefault();
    adoptadosTab.classList.add('active');
    publicacionesTab.classList.remove('active');
    adoptadosContent.style.display = 'block';
    publicacionesContent.style.display = 'none';
  });

  publicacionesTab.addEventListener('click', function (e) {
    e.preventDefault();
    publicacionesTab.classList.add('active');
    adoptadosTab.classList.remove('active');
    publicacionesContent.style.display = 'block';
    adoptadosContent.style.display = 'none';
  });
}
