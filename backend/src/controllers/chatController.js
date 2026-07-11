const path = require('path');
const { asyncHandler } = require('../utils/asyncHandler');

function createChatController(aiServicePath) {
  const resolvedPath = aiServicePath || path.join(__dirname, '..', '..', '..', 'aiService.js');
  const { handleAIChat } = require(resolvedPath);

  return asyncHandler(async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid payload: messages must be an array.' });
    }

    try {
      const reply = await handleAIChat(messages);
      res.json({ reply });
    } catch (err) {
      // Log the complete backend error in the terminal instead of hiding it
      console.error('=== CHAT ENDPOINT ERROR ===');
      console.error(err);
      console.error('===========================');
      
      // Return the actual error message
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });
}

module.exports = { createChatController };
