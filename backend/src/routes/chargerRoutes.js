const express = require('express');
const router = express.Router();

router.get('/nearby', (req, res) => {
  res.json({
    success: false,
    error: 'Charging station search is now handled client-side via Google Maps JavaScript API.'
  });
});

router.get('/', (req, res) => {
  res.json({
    success: false,
    error: 'Charging station search is now handled client-side via Google Maps JavaScript API.'
  });
});

module.exports = router;
