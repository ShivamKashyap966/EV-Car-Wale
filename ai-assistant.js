(function() {
  'use strict';

  const RESPONSES = {
    default: "Great question! I'd recommend checking our detailed guides and articles for the most comprehensive information. You can also use our compare tool to evaluate different EV models side by side. Is there a specific aspect you'd like to explore further?",
    hi: "Hello! 👋 How can I help you with EVs today?",
    best: "Some of the best EVs in India right now include the Tata Nexon EV (₹14.74L–₹19.94L), MG ZS EV (₹18.98L–₹23.40L), and the Hyundai Ioniq 5 (₹45L–₹47L). For budget options, check out the Tata Tiago EV (₹8.69L–₹12.04L) and MG Comet EV (₹7.98L–₹9.85L).",
    under15: "Top EVs under ₹15 lakh:\n• Tata Tiago EV – ₹8.69L–₹12.04L\n• MG Comet EV – ₹7.98L–₹9.85L\n• Tata Nexon EV MR – starts at ₹14.74L\n• Citroën ë-C3 – ₹11.50L–₹13.50L\n\nThe Tiago EV offers great range and practicality!",
    chargeCost: "Charging costs in India:\n• Home (AC): ₹6-9/kWh → ₹240-360 for full 40kWh charge\n• Office/Public AC: ₹8-12/kWh\n• DC Fast Charging: ₹12-22/kWh\n\nHome charging is cheapest at ₹0.8-1.2 per km vs ₹8-9/km for petrol!",
    batteryLife: "EV battery lifespan tips:\n• Keep charge between 20-80% for daily use\n• Minimize DC fast charging\n• Avoid extreme temperatures\n• Most offer 8 yr / 1.6L km warranty\n• Typical degradation: ~2% per year\n\nWith proper care, your battery should last 10-15 years!",
    compare: "Tata Nexon EV vs MG ZS EV:\n• Price: ₹14.74L vs ₹18.98L\n• Range (ARAI): 465km vs 461km\n• Power: 127hp vs 174hp\n• Boot: 350L vs 448L\n\nBoth excellent! Nexon = better value, ZS = more power & space.",
    subsidy: "Government EV subsidies (FAME-III):\n• ₹12,500 crore total outlay\n• Passenger EVs: ₹10,000-15,000/kWh (cap ₹3.5L)\n• 2-wheelers: ₹8,000-12,000/kWh (cap ₹35k)\n• 100% road tax exemption in many states\n• Sec 80EEB: ₹1.5L deduction on EV loan interest",
    stations: "Find charging stations via:\n• Tata Power EZ Charge\n• Jio-bp Pulse\n• Zeon Charging\n• ChargeZone\n• Google Maps (filter: EV charging)\n\nIndia now has 10,000+ public charging stations across 500+ cities!",
    range: "Real-world ranges of popular EVs:\n• Tata Nexon EV LR: 350-400km\n• MG ZS EV: 350-380km\n• Hyundai Ioniq 5: 450-500km\n• Kia EV6: 450-480km\n• Tata Tiago EV: 200-250km\n• MG Comet EV: 150-180km\n\nReal range varies with driving style, AC use, and weather."
  };

  function getResponse(text) {
    const t = text.toLowerCase();
    if (t.includes('hello') || t.includes('hi ') || t.includes('hey') || t === 'hi') return RESPONSES.hi;
    if ((t.includes('best') || t.includes('recommend')) && (t.includes('ev') || t.includes('car') || t.includes('buy'))) return RESPONSES.best;
    if (t.includes('under') && t.includes('15')) return RESPONSES.under15;
    if (t.includes('under') && t.includes('lakh')) return RESPONSES.under15;
    if ((t.includes('charge') || t.includes('electricity')) && (t.includes('cost') || t.includes('price') || t.includes('bill') || t.includes('money'))) return RESPONSES.chargeCost;
    if (t.includes('battery') && (t.includes('life') || t.includes('span') || t.includes('health') || t.includes('degrade') || t.includes('last'))) return RESPONSES.batteryLife;
    if (t.includes('compare') || (t.includes('tata') && t.includes('mg')) || (t.includes('nexon') && t.includes('zs'))) return RESPONSES.compare;
    if (t.includes('subsidy') || t.includes('government') || t.includes('fame') || t.includes('policy') || t.includes('tax')) return RESPONSES.subsidy;
    if (t.includes('station') || t.includes('near') || t.includes('charger') || t.includes('find') || t.includes('locate')) return RESPONSES.stations;
    if (t.includes('range') || t.includes('how far') || t.includes('kilometer') || t.includes('distance')) return RESPONSES.range;
    return RESPONSES.default;
  }

  function init() {
    const container = document.querySelector('.ai-assistant-container');
    const trigger = document.getElementById('ai-trigger');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-chat-close');
    const overlay = document.getElementById('ai-overlay');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const chatBody = document.getElementById('ai-chat-body');
    const label = document.getElementById('ai-label');

    if (!trigger || !chatWindow) return;

    let isOpen = false;
    let labelTimer;

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

    function sendMessage(text) {
      if (!text || !text.trim()) return;
      var userMsg = document.createElement('div');
      userMsg.className = 'ai-message ai-user-message';
      userMsg.textContent = text.trim();
      chatBody.appendChild(userMsg);
      if (input) input.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(function() {
        var botMsg = document.createElement('div');
        botMsg.className = 'ai-message ai-bot-message';
        botMsg.textContent = getResponse(text.trim());
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 400 + Math.random() * 300);
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
