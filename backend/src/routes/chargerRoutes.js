console.log("✅ Inside chargerRoutes.js");
const express = require('express');
const { env } = require('../config/env');
console.log("✅ chargerRoutes.js LOADED");
const router = express.Router();

/**
 * GET /api/chargers/nearby
 * Proxies requests to the Open Charge Map API so the API key stays server-side.
 *
 * Query params forwarded: latitude, longitude, distance (km), maxresults, levelid, compact
 */
router.get('/nearby', async (req, res) => {
  const apiKey = env.OPENCHARGEMAP_API_KEY;
  if (!apiKey) {
    return res.json({
      success: true,
      configured: false,
      data: [],
      message: 'Open Charge Map API key is not configured'
    });
  }

  const {
    latitude = '19.076',
    longitude = '72.8777',
    distance = '25',
    maxresults = '20',
    levelid,
    compact = 'true'
  } = req.query;

  const params = new URLSearchParams({
    key: apiKey,
    output: 'json',
    countrycode: 'IN',
    latitude,
    longitude,
    distance,
    distanceunit: 'KM',
    maxresults,
    compact
  });

  if (levelid) {
    params.set('levelid', levelid);
  }

  try {
    const url = `https://api.openchargemap.io/v3/poi?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Open Charge Map API error:', response.status, text);
      return res.status(response.status).json({ success: false, error: 'Upstream API error' });
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Open Charge Map fetch failed:', error);
    res.status(502).json({ success: false, error: 'Failed to reach Open Charge Map API' });
  }
});

router.get('/', async (req, res) => {
  // Forward to the same handler as /nearby for convenience
  req.url = '/nearby' + (req.url.includes('?') ? '' : '?') + new URLSearchParams(req.query).toString();
  req.originalUrl = req.url;
  // Call the existing handler
  router.handle(req, res);
});

module.exports = router;
