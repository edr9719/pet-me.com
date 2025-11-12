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

// --- Referencias a Elementos DOM ---
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

chatToggleButton.addEventListener('click', toggleChat);
chatCloseButton.addEventListener('click', toggleChat);


// --- Funciones de Utilidad ---

function toggleChat() {
    chatWrapper.classList.toggle('chat-hidden');

    if (!chatWrapper.classList.contains('chat-hidden')) {
        chatToggleButton.style.display = 'none';
        sendMainMenu();
    } else {
        chatToggleButton.style.display = 'flex';
    }
}

function handleQuickReplyClick(value) {
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

function displayMessage(message, sender, quickReplies = []) {
    const chatBox = document.getElementById('chat-box');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (sender === 'user-reply-pill') {
        messageElement.classList.add('user-reply-pill');
    } else {
        messageElement.classList.add(sender);
    }

    if (quickReplies.length > 0) {
        messageElement.classList.add('menu-message');
    }

    messageElement.innerHTML = message.replace(/\n/g, '<br>');
    chatBox.appendChild(messageElement);

    if (quickReplies.length > 0) {
        const replyContainer = document.createElement('div');
        replyContainer.classList.add('quick-reply-container');

        quickReplies.forEach(reply => {
            const button = document.createElement('span');
            button.classList.add('quick-reply-button');
            button.textContent = reply.text;
            button.addEventListener('click', () => {
                handleQuickReplyClick(reply.value);
            });

            replyContainer.appendChild(button);
        });

        chatBox.appendChild(replyContainer);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}
document.addEventListener('DOMContentLoaded', () => {
    const chatItems = document.querySelectorAll('.chat-item');
    const conversationMessages = document.querySelector('.conversation-messages');
    const inputArea = document.querySelector('.conversation-input-area textarea');
    const sendButton = document.querySelector('.conversation-input-area .send-btn');
    const chatListItems = document.querySelector('.chat-list-items');
    const tabs = document.querySelectorAll('.nav-tabs .tab');


    function scrollToBottom() {
        conversationMessages.scrollTop = conversationMessages.scrollHeight;
    }

    function handleChatSelection(selectedItem) {
        chatItems.forEach(item => item.classList.remove('active'));
        selectedItem.classList.add('active');
        console.log('Chat seleccionado:', selectedItem.querySelector('.chat-name').textContent);
    }

    function sendMessage() {
        const messageText = inputArea.value.trim();
        if (messageText === '') return;

        const messageRow = document.createElement('div');
        messageRow.classList.add('message-row', 'user');

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message', 'user-bubble');
        messageBubble.textContent = messageText;

        messageRow.appendChild(messageBubble);
        conversationMessages.appendChild(messageRow);
        inputArea.value = '';
        scrollToBottom();
        setTimeout(simulateBotReply, 1000);
    }

    function simulateBotReply() {
        const replyText = "Entendido, nuestro equipo revisará esto pronto. ¿Hay algo más?";
        const messageRow = document.createElement('div');
        messageRow.classList.add('message-row', 'bot');
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message', 'bot-bubble');
        messageBubble.textContent = replyText;
        messageRow.appendChild(messageBubble);
        conversationMessages.appendChild(messageRow);

        scrollToBottom();
    }

    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            handleChatSelection(item);
        });
    });

    sendButton.addEventListener('click', sendMessage);
    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            sendMessage();
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.textContent.toLowerCase();
            chatListItems.querySelectorAll('.chat-item').forEach(item => {
                if (filter === 'todos') {
                    item.style.display = 'flex';
                } else if (filter === 'no leídos') {
                    if (item.classList.contains('unread')) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
            console.log('Filtro de chats aplicado:', filter);
        });
    });
    scrollToBottom();
});


// --- Respuestas del Chatbot Pet-Me (Menús con Quick Replies) ---

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
        { text: "1.1 Ver Perros 🐶", value: "1.1" },
        { text: "1.2 Ver Gatos 🐱", value: "1.2" },
        { text: "1.4 Pasos y Requisitos", value: "1.4" },
        { text: "🔙 Menú Principal", value: "B" }
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
        { text: "2.1 No adaptación", value: "2.1" },
        { text: "2.2 Costos", value: "2.2" },
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
        { text: "4.1 Regla 3-3-3", value: "4.1" },
        { text: "4.2 Nutrición", value: "4.2" },
        { text: "4.3 Problemas de Comportamiento", value: "4.3" },
        { text: "🔙 Menú Principal", value: "B" }
    ];

    displayMessage(responseText, 'bot', options);
}

// --- Lógica de Respuestas Humanas Detalladas ---

function handleDetailedResponse(option, userInput) {
    let response = '';
    const input = userInput.toLowerCase();

    // Manejo de dudas de adaptación (Menú 2.0)
    if (option === 'dudasMenu') {
        if (input.includes('2.1')) {
            response = `
                **¡Entendemos tu Miedo!** Es la preocupación más común.
                
                Te tranquilizamos: la clave es la **paciencia**. Usa la **Regla de los 3-3-3** (3 días de descompresión, 3 semanas de rutina, 3 meses de confianza total).
                
                Además, ofrecemos **soporte post-adopción** y un periodo de prueba de 15 días. ¡No estás solo en esto!
            `;
        } else if (input.includes('2.2')) {
            response = `
                **Hablemos de costos reales.**
                
                La cuota inicial de adopción es de $XXX (cubre vacunas y esterilización). Pero debes considerar los gastos mensuales: alimento de calidad, veterinario anual, y accesorios. ¡Es una inversión a largo plazo!
            `;
        } else if (input.includes('2.3')) {
            response = `
                **Un compromiso de por vida: 10 a 15 años.** Si tu vida va a cambiar (mudanza, bebé), tu mascota debe ser parte de ese plan. ¡Nunca la abandones! Si es una emergencia extrema, contáctanos primero para buscar una solución.
            `;
        }
    }

    // Manejo de Cuidados (Menú 4.0)
    else if (option === 'cuidadoMenu') {
        if (input.includes('4.1')) {
            response = `
                **La Regla 3-3-3 es vital:**
                
                * **3 Días:** Dale espacio y un lugar seguro (Descompresión).
                * **3 Semanas:** Establece rutinas (Rutina).
                * **3 Meses:** Se siente seguro (Confianza).
                
                La paciencia es tu mejor herramienta.
            `;
        } else if (input.includes('4.2')) {
            response = `
                **La dieta es clave.** Pregunta al refugio qué comía. Siempre recomendamos alimento balanceado de alta calidad. Evita dar comida humana que pueda ser tóxica (chocolate, aguacate, cebolla, uvas).
            `;
        } else if (input.includes('4.3')) {
            response = `
                **Comportamiento:** Si orina en casa, podría ser ansiedad o un problema médico (visita al vet). Si muerde, es vital enseñarle el *no* y ofrecerle juguetes apropiados. ¡Nunca castigues, siempre refuerza lo positivo!
            `;
        }
    }

    if (response) {
        // Mostrar respuesta detallada
        displayMessage(response, 'bot');
    } else {
        // En caso de que el usuario haya escrito en vez de usar el botón.
        displayMessage('Por favor, usa los botones o escribe **B** para volver al menú principal.', 'bot');
    }
}


// --- Función Principal de Respuesta ---

function getBotResponse(userInput) {
    const userText = userInput.toLowerCase();

    setTimeout(() => {
        // Lógica para Volver al Menú Principal
        if (userText === 'b' || userText === 'volver') {
            sendMainMenu();
            return;
        }

        // --- Manejo del Flujo del Menú ---

        if (chatState === 'mainMenu') {
            if (userText === '1') {
                sendAdoptMenu();
            } else if (userText === '2') {
                sendDudasMenu();
            } else if (userText === '3') {
                displayMessage('Para ver los requisitos detallados y el formulario, por favor visita: [ENLACE A TU FORMULARIO DE ADOPCIÓN AQUÍ]', 'bot');
                sendMainMenu(); // Vuelve a mostrar el menú principal
            } else if (userText === '4') {
                sendCuidadoMenu();
            } else {
                sendMainMenu();
            }
        }

        else if (chatState === 'adoptMenu') {
            if (userText === '1.1') {
                displayMessage('¡Perfecto! Aquí tienes nuestros filtros de perritos: **[ENLACE PARA VER PERROS]**', 'bot');
            } else if (userText === '1.2') {
                displayMessage('¡Miau! Conoce a nuestros felinos: **[ENLACE PARA VER GATOS]**', 'bot');
            } else if (userText === '1.4') {
                displayMessage('**Tu Camino hacia la Adopción en 4 Pasos:** (1) Postulación (2) Entrevista (3) Encuentro y Contrato (4) ¡A Casa!', 'bot');
            }
            sendAdoptMenu();
        }

        else if (chatState === 'dudasMenu') {
            handleDetailedResponse('dudasMenu', userInput);
            sendDudasMenu(); // Volver a mostrar el menú de dudas
        }

        else if (chatState === 'cuidadoMenu') {
            handleDetailedResponse('cuidadoMenu', userInput);
            sendCuidadoMenu(); // Volver a mostrar el menú de cuidados
        }

    }, 300); // Retardo para simular "escritura"
}


// --- Inicialización ---
// Al cargar la página, se inicializa el chat como oculto y el botón visible.
chatWrapper.classList.add('chat-hidden');
chatToggleButton.style.display = 'flex';