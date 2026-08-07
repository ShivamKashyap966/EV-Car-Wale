(function() {
  'use strict';

  var conversationHistory = [];

  function init() {
    var container = document.querySelector('.ai-assistant-container');
    var trigger = document.getElementById('ai-trigger');
    var chatWindow = document.getElementById('ai-chat-window');
    var closeBtn = document.getElementById('ai-chat-close');
    var overlay = document.getElementById('ai-overlay');
    var input = document.getElementById('ai-chat-input');
    var sendBtn = document.getElementById('ai-send-btn');
    var chatBody = document.getElementById('ai-chat-body');
    var label = document.getElementById('ai-label');

    if (!trigger || !chatWindow) return;

    var isOpen = false;
    var labelTimer;
    var typingIndicator = null;

    conversationHistory = [];

    function showTyping() {
      if (typingIndicator) return;
      typingIndicator = document.createElement('div');
      typingIndicator.className = 'ai-message ai-bot-message ai-typing';
      typingIndicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
      chatBody.appendChild(typingIndicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTyping() {
      if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
      }
    }

    function showLabel() {
      if (!isOpen && label) {
        label.classList.add('visible');
        clearTimeout(labelTimer);
        labelTimer = setTimeout(function() { label.classList.remove('visible'); }, 4000);
      }
    }

    setTimeout(showLabel, 2000);

    setInterval(function() {
      if (!isOpen) showLabel();
    }, 8000);

    function openChat() {
      isOpen = true;
      chatWindow.classList.add('open');
      if (overlay) overlay.classList.add('active');
      if (label) label.classList.remove('visible');
      setTimeout(function() { if (input) input.focus(); }, 400);
    }

    function closeChat() {
      isOpen = false;
      chatWindow.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      setTimeout(showLabel, 500);
    }

    trigger.addEventListener('click', openChat);
    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    if (overlay) overlay.addEventListener('click', closeChat);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });

    function addMessage(text, className) {
      var msg = document.createElement('div');
      msg.className = 'ai-message ' + className;
      msg.textContent = text;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage(text) {
      if (!text || !text.trim()) return;

      var userText = text.trim();
      addMessage(userText, 'ai-user-message');

      conversationHistory.push({ role: 'user', content: userText });
      if (input) input.value = '';
      showTyping();

      var payload = { messages: conversationHistory };
      console.log('[AI Assistant Widget] Sending request to POST /api/chat:', payload);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/chat', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 30000;

      xhr.onload = function() {
        hideTyping();
        console.log('[AI Assistant Widget] Received response [HTTP ' + xhr.status + ']:', xhr.responseText);
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            var reply = data.reply || 'Sorry, I didn\'t understand that. Could you rephrase?';
            conversationHistory.push({ role: 'assistant', content: reply });
            addMessage(reply, 'ai-bot-message');
          } catch (e) {
            console.error('[AI Assistant Widget Parsing Error]:', e);
            addMessage('Sorry, I had trouble processing that response. Please try again.', 'ai-bot-message');
          }
        } else {
          try {
            var errData = JSON.parse(xhr.responseText);
            addMessage(errData.error || 'Sorry, something went wrong. Please try again.', 'ai-bot-message');
          } catch (e) {
            addMessage('Sorry, something went wrong. Please try again.', 'ai-bot-message');
          }
        }
      };

      xhr.onerror = function(err) {
        hideTyping();
        console.error('[AI Assistant Widget Network Error]:', err);
        addMessage('Oops! Looks like you\'re offline. Please check your connection and try again.', 'ai-bot-message');
      };

      xhr.ontimeout = function() {
        hideTyping();
        console.warn('[AI Assistant Widget Timeout]');
        addMessage('The request timed out. Please try again.', 'ai-bot-message');
      };

      xhr.send(JSON.stringify(payload));
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', function() {
        if (input) sendMessage(input.value);
      });
    }

    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage(input.value);
        }
      });
    }

    chatBody.addEventListener('click', function(e) {
      var chip = e.target.closest('.ai-chip');
      if (chip) sendMessage(chip.textContent);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function showContainer() {
    if (document.getElementById('preloader')) {
      return;
    }
    var c = document.querySelector('.ai-assistant-container');
    if (c) c.classList.add('loaded');
  }
  window.showAIAssistant = function() {
    var c = document.querySelector('.ai-assistant-container');
    if (c) c.classList.add('loaded');
  };
  if (document.readyState === 'complete') {
    showContainer();
  } else {
    window.addEventListener('load', showContainer);
  }
})();
