// document.getElementById('send-btn').addEventListener('click', sendMessage);
// document.getElementById('user-input').addEventListener('keypress', function (e) {
//     if (e.key === 'Enter') {
//         sendMessage();
//     }
// });
// function sendMessage() {
//     const inputField = document.getElementById('user-input');
//     const userInput = inputField.value;
//     if (userInput.trim() !== '') {
//         displayMessage(userInput, 'user');
//         inputField.value = '';
//         getBotResponse(userInput);
//     }
// }
// function displayMessage(message, sender) {
//     const chatBox = document.getElementById('chat-box');
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', sender);
//     messageElement.textContent = message;
//     chatBox.appendChild(messageElement);
//     chatBox.scrollTop = chatBox.scrollHeight;
// }
// function getBotResponse(userInput) {
//     let botResponse = '';
//     if (userInput.toLowerCase().includes('hola')) {
//         botResponse = '!Hola! viendo benido a pet-me ¿Como podemos ayudarte?';
//     }
//     else if (userInput.toLowerCase().includes('ayuda')) {
//         botResponse = 'Quieres ponerte en contacto';
//     }
//     else if (userInput.toLowerCase().includes('adopction')) {
//         botResponse = 'Puedes brindarnos tus datos de entidad para verificar';
//     }
//     else {
//         botResponse = 'Lo sineto no entiendo tu pregunta';
//     }
//     setTimeout(() => {
//         displayMessage(botResponse, 'bot');
//     }, 1000);
// }

// Variable global para manejar el estado del chat y el menú actual.
let chatState = 'mainMenu';

// --- Referencias a Elementos DOM (Asume que existen en tu HTML) ---
const inputField = document.getElementById('user-input');
const chatWrapper = document.getElementById('chat-wrapper');
const chatToggleButton = document.getElementById('chat-toggle-btn');
const chatCloseButton = document.getElementById('chat-close-btn');

// --- Event Listeners ---
document.getElementById('send-btn').addEventListener('click', sendMessage);
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

if (chatToggleButton) {
    chatToggleButton.addEventListener('click', toggleChat);
}
if (chatCloseButton) {
    chatCloseButton.addEventListener('click', toggleChat);
}

// Asegurar que el chat inicie correctamente si está abierto por defecto
if (chatWrapper && !chatWrapper.classList.contains('chat-hidden')) {
    document.addEventListener('DOMContentLoaded', sendMainMenu);
}


// --- Funciones de Utilidad ---

function toggleChat() {
    if (!chatWrapper || !chatToggleButton) return;
    
    chatWrapper.classList.toggle('chat-hidden');

    if (!chatWrapper.classList.contains('chat-hidden')) {
        chatToggleButton.style.display = 'none';
        // Asegúrate de iniciar el menú principal cuando se abre el chat
        sendMainMenu();
    } else {
        chatToggleButton.style.display = 'flex';
    }
}

// Función actualizada para manejar tanto las respuestas rápidas de menú
// como los clics en el botón de redirección (CTA).
function handleQuickReplyClick(value) {
    // Si el valor es una URL de redirección (nuestro patrón de CTA)
    if (value.startsWith('componentes/feed.html')) { // <-- Se actualizó la comprobación de ruta
        // 1. Simular la acción del usuario
        displayMessage(`Presionó: Ir a Catálogo`, 'user-reply-pill');
        
        // 2. Simular la redirección e informar al usuario
        const redirectionMessage = `
            Abriendo el Catálogo de Adopción...
            
            **[Simulación de Redirección]**
            
            Esta acción te llevaría a la página: **${value}**
            
            (Si deseas buscar otra cosa, vuelve al menú principal).
        `;
        displayMessage(redirectionMessage, 'bot');
        
        // 3. Volver al menú de Adopción para continuar el flujo del chat
        sendAdoptMenu();
        return; 
    }
    
    // Comportamiento por defecto para la navegación de menús
    displayMessage(value, 'user-reply-pill');
    getBotResponse(value);
}

function sendMessage() {
    const userInput = inputField.value;
    if (userInput.trim() !== '') {
        displayMessage(userInput.trim(), 'user');
        inputField.value = '';
        getBotResponse(userInput.trim());
    }
}

// NOTA: Esta función asume que tu HTML maneja .message, .bot, .user, .quick-reply-container, etc.
function displayMessage(message, sender, quickReplies = []) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

    // Crear el mensaje principal
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Usamos el sender para estilos
    if (sender === 'user-reply-pill') {
        messageElement.classList.add('user-reply-pill');
    } else {
        messageElement.classList.add(sender);
    }
    
    // Formato de texto simple (Markdown ** y saltos de línea)
    // NOTA: La función usa innerHTML, lo que permite inyectar etiquetas como <a>
    const formattedText = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messageElement.innerHTML = formattedText.trim().replace(/\n/g, '<br>');
    chatBox.appendChild(messageElement);

    // Añadir botones de Quick Reply
    if (quickReplies.length > 0) {
        const replyContainer = document.createElement('div');
        replyContainer.classList.add('quick-reply-container');

        quickReplies.forEach(reply => {
            const button = document.createElement('span');
            button.classList.add('quick-reply-button');
            
            // Si el valor es una URL, lo tratamos como un botón de acción más grande y visible
            if (reply.value.startsWith('componentes/feed.html')) { // <-- Se actualizó la comprobación de ruta
                 button.classList.add('cta-button'); // Clase especial para botón grande
            }
            
            button.textContent = reply.text;
            button.addEventListener('click', () => {
                handleQuickReplyClick(reply.value);
            });

            replyContainer.appendChild(button);
        });

        chatBox.appendChild(replyContainer);
    }

    // Scroll al final
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- DEFINICIÓN DE MENÚS (Estructura de la Interacción) ---

function sendMainMenu() {
    chatState = 'mainMenu';
    const responseText = `
        **¡Hola! Soy Pet-Me, tu asistente para encontrar a tu nuevo mejor amigo. ¡Adoptar es un acto de amor!**
        
        ¿Cómo puedo ayudarte hoy en tu aventura de adopción?
    `;

    const options = [
        { text: "1️⃣ Quiero Adoptar", value: "1" },
        { text: "2️⃣ Tengo Dudas de Adopción", value: "2" },
        { text: "3️⃣ Requisitos y Formulario", value: "3" },
        { text: "4️⃣ Cuidado de Mascotas", value: "4" }
    ];

    displayMessage(responseText, 'bot', options);
}

function sendAdoptMenu() {
    chatState = 'adoptMenu';
    const responseText = `
        **¡Qué emocionante! Estás a un paso de cambiar una vida.**
        
        Selecciona tu siguiente paso:
    `;

    const options = [
        { text: "1.1 Ver Perros 🐶 (Filtros)", value: "1.1" },
        { text: "1.2 Ver Gatos 🐱 (Filtros)", value: "1.2" }, 
        { text: "1.4 Pasos del Proceso", value: "1.4" },
        { text: "🔙 Menú Principal", value: "B" }
    ];

    displayMessage(responseText, 'bot', options);
}

function sendVerPerrosMenu() {
    chatState = 'verPerrosMenu';
    const responseText = `
        **¡Filtros para encontrar a tu compañero ideal!**

        Selecciona un criterio de búsqueda:
    `;

    const options = [
        { text: "5.1 Talla Pequeña 🐕", value: "5.1" },
        { text: "5.2 Talla Mediana o Grande 🐾", value: "5.2" },
        { text: "5.3 Cachorros (0-1 año) 👶", value: "5.3" },
        { text: "5.4 Adultos (1+ año) 🧘", value: "5.4" },
        { text: "5.5 Ver todos los Perros 🔍", value: "5.5" },
        { text: "🔙 Menú de Adopción", value: "1" } 
    ];

    displayMessage(responseText, 'bot', options);
}

// Menú de Filtros de Gatos
function sendVerGatosMenu() {
    chatState = 'verGatosMenu';
    const responseText = `
        **¡Filtros para encontrar a tu felino ideal!**

        Selecciona un criterio de búsqueda:
    `;

    const options = [
        { text: "6.1 Gatitos (0-1 año) 🐈", value: "6.1" },
        { text: "6.2 Gatos Adultos (1+ año) 🐾", value: "6.2" },
        { text: "6.3 Busco Gato Calmo 🧘", value: "6.3" },
        { text: "6.4 Busco Gato Juguetón 🤸", value: "6.4" },
        { text: "6.5 Ver todos los Gatos 🔍", value: "6.5" },
        { text: "🔙 Menú de Adopción", value: "1" } 
    ];

    displayMessage(responseText, 'bot', options);
}

function sendDudasMenu() {
    chatState = 'dudasMenu';
    const responseText = `
        **Estamos aquí para ti. Las dudas son parte de ser un adoptante responsable.**
        
        ¿Sobre qué tienes preguntas?
    `;

    const options = [
        { text: "2.1 ¿Y si no se adapta?", value: "2.1" },
        { text: "2.2 Costos de una mascota", value: "2.2" },
        { text: "2.3 Compromiso a largo plazo", value: "2.3" },
        { text: "🔙 Menú Principal", value: "B" }
    ];

    displayMessage(responseText, 'bot', options);
}

function sendCuidadoMenu() {
    chatState = 'cuidadoMenu';
    const responseText = `
        **Consejos de Expertos para un Hogar Feliz.**
        
        ¿Qué tipo de consejo necesitas?
    `;

    const options = [
        { text: "4.1 Regla 3-3-3 de Adaptación", value: "4.1" },
        { text: "4.2 Nutrición y dieta", value: "4.2" },
        { text: "4.3 Problemas de Comportamiento", value: "4.3" },
        { text: "🔙 Menú Principal", value: "B" }
    ];

    displayMessage(responseText, 'bot', options);
}

// --- Lógica de Respuestas Detalladas ---

// Esta función ahora retorna 'true' si envió un CTA, y 'false' si es una respuesta de texto simple.
function handleDetailedResponse(option, userInput) {
    let response = '';
    const input = userInput.toLowerCase();

    // Manejo de dudas de adaptación (Menú 2.0) y Cuidado (Menú 4.0)
    if (option === 'dudasMenu' || option === 'cuidadoMenu') {
        // [CÓDIGO DE RESPUESTAS DETALLADAS DE DUDAS Y CUIDADOS - SIN CAMBIOS]
        if (option === 'dudasMenu') {
            if (input === '2.1') { response = `**¡Entendemos tu Miedo!** Es la preocupación más común. Te tranquilizamos: la clave es la **paciencia**. Usa la **Regla de los 3-3-3** (3 días de descompresión, 3 semanas de rutina, 3 meses de confianza total). Además, ofrecemos **soporte post-adopción** y un periodo de prueba de 15 días. ¡No estás solo en esto!`; }
            else if (input === '2.2') { response = `**Hablemos de costos reales.** La cuota inicial de adopción es de $XXX (cubre vacunas, esterilización y microchip). Pero debes considerar los gastos mensuales recurrentes: alimento de calidad, chequeo veterinario anual, desparasitación trimestral, y accesorios. ¡Es una inversión a largo plazo!`; }
            else if (input === '2.3') { response = `**Un compromiso de por vida: 10 a 15 años.** Si tu vida va a cambiar (mudanza, bebé, nuevo trabajo), tu mascota debe ser parte de ese plan. ¡Nunca la abandones! Si es una emergencia extrema, contáctanos primero para buscar una solución de reubicación responsable.`; }
        } else if (option === 'cuidadoMenu') {
            if (input === '4.1') { response = `**La Regla 3-3-3 es vital para la adaptación:** * **3 Días:** Dale espacio, un lugar seguro y déjalo descompresionar (No forzar interacción). * **3 Semanas:** Establece horarios de alimentación, paseos y juego (Rutina). * **3 Meses:** El animal se siente seguro y te considera su familia (Confianza Total). La paciencia es tu mejor herramienta.`; }
            else if (input === '4.2') { response = `**La dieta es clave para la salud.** Pregunta al refugio qué comía y haz un cambio gradual si es necesario. Siempre recomendamos alimento balanceado de alta calidad. Evita dar comida humana que pueda ser tóxica (**chocolate, uvas, cebolla, xilitol**). ¡Consulta siempre a tu veterinario!`; }
            else if (input === '4.3') { response = `**Comportamiento:** La mayoría de los problemas se deben a la falta de ejercicio mental o físico. Si hay orina inapropiada, primero descarta un problema médico (visita al vet). Si muerde, es vital enseñarle el **no** y ofrecerle juguetes apropiados. ¡Nunca castigues, siempre refuerza el comportamiento positivo!`; }
        }
        
        if (response) {
            displayMessage(response, 'bot');
            return false; // No es un CTA
        }

    }

    // --- Lógica de Botones CTA para Perros ---
    else if (option === 'verPerrosMenu') {
        // RUTA ACTUALIZADA
        let link = 'componentes/feed.html?species=dog'; 
        let filterName = '';

        if (input === '5.1') { filterName = 'Perros Pequeños'; link += '&size=small'; } 
        else if (input === '5.2') { filterName = 'Perros Medianos/Grandes'; link += '&size=large'; } 
        else if (input === '5.3') { filterName = 'Cachorros'; link += '&age=puppy'; } 
        else if (input === '5.4') { filterName = 'Perros Adultos'; link += '&age=adult'; } 
        else if (input === '5.5') { filterName = 'Todos los Perros'; }
        
        if (filterName) {
            const responseText = `
                ¡Perfecto! Has seleccionado: **${filterName}**.
                
                Presiona el botón de abajo para ir directamente al catálogo de adopción filtrado.
            `;
            
            // Genera el botón CTA (usando el array quickReplies)
            const ctaButton = {
                text: `Ver ${filterName} en Catálogo 🔎`, 
                value: link 
            };
            
            displayMessage(responseText, 'bot', [ctaButton]);
            return true; // Es un CTA
        }
    }

    // --- Lógica de Botones CTA para Gatos ---
    else if (option === 'verGatosMenu') {
        // RUTA ACTUALIZADA
        let link = 'componentes/feed.html?species=cat';
        let filterName = '';

        if (input === '6.1') { filterName = 'Gatitos'; link += '&age=kitten'; } 
        else if (input === '6.2') { filterName = 'Gatos Adultos'; link += '&age=adult'; } 
        else if (input === '6.3') { filterName = 'Gatos Calmados'; link += '&personality=calm'; } 
        else if (input === '6.4') { filterName = 'Gatos Juguetones'; link += '&personality=playful'; } 
        else if (input === '6.5') { filterName = 'Todos los Gatos'; }
        
        if (filterName) {
            const responseText = `
                ¡Genial! Has seleccionado: **${filterName}**.
                
                Presiona el botón de abajo para ir directamente al catálogo de adopción filtrado.
            `;
            
            // Genera el botón CTA (usando el array quickReplies)
            const ctaButton = {
                text: `Ver ${filterName} en Catálogo 🔎`, 
                value: link 
            };
            
            displayMessage(responseText, 'bot', [ctaButton]);
            return true; // Es un CTA
        }
    }

    // Si llegamos aquí y no hay respuesta, es opción no reconocida
    if (!response) {
        displayMessage('Opción no reconocida. Por favor, usa los botones o escribe **B** para volver al menú anterior.', 'bot');
    }
    return false; // No se manejó como CTA
}


// --- Función Principal de Respuesta y Lógica de Flujo ---

function getBotResponse(userInput) {
    const userText = userInput.toLowerCase();

    // 1. Manejo de Volver (B)
    if (userText === 'b' || userText === 'volver' || userText === 'atras') {
        if (chatState === 'adoptMenu' || chatState === 'dudasMenu' || chatState === 'cuidadoMenu') {
            sendMainMenu();
            return;
        } 
        else if (chatState === 'verPerrosMenu' || chatState === 'verGatosMenu') {
            sendAdoptMenu();
            return;
        }
    }

    setTimeout(() => {
        
        // 2. Manejo del Flujo principal (chatState)
        
        if (chatState === 'mainMenu') {
            if (userText === '1' || userText.includes('adoptar')) {
                sendAdoptMenu();
            } else if (userText === '2' || userText.includes('dudas')) {
                sendDudasMenu();
            } else if (userText === '3' || userText.includes('requisitos') || userText.includes('formulario')) {
                // MODIFICACIÓN: Inyectar un enlace HTML directo al formulario de contacto
                const formLink = '/componentes/contacto.html';
                const formMessage = `Para ver los requisitos detallados y acceder al formulario de pre-adopción, por favor visita: <a href="${formLink}" style="font-weight: bold; color: #1e40af; text-decoration: underline;">[ENLACE A TU FORMULARIO DE ADOPCIÓN AQUÍ]</a>. Es el primer paso para comenzar.`;
                displayMessage(formMessage, 'bot');
                sendMainMenu();
            } else if (userText === '4' || userText.includes('cuidado')) {
                sendCuidadoMenu();
            } else {
                displayMessage('Opción no válida. Por favor, elige 1, 2, 3 o 4 para navegar.', 'bot');
                sendMainMenu();
            }
        }

        else if (chatState === 'adoptMenu') {
            if (userText === '1.1' || userText.includes('perros')) {
                sendVerPerrosMenu();
            } else if (userText === '1.2' || userText.includes('gatos')) {
                sendVerGatosMenu();
            } else if (userText === '1.4' || userText.includes('pasos')) {
                displayMessage('**Tu Camino hacia la Adopción en 4 Pasos:** (1) Postulación (2) Entrevista (3) Encuentro y Contrato (4) ¡A Casa!', 'bot');
                sendAdoptMenu();
            } else if (userText === 'b' || userText === 'volver') {
                sendMainMenu();
            } else {
                displayMessage('Opción no válida. Por favor, elige 1.1, 1.2, 1.4 o B.', 'bot');
                sendAdoptMenu();
            }
        }
        
        // ESTADO: Submenú de Filtros de Perros
        else if (chatState === 'verPerrosMenu') {
            if (['5.1', '5.2', '5.3', '5.4', '5.5'].includes(userText)) {
                // Si handleDetailedResponse retorna TRUE (se mostró un CTA), no volvemos a mostrar el menú.
                // Si retorna FALSE, el mensaje fue desconocido y volvemos a mostrar el menú.
                const isCtaSent = handleDetailedResponse('verPerrosMenu', userInput);
                if (!isCtaSent) {
                    sendVerPerrosMenu(); 
                }
            } else if (userText === '1' || userText === 'b' || userText === 'volver') {
                sendAdoptMenu();
            } else {
                displayMessage('Opción no válida. Por favor, elige una opción de filtro (5.1 a 5.5) o la opción **1** para volver.', 'bot');
                sendVerPerrosMenu();
            }
        }
        
        // ESTADO NUEVO: Submenú de Filtros de Gatos
        else if (chatState === 'verGatosMenu') {
            if (['6.1', '6.2', '6.3', '6.4', '6.5'].includes(userText)) {
                // Si handleDetailedResponse retorna TRUE (se mostró un CTA), no volvemos a mostrar el menú.
                const isCtaSent = handleDetailedResponse('verGatosMenu', userInput);
                if (!isCtaSent) {
                    sendVerGatosMenu(); 
                }
            } else if (userText === '1' || userText === 'b' || userText === 'volver') {
                sendAdoptMenu();
            } else {
                displayMessage('Opción no válida. Por favor, elige una opción de filtro (6.1 a 6.5) o la opción **1** para volver.', 'bot');
                sendVerGatosMenu();
            }
        }


        else if (chatState === 'dudasMenu') {
            handleDetailedResponse('dudasMenu', userInput);
            sendDudasMenu(); // Siempre vuelve a mostrar el menú de dudas después de la respuesta
        }

        else if (chatState === 'cuidadoMenu') {
            handleDetailedResponse('cuidadoMenu', userInput);
            sendCuidadoMenu(); // Siempre vuelve a mostrar el menú de cuidados después de la respuesta
        }

    }, 300); // Retardo para simular "escritura"
}


// --- Inicialización (Manteniendo tu estructura original) ---
// Al cargar la página, se inicializa el chat como oculto y el botón visible.
if (chatWrapper) {
    chatWrapper.classList.add('chat-hidden');
}
if (chatToggleButton) {
    chatToggleButton.style.display = 'flex';
}