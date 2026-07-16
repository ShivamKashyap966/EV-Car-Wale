const axios = require('axios');

async function getNearbyStations(lat, lng) {
  const res = await axios.get(`${process.env.CHARGING_STATION_API_BASE_URL}/poi/`, {
    params: {
      key: process.env.CHARGING_STATION_API_KEY,
      latitude: lat,
      longitude: lng,
      distance: 10,
      distanceunit: 'KM',
      maxresults: 20
    }
  });
  return res.data;
}

module.exports = { getNearbyStations };
