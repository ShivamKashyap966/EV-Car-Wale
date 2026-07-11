// aiService.js
// Handles communication with Gemini API modularly for EV WALE.

async function handleAIChat(messages) {
  const geminiKey = process.env.GEMINI_API_KEY;

  // System Prompt designed specifically for EV WALE AI
  const systemPromptContent = 
    "You are EV WALE AI, an expert electric vehicle assistant for India.\n\n" +
    "Your responsibilities include:\n" +
    "- Recommend EV cars based on budget.\n" +
    "- Compare EV cars.\n" +
    "- Explain specifications.\n" +
    "- Explain charging, battery health, range and maintenance.\n" +
    "- Government subsidies and policies.\n" +
    "- Charging infrastructure.\n" +
    "- Latest EV launches.\n" +
    "- Help users navigate the EV WALE website.\n" +
    "- Answer only EV-related and website-related questions.\n" +
    "- If asked something unrelated, politely say that you specialize in electric vehicles and EV WALE.\n\n" +
    "Always give clear, concise, accurate answers.\n" +
    "Prefer Indian EV market information.\n" +
    "Format answers using short paragraphs and bullet points when appropriate.";

  const systemPrompt = {
    role: "system",
    content: systemPromptContent
  };

  const fullMessages = [systemPrompt, ...messages];

  try {
    if (!geminiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environment.");
      return "I'm having trouble connecting to my brain right now. Please try again in a moment!";
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(geminiKey);

    const candidateModels = [
      process.env.GEMINI_MODEL,
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ].filter(Boolean);

    const prompt = fullMessages
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    let replyText = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        replyText = result.response.text();
        if (replyText) {
          console.log(`Successfully generated content using model: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} failed: ${err.message}. Trying next candidate...`);
        lastError = err;
      }
    }

    if (!replyText) {
      throw lastError || new Error("All Gemini model candidates failed.");
    }

    if (!replyText) {
      throw new Error("Empty response received from Gemini.");
    }

    return replyText;

  } catch (error) {
    console.error('Gemini API Integration Error:', error.message);
    return 'I\'m having trouble connecting to my brain right now. Please try again in a moment!';
  }
}

module.exports = { handleAIChat };
