const BASE_URL = 'http://localhost:8080/api/v1/adopciones'; 

async function apiFetch(url, options = {}) {
    const defaultHeaders = {
        'Accept': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {

                errorData = { message: response.statusText || 'Error desconocido del servidor' };
            }
            const error = new Error(`HTTP Error ${response.status}: ${errorData.message || 'Error en la solicitud'}`);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        // Sin exito
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null; // Devuelve nulo para evitar errores al intentar parsear JSON vacío
        }

        // Respuesta exitosa (200, 201)
        return await response.json();

    } catch (error) {
        console.error("Error en la función apiFetch:", error);
        throw error;
    }
}


export async function getAllAdoptions() {
    return apiFetch(BASE_URL);
}

// CREAR UNA NUEVA SOLICITUD DE ADOPCIÓN (POST /api/v1/adopciones/solicitar)
export async function createAdoption(adoptionData) {
    const url = `${BASE_URL}/solicitar`;
    return apiFetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adoptionData),
    });
}

// OBTENER SOLICITUD POR ID (GET /api/v1/adopciones/{id})

export async function getAdoptionById(id) {
    const url = `${BASE_URL}/${id}`;
    return apiFetch(url);
}

// OBTENER SOLICITUDES POR ESTADO (GET /api/v1/adopciones/estado/{estado})

export async function getAdoptionsByStatus(estado) {
    const url = `${BASE_URL}/estado/${estado}`;
    return apiFetch(url);
}

// ACTUALIZAR EL ESTADO Y COMENTARIOS (PUT /api/v1/adopciones/actualizar/{id})

export async function updateAdoptionStatus(id, statusUpdateData) {
    const url = `${BASE_URL}/actualizar/${id}`;
    return apiFetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusUpdateData),
    });
}

//  ELIMINAR UNA SOLICITUD (DELETE /api/v1/adopciones/eliminar/{id})

export async function deleteAdoption(id) {
    const url = `${BASE_URL}/eliminar/${id}`;
    // La función apiFetch manejará la respuesta 204 y devolverá 'null'
    return apiFetch(url, {
        method: 'DELETE',
    });
}