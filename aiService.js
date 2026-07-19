// aiService.js
// Handles communication with Gemini API for the EV Car Wale AI Assistant.
// Uses REST API directly via axios for full control.

var axios = require('axios');

function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

async function handleAIChat(messages) {
  var geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment.");
    return "I'm having trouble connecting to my brain right now. Please try again in a moment!";
  }

  var systemInstruction = [
    "You are EV WALE AI, a helpful and knowledgeable assistant for the EV Car Wale website.",
    "",
    "Your primary expertise is electric vehicles, especially the Indian EV market. You should answer questions about:",
    "- EV buying advice and recommendations based on budget and needs",
    "- Car comparisons (specs, features, pricing of EVs in India)",
    "- Battery health, lifespan, degradation, and maintenance tips",
    "- Charging stations, charging times, home charging setup, and costs",
    "- EV range, real-world vs ARAI range, factors affecting range",
    "- Running costs, fuel savings, total cost of ownership",
    "- Government subsidies (FAME, state policies), road tax exemptions, income tax benefits",
    "- EV terminology (regenerative braking, kW vs kWh, CCS vs CHAdeMO, etc.)",
    "- Home charging installation, wiring, and costs",
    "- EV maintenance, service intervals, parts, warranty",
    "- Latest EV launches in India and global EV trends",
    "",
    "When asked about non-EV topics, answer them normally and helpfully. You are a general-purpose assistant who happens to specialize in EVs.",
    "",
    "Guidelines:",
    "- Always give clear, concise, accurate answers",
    "- Prefer Indian market data and examples",
    "- Use short paragraphs and bullet points where helpful",
    "- Be friendly and conversational",
    "- If you don't know something, admit it rather than making up information"
  ].join("\n");

  // Build Gemini-formatted contents array
  // Convert 'assistant' role to 'model' for Gemini API
  var contents = [];
  for (var i = 0; i < messages.length; i++) {
    var msg = messages[i];
    if (!msg || !msg.content) continue;
    var role = msg.role === 'assistant' ? 'model' : msg.role;
    if (role === 'system') continue;
    contents.push({
      role: role,
      parts: [{ text: msg.content }]
    });
  }

  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: 'Hello' }]
    });
  }

  // Model fallback chain: env value first, then known-working models
  var rawModels = [
    process.env.GEMINI_MODEL,
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-lite-latest'
  ].filter(Boolean);

  var models = [];
  var seen = {};
  for (var i = 0; i < rawModels.length; i++) {
    if (!seen[rawModels[i]]) {
      seen[rawModels[i]] = true;
      models.push(rawModels[i]);
    }
  }

  var lastError = null;
  var retryCount = 0;
  var maxRetries = 1;

  while (retryCount <= maxRetries) {
    for (var m = 0; m < models.length; m++) {
      var modelName = models[m];
      try {
        var url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
                  encodeURIComponent(modelName) + ':generateContent?key=' +
                  encodeURIComponent(geminiKey);

        var response = await axios.post(url, {
          contents: contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.9,
            topK: 40
          }
        }, {
          timeout: 25000,
          headers: { 'Content-Type': 'application/json' }
        });

        var data = response.data;

        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content && data.candidates[0].content.parts) {
          var text = data.candidates[0].content.parts
            .map(function(p) { return p.text; })
            .join('');
          if (text && text.trim()) {
            console.log('Gemini success using model: ' + modelName);
            return text.trim();
          }
        }

        console.warn('Gemini model ' + modelName + ' returned empty response');
        lastError = { model: modelName, status: 200, message: 'Empty response' };

      } catch (err) {
        var status = err.response ? err.response.status : 0;
        var errBody = err.response && err.response.data ? err.response.data : null;
        var errMsg = errBody && errBody.error ? JSON.stringify(errBody.error) : err.message;

        console.warn('Gemini model ' + modelName + ' failed [HTTP ' + status + ']: ' + errMsg);

        lastError = { model: modelName, status: status, message: errMsg };
      }
    }

    if (lastError && lastError.status === 429 && retryCount < maxRetries) {
      retryCount++;
      var waitMs = retryCount * 3000;
      console.warn('Rate limited. Retry ' + retryCount + '/' + maxRetries + ' after ' + waitMs + 'ms...');
      await sleep(waitMs);
    } else {
      break;
    }
  }

  console.error('All Gemini models failed. Last error:', JSON.stringify(lastError));

  if (lastError && lastError.status === 429) {
    return "I'm currently experiencing high demand. Please wait a moment and try again!";
  }
  return 'Sorry, I encountered an issue. Please try again in a moment!';
}

module.exports = { handleAIChat };
