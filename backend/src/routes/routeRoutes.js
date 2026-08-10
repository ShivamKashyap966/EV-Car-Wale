const express = require('express');
const https = require('https');
const router = express.Router();

const CITY_COORDS = {
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'navi mumbai': [19.0330, 73.0297],
  'thane': [19.2183, 72.9781],
  'pune': [18.5204, 73.8567],
  'nagpur': [21.1458, 79.0882],
  'nashik': [19.9975, 73.7898],
  'aurangabad': [19.8762, 75.3433],
  'kolhapur': [16.7050, 74.2433],
  'solapur': [17.6599, 75.9064],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'mysuru': [12.2958, 76.6394],
  'hubli': [15.3647, 75.1240],
  'mangalore': [12.9141, 74.8560],
  'belagavi': [15.8497, 74.4977],
  'hyderabad': [17.3850, 78.4867],
  'warangal': [17.9689, 79.5941],
  'chennai': [13.0827, 80.2707],
  'coimbatore': [11.0168, 76.9558],
  'madurai': [9.9252, 78.1198],
  'salem': [11.6643, 78.1460],
  'vellore': [12.9165, 79.1325],
  'kochi': [9.9312, 76.2673],
  'kozhikode': [11.2588, 75.7804],
  'thiruvananthapuram': [8.5241, 76.9366],
  'ahmedabad': [23.0225, 72.5714],
  'surat': [21.1702, 72.8311],
  'vadodara': [22.3072, 73.1812],
  'vapi': [20.3893, 72.9106],
  'jaipur': [26.9124, 75.7873],
  'jodhpur': [26.2389, 73.0243],
  'udaipur': [24.5854, 73.7125],
  'ajmer': [26.4499, 74.6399],
  'kota': [25.2138, 75.8648],
  'chandigarh': [30.7333, 76.7794],
  'amritsar': [31.6340, 74.8723],
  'ludhiana': [30.9009, 75.8573],
  'lucknow': [26.8467, 80.9462],
  'kanpur': [26.4499, 80.3319],
  'agra': [27.1767, 78.0081],
  'varanasi': [25.3176, 82.9739],
  'patna': [25.5941, 85.1376],
  'kolkata': [22.5726, 88.3639],
  'asansol': [23.6739, 86.9524],
  'bhubaneswar': [20.2961, 85.8245],
  'visakhapatnam': [17.6868, 83.2185],
  'vijayawada': [16.5062, 80.6480],
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'gwalior': [26.2183, 78.1828],
  'dehradun': [30.3165, 78.0322],
  'shimla': [31.1048, 77.1734],
  'srinagar': [34.0837, 74.7973],
  'jammu': [32.7266, 74.8570],
  'goa': [15.2993, 74.1240],
  'panaji': [15.4909, 73.8278],
  'kurnool': [15.8281, 78.0373],
  'satara': [17.6805, 74.0183],
  'lonavala': [18.7557, 73.4091]
};

router.get('/', (req, res) => {
  const fromKey = (req.query.from || '').toLowerCase().trim();
  const toKey = (req.query.to || '').toLowerCase().trim();

  let startLat = parseFloat(req.query.fromLat);
  let startLng = parseFloat(req.query.fromLng);
  let endLat = parseFloat(req.query.toLat);
  let endLng = parseFloat(req.query.toLng);

  if ((isNaN(startLat) || isNaN(startLng)) && CITY_COORDS[fromKey]) {
    [startLat, startLng] = CITY_COORDS[fromKey];
  }
  if ((isNaN(endLat) || isNaN(endLng)) && CITY_COORDS[toKey]) {
    [endLat, endLng] = CITY_COORDS[toKey];
  }

  if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or unsupported origin and destination cities.'
    });
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

  const request = https.get(url, { headers: { 'User-Agent': 'EVCarWaleApp/1.0' }, timeout: 8000 }, (apiRes) => {
    let body = '';
    apiRes.on('data', chunk => body += chunk);
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.code === 'Ok' && Array.isArray(json.routes) && json.routes.length > 0) {
          const route = json.routes[0];
          const distanceKm = parseFloat((route.distance / 1000).toFixed(1));
          const driveTimeHours = parseFloat((route.duration / 3600).toFixed(1));
          const geometry = route.geometry; // GeoJSON LineString

          return res.json({
            success: true,
            fromKey,
            toKey,
            distanceKm,
            driveTimeHours,
            geometry,
            startCoord: [startLat, startLng],
            endCoord: [endLat, endLng]
          });
        }
      } catch (e) {
        console.error('[OSRM Parse Error]', e.message);
      }
      return res.status(502).json({
        success: false,
        error: 'Unable to calculate road route for the selected cities via routing service.'
      });
    });
  });

  request.on('error', (err) => {
    console.error('[OSRM Network Error]', err.message);
    return res.status(502).json({
      success: false,
      error: 'Routing service temporarily unavailable. Please try again.'
    });
  });

  request.on('timeout', () => {
    request.destroy();
    return res.status(504).json({
      success: false,
      error: 'Routing request timed out. Please try again.'
    });
  });
});

module.exports = router;
