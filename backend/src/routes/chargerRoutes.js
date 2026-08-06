const express = require('express');
const https = require('https');
const router = express.Router();

const OPENCHARGEMAP_API_KEY = process.env.OPENCHARGEMAP_API_KEY || '7af74de8-e43f-4b42-82a8-3842ffb9ea80';

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.get('/openchargemap', (req, res) => {
  const userLat = parseFloat(req.query.latitude || req.query.lat || '28.6139');
  const userLng = parseFloat(req.query.longitude || req.query.lng || '77.2090');
  const distance = req.query.distance || '100';
  const maxResults = req.query.maxresults || '100';

  const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${userLat}&longitude=${userLng}&distance=${distance}&distanceunit=KM&maxresults=${maxResults}&compact=true&verbose=false&key=${OPENCHARGEMAP_API_KEY}`;

  https.get(url, { headers: { 'User-Agent': 'EVCarWaleApp/1.0' } }, apiRes => {
    let body = '';
    apiRes.on('data', chunk => body += chunk);
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (Array.isArray(json)) {
          const stations = json.map(p => {
            const info = p.AddressInfo || {};
            const title = info.Title || 'EV Fast Charger';
            const addr = info.AddressLine1 || info.Town || 'India';
            const latitude = parseFloat(info.Latitude || userLat);
            const longitude = parseFloat(info.Longitude || userLng);
            let operator = (p.OperatorInfo && p.OperatorInfo.Title && p.OperatorInfo.Title !== '(Unknown Operator)') ? p.OperatorInfo.Title : 'ChargeZone / Tata Power';
            
            let kw = '60 kW DC Fast';
            if (p.Connections && p.Connections.length > 0) {
              const maxKw = Math.max(...p.Connections.map(c => c.PowerKW || 0));
              if (maxKw > 0) kw = `${maxKw} kW DC Fast`;
            }

            const distKm = calculateDistanceKm(userLat, userLng, latitude, longitude);

            return {
              name: title,
              title: title,
              address: addr,
              location: `${addr}, ${info.Town || ''}`.trim().replace(/^,\s*/, ''),
              city: info.Town || 'Bengaluru',
              cpo: operator,
              network: operator,
              power: kw,
              tariff: '₹18.5/kWh',
              status: 'Available',
              distanceKm: parseFloat(distKm.toFixed(1)),
              lat: latitude,
              lng: longitude,
              mapUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
            };
          }).sort((a, b) => a.distanceKm - b.distanceKm);

          return res.json({ success: true, count: stations.length, data: stations });
        }
      } catch (e) {}
      return res.status(500).json({ success: false, message: 'Failed to parse OpenChargeMap API response' });
    });
  }).on('error', err => {
    res.status(500).json({ success: false, message: err.message });
  });
});

router.get('/chargezone', (req, res) => {
  res.redirect(307, `/api/chargers/openchargemap?latitude=${req.query.latitude || '28.6139'}&longitude=${req.query.longitude || '77.2090'}&distance=100&maxresults=100`);
});

router.get('/nearby', (req, res) => {
  res.redirect(307, `/api/chargers/openchargemap?latitude=${req.query.latitude || '28.6139'}&longitude=${req.query.longitude || '77.2090'}&distance=100&maxresults=100`);
});

router.get('/', (req, res) => {
  res.redirect(307, `/api/chargers/openchargemap?latitude=${req.query.latitude || '28.6139'}&longitude=${req.query.longitude || '77.2090'}&distance=100&maxresults=100`);
});

module.exports = router;
