(function() {
  const CHAT_API_URL = '/api/chat';
  
  const styles = `
    .zion-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .zion-chat-button {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: #000;
      border: 2px solid rgba(0,212,255,0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,212,255,0.4), 0 0 20px rgba(0,212,255,0.2);
      transition: all 0.3s ease;
      overflow: hidden;
      padding: 0;
    }
    .zion-chat-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(0,212,255,0.6), 0 0 30px rgba(0,212,255,0.3);
    }
    .zion-chat-button img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 20%;
    }
    .zion-chat-button.active img { display: none; }
    .zion-chat-button.active svg.close-icon { display: block; }
    .zion-chat-button svg.close-icon { 
      display: none;
      width: 28px;
      height: 28px;
      fill: #00d4ff;
    }
    
    .zion-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 500px;
      max-height: calc(100vh - 120px);
      background: #0a0a12;
      border: 1px solid rgba(0,212,255,0.3);
      border-radius: 20px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 10px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,212,255,0.2);
    }
    .zion-chat-window.open {
      display: flex;
      animation: zion-slide-up 0.3s ease;
    }
    @keyframes zion-slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .zion-chat-header {
      background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,102,255,0.1) 100%);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid rgba(0,212,255,0.2);
    }
    .zion-chat-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(0,212,255,0.5);
      box-shadow: 0 0 12px rgba(0,212,255,0.3);
    }
    .zion-chat-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 15%;
    }
    .zion-chat-info h4 {
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }
    .zion-chat-info span {
      color: #00ff88;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .zion-chat-info span::before {
      content: '';
      width: 6px;
      height: 6px;
      background: #00ff88;
      border-radius: 50%;
    }
    
    .zion-chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .zion-chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    .zion-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    .zion-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(0,212,255,0.3);
      border-radius: 3px;
    }
    
    .zion-message {
      max-width: 85%;
      padding: 0.75rem 1rem;
      border-radius: 16px;
      font-size: 0.9rem;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .zion-message.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #00d4ff, #0066ff);
      color: #000;
      border-bottom-right-radius: 4px;
    }
    .zion-message.bot {
      align-self: flex-start;
      background: rgba(255,255,255,0.08);
      color: #fff;
      border-bottom-left-radius: 4px;
    }
    .zion-message.typing {
      display: flex;
      gap: 4px;
      padding: 1rem;
    }
    .zion-message.typing span {
      width: 8px;
      height: 8px;
      background: #00d4ff;
      border-radius: 50%;
      animation: zion-typing 1.4s infinite ease-in-out;
    }
    .zion-message.typing span:nth-child(1) { animation-delay: 0s; }
    .zion-message.typing span:nth-child(2) { animation-delay: 0.2s; }
    .zion-message.typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes zion-typing {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }
    
    .zion-chat-input-area {
      padding: 1rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      gap: 0.75rem;
    }
    .zion-chat-input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      color: #fff;
      font-size: 0.9rem;
      outline: none;
      transition: all 0.3s ease;
    }
    .zion-chat-input:focus {
      border-color: rgba(0,212,255,0.5);
      box-shadow: 0 0 15px rgba(0,212,255,0.2);
    }
    .zion-chat-input::placeholder {
      color: rgba(255,255,255,0.4);
    }
    .zion-chat-send {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #00d4ff, #0066ff);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .zion-chat-send:hover {
      transform: scale(1.05);
    }
    .zion-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .zion-chat-send svg {
      width: 20px;
      height: 20px;
      fill: #000;
    }
    
    @media (max-width: 480px) {
      .zion-chat-window {
        width: calc(100vw - 32px);
        right: -8px;
        height: 60vh;
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  const widget = document.createElement('div');
  widget.className = 'zion-chat-widget';
  widget.innerHTML = `
    <div class="zion-chat-window">
      <div class="zion-chat-header">
        <div class="zion-chat-avatar"><img src="/assets/zion-avatar.jpg" alt="Zion"></div>
        <div class="zion-chat-info">
          <h4>Zion - Assistente ZETTA</h4>
          <span>Online</span>
        </div>
      </div>
      <div class="zion-chat-messages">
        <div class="zion-message bot">
          Olá! 👋 Sou o Zion, assistente virtual da ZETTA. Como posso ajudar você hoje?
        </div>
      </div>
      <div class="zion-chat-input-area">
        <input type="text" class="zion-chat-input" placeholder="Digite sua mensagem..." maxlength="500">
        <button class="zion-chat-send" aria-label="Enviar">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
    <button class="zion-chat-button" aria-label="Abrir chat">
      <img src="/assets/zion-avatar.jpg" alt="Zion">
      <svg class="close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  const chatButton = widget.querySelector('.zion-chat-button');
  const chatWindow = widget.querySelector('.zion-chat-window');
  const chatMessages = widget.querySelector('.zion-chat-messages');
  const chatInput = widget.querySelector('.zion-chat-input');
  const sendButton = widget.querySelector('.zion-chat-send');

  let isOpen = false;

  chatButton.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open', isOpen);
    chatButton.classList.toggle('active', isOpen);
    if (isOpen) chatInput.focus();
  });

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `zion-message ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'zion-message bot typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.id = 'zion-typing';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById('zion-typing');
    if (typing) typing.remove();
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = '';
    sendButton.disabled = true;
    showTyping();

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      hideTyping();

      if (response.ok) {
        const data = await response.json();
        addMessage(data.response, false);
      } else {
        addMessage('Desculpe, ocorreu um erro. Tente novamente.', false);
      }
    } catch (error) {
      hideTyping();
      addMessage('Não foi possível conectar ao servidor. Verifique sua conexão.', false);
    }

    sendButton.disabled = false;
  }

  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
