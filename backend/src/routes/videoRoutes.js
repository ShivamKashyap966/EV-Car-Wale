const express = require('express');
const axios = require('axios');

const router = express.Router();

// 1-hour in-memory cache for videos
let videosCache = {
  data: null,
  timestamp: 0
};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Helper to convert ISO 8601 duration string (e.g. PT4M13S) to human readable format (e.g. 4:13)
function parseISO8601Duration(duration) {
  if (!duration) return '0:00';
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

let topicCache = {};

router.get('/', async (req, res) => {
  const topic = (req.query.topic || '').trim();

  // Per-topic cache check
  const cacheEntry = topicCache[topic];
  if (cacheEntry && (Date.now() - cacheEntry.timestamp < CACHE_DURATION)) {
    return res.json(cacheEntry.data);
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: YOUTUBE_API_KEY is not defined in environment.");
    }

    // Build search query — use topic to refine results, otherwise generic EV search
    let searchQuery = 'electric car OR EV car OR electric vehicle India';
    if (topic) {
      searchQuery += ` ${topic}`;
    }

    // 1. Search for EV-related videos in India
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults: 25, // Query more results to allow for strict filtering
        key: apiKey
      },
      timeout: 10000
    });

    const items = searchResponse.data.items || [];
    
    // Whitelisted preferred Indian automotive channels (case-insensitive)
   const whitelistedChannels = [
   "motoroctane",
   "powerdrift",
   "autocar india",
   "carwale",
   "zigwheels",
   "evo india",
   "overdrive",
   "trakin auto",
   "faisal khan",
   "dds",
   "namaste car",
   "motoroids",
   "91wheels",
   "car blog india",
   "ask carguru",
   "team-bhp"
   ];
    
    // Keywords to strictly exclude (scooters, bikes, cycles, etc.)
    const excludeKeywords = [
   "scooter",
   "scooters",
   "bike",
   "bikes",
   "motorcycle",
   "motorcycles",
   "bicycle",
   "bicycles",
   "cycle",
   "cycles",
   "ola s1",
   "ather",
   "chetak",
   "iqube",
   "vida",
   "river indie",
   "revolt",
   "ultraviolette",
   "tork",
   "oben",
   "hop electric",
   "ampere",
   "hero electric",
   "okinawa",
   "joy e-bike",
   "e-bike",
   "electric bike",
   "electric scooter",
   "two-wheeler",
   "2-wheeler",
   "truck",
   "trucks",
   "bus",
   "buses",
   "tractor",
   "tractors",
   "auto rickshaw",
   "rickshaw",
   "three wheeler",
   "3 wheeler",
   "cargo"
  ];

    // Filter items
    const filteredItems = items.filter(item => {
      const title = (item.snippet?.title || '').toLowerCase();
      const description = (item.snippet?.description || '').toLowerCase();
      const channel = (item.snippet?.channelTitle || '').toLowerCase();
      const combinedText = title + ' ' + description;

      // Ensure no 2-wheelers or cycles
      if (excludeKeywords.some(kw => combinedText.includes(kw))) {
        return false;
      }

      // Check if it's from a whitelisted channel or directly reviews a passenger car in India
      const isTrustedChannel = whitelistedChannels.some(ch => channel.includes(ch));
      const hasCarModel = [
     "nexon ev",
     "curvv ev",
     "harrier ev",
     "mahindra be 6",
     "mahindra xev 9e",
     "mg windsor",
     "mg comet",
     "mg zs ev",
     "hyundai creta electric",
     "hyundai kona",
     "ioniq 5",
     "byd atto 3",
     "byd seal",
     "byd sealion 7",
     "kia ev6",
     "kia ev9",
     "volvo ex40",
     "volvo ec40",
     "bmw ix",
     "bmw i4",
     "mercedes eqs",
     "mercedes eqa",
     "audi q8 e-tron",
     "audi q6 e-tron",
     "punch ev",
     "tiago ev",
     "tigor ev",
     "citroen ec3",
     "tata avinya",
     "vinfast",
     "leaf",
     "eqe",
     "eqb"
    ];

      return isTrustedChannel || hasCarModel;
    });

    const videoIds = filteredItems.map(item => item.id.videoId).filter(Boolean);

    // 2. Fetch video durations
    let durations = {};
    if (videoIds.length > 0) {
      const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'contentDetails',
          id: videoIds.join(','),
          key: apiKey
        },
        timeout: 10000
      });

      const videoDetails = videosResponse.data.items || [];
      videoDetails.forEach(v => {
        if (v.id && v.contentDetails && v.contentDetails.duration) {
          durations[v.id] = parseISO8601Duration(v.contentDetails.duration);
        }
      });
    }

    // 3. Process and map the final list
    const processed = filteredItems.map(item => {
      const videoId = item.id.videoId;
      return {
        id: videoId,
        title: item.snippet.title || 'Untitled EV Video',
        channelName: item.snippet.channelTitle || 'YouTube Creator',
        published: item.snippet.publishedAt || new Date().toISOString(),
        thumbnail:
        item.snippet?.thumbnails?.maxres?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
       item.snippet?.thumbnails?.default?.url,
        duration: durations[videoId] || '0:00',
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    });

    // Update per-topic cache
    topicCache[topic] = {
      data: processed,
      timestamp: Date.now()
    };
    // Also update shared cache for backwards compatibility
    videosCache.data = processed;
    videosCache.timestamp = Date.now();

    res.json(processed);

  } catch (error) {
    console.error('Error fetching live videos from YouTube API:', error.message);

    const stale = topicCache[topic] || (videosCache.data ? { data: videosCache.data } : null);
    if (stale) {
      console.log('Serving stale videos cache due to API failure.');
      return res.json(stale.data);
    }

    res.status(500).json({ error: 'Unable to load latest EV videos.' });
  }
});

module.exports = router;
