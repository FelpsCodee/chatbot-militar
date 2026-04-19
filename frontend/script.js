const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');
const inputField = document.getElementById('user-input-field');

API_URL = "https://chatbot-militar.vercel.app/"
function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', type);
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;


    addMessage(message, 'user');
    inputField.value = '';

    try {
        
        const response = await fetch(`${API_URL}chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.response) {
            addMessage(data.response, 'bot');
        } else {
            addMessage('Negativo, soldado. Sem resposta da base.', 'bot');
        }
    } catch (error) {
        console.error("Erro na missão:", error);
        addMessage("COMUNICAÇÃO INTERROMPIDA: Verifique se o servidor Python está rodando.", 'bot');
    }
}


sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function updateTime() {
    const clock = document.getElementById('clock');
    if (clock) {
        const now = new Date();
        clock.innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}
setInterval(updateTime, 1000);
updateTime();