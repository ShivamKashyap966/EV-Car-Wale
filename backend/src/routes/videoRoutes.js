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
   "EVolution-Nick",
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

    res.json([
  {
    id: 'nexon_ev_review',
    title: 'Tata Nexon EV Max Review & Real-World Range Test',
    channelName: 'EV Car Wale',
    published: new Date().toISOString(),
    thumbnail: '/ev_hero.png',
    duration: '14:20',
    url: 'https://www.youtube.com'
  },
  {
    id: 'mg_comet_review',
    title: 'MG Comet EV Real World Drive & Charging Speed Test',
    channelName: 'EV Car Wale',
    published: new Date().toISOString(),
    thumbnail: '/ev_hero.png',
    duration: '10:15',
    url: 'https://www.youtube.com'
  }
]);
  }
});

// ─── TOPIC VIDEO CONFIGS ─────────────────────────────────────────
const TOPIC_VIDEO_CONFIGS = {
  'ev-infrastructure-india': {
    queries: ['EV Infrastructure India', 'India EV Charging Infrastructure', 'EV Charging Network India', 'Public Charging Stations India', 'Highway EV Charging India', 'Electric Mobility India'],
    includeTerms: ['ev infrastructure', 'charging infrastructure', 'charging network', 'public charger', 'public charging', 'highway charging', 'fast charger', 'dc charging', 'charging station', 'charging hub', 'battery swapping', 'evse', 'charging corridor', 'charging point', 'charging points', 'infrastructure expansion', 'ev charging network', 'charging rollout', 'charge point', 'ultra-fast charger'],
    excludeTerms: ['review', 'ownership', 'launch', 'battery review', 'range test', 'comparison', 'vs ', 'buying guide', 'price', 'top 5', 'top 10', 'best ev', 'road trip', 'vlog', 'unboxing', 'test drive', 'first drive', 'first look', 'walkaround', 'market', 'sales', 'financial', 'earnings', 'car review']
  },
  'government-policies': {
    queries: ['EV policy India', 'government EV subsidy India', 'FAME scheme India', 'EV regulation India', 'PM E-Drive India'],
    includeTerms: ['government', 'policy', 'subsidy', 'fame', 'pm e-drive', 'ev policy', 'incentive', 'regulation', 'mandate', 'tax', 'scheme', 'ministry'],
    excludeTerms: ['review', 'car review', 'test drive', 'comparison', 'vs ', 'launch', 'price', 'top 5', 'top 10', 'vlog', 'unboxing', 'road trip']
  },
  'ev-charging-explained': {
    queries: ['EV AC DC charging explained', 'home EV charging India', 'CCS2 charging India', 'EV charging types India', 'public charging India'],
    includeTerms: ['ac charging', 'dc charging', 'fast charging', 'charging speed', 'home charger', 'home charging', 'public charging', 'ccs2', 'type 2', 'charging explained', 'charger type', 'charging connector', 'wall charger', 'level 2', 'slow charging'],
    excludeTerms: ['review', 'car review', 'launch', 'price', 'comparison', 'vs ', 'top 5', 'top 10', 'vlog', 'unboxing', 'road trip', 'sales']
  },
  'where-electricity-comes-from': {
    queries: ['electricity generation India', 'solar power India', 'wind energy India', 'power grid India', 'renewable energy India'],
    includeTerms: ['electricity', 'power generation', 'solar', 'wind', 'hydro', 'thermal', 'grid', 'renewable', 'energy', 'power plant', 'electricity generation'],
    excludeTerms: ['review', 'car review', 'launch', 'comparison', 'vs ', 'test drive', 'price', 'vlog', 'unboxing', 'cricket', 'movie', 'music']
  },
  'renewable-energy-evs': {
    queries: ['renewable energy EV India', 'solar EV charging India', 'green energy EV India', 'sustainable mobility India'],
    includeTerms: ['solar', 'wind', 'renewable', 'green energy', 'clean energy', 'sustainable', 'carbon', 'net zero', 'green electricity'],
    excludeTerms: ['review', 'car review', 'launch', 'comparison', 'vs ', 'price', 'vlog', 'unboxing', 'movie', 'music', 'gaming']
  },
  'ev-guides': {
    queries: ['EV buying guide India', 'first EV India guide', 'home EV charging guide', 'EV beginner guide India'],
    includeTerms: ['buying guide', 'how to buy', 'ev guide', 'beginner', 'first ev', 'ev tips', 'guide', 'which ev', 'ev ownership', 'charging guide', 'things to know'],
    excludeTerms: ['review', 'car review', 'launch', 'comparison', 'vs ', 'price', 'top 5', 'top 10', 'vlog', 'unboxing', 'road trip', 'sales']
  },
  'companies-building-indias-network': {
    queries: ['Tata Power EV charging India', 'Statiq charging India', 'ChargeZone EV', 'Jio-bp pulse', 'Kazam EV', 'Zeon charging', 'Bolt Earth', 'BPCL EV', 'HPCL EV'],
    includeTerms: ['tata power', 'statiq', 'chargezone', 'jio-bp', 'kazam', 'zeon', 'bolt.earth', 'bpcl', 'hpcl', 'indian oil', 'ev charging', 'charging network', 'charging company'],
    excludeTerms: ['review', 'car review', 'launch', 'comparison', 'vs ', 'price', 'top 5', 'top 10', 'vlog', 'unboxing', 'road trip', 'gaming']
  },
  'ev-cost-savings': {
    queries: ['EV running cost India', 'EV vs petrol cost India', 'EV charging cost India', 'EV ownership cost India'],
    includeTerms: ['running cost', 'cost per km', 'ev vs petrol', 'charging cost', 'maintenance cost', 'ownership cost', 'tco', 'total cost', 'battery price', 'fuel saving', 'save money', 'ev cheaper', 'savings'],
    excludeTerms: ['review', 'car review', 'launch', 'comparison', 'test drive', 'price', 'top 5', 'top 10', 'vlog', 'unboxing', 'road trip']
  },
  'market-analysis': {
    queries: ['EV sales India', 'EV market growth India', 'EV industry analysis India', 'EV adoption India'],
    includeTerms: ['ev sales', 'market share', 'market growth', 'industry analysis', 'adoption', 'ev market', 'sales data', 'registration', 'quarterly', 'report', 'demand', 'growth rate'],
    excludeTerms: ['review', 'car review', 'launch', 'test drive', 'top 5', 'top 10', 'vlog', 'unboxing', 'road trip', 'gaming', 'movie', 'cricket']
  }
};

// ─── TOPIC VIDEOS ENDPOINT ───────────────────────────────────────
let topicVideoCache = {};
const VIDEO_CACHE_DURATION = 60 * 60 * 1000;

router.get('/infrastructure', async (req, res) => {
  const topic = req.query.topic || 'ev-infrastructure-india';
  const config = TOPIC_VIDEO_CONFIGS[topic] || TOPIC_VIDEO_CONFIGS['ev-infrastructure-india'];
  const cacheKey = 'topic_' + topic;
  const cacheEntry = topicVideoCache[cacheKey];
  if (cacheEntry && (Date.now() - cacheEntry.timestamp < VIDEO_CACHE_DURATION)) {
    return res.json(cacheEntry.data);
  }
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const queries = config.queries;
    const includeTerms = config.includeTerms;
    const excludeTerms = config.excludeTerms;
    let allResults = [];
    const seenVideoIds = new Set();
    for (const q of queries) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: { part: 'snippet', q, type: 'video', maxResults: 20, key: apiKey, regionCode: 'IN', relevanceLanguage: 'en' },
          timeout: 10000
        });
        const items = response.data.items || [];
        items.forEach(item => {
          const videoId = item.id?.videoId;
          if (!videoId || seenVideoIds.has(videoId)) return;
          const title = (item.snippet?.title || '').toLowerCase();
          const desc = (item.snippet?.description || '').toLowerCase();
          const text = title + ' ' + desc;
          if (excludeTerms.some(t => text.includes(t))) return;
          if (!includeTerms.some(t => text.includes(t))) return;
          seenVideoIds.add(videoId);
          allResults.push(item);
        });
      } catch (e) { /* skip failed query */ }
    }
    allResults = allResults.slice(0, 20);
    const videoIds = allResults.map(i => i.id?.videoId).filter(Boolean);
    let durations = {};
    if (videoIds.length) {
      try {
        const vRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: { part: 'contentDetails', id: videoIds.join(','), key: apiKey },
          timeout: 10000
        });
        (vRes.data.items || []).forEach(v => {
          if (v.id && v.contentDetails?.duration) durations[v.id] = parseISO8601Duration(v.contentDetails.duration);
        });
      } catch (e) {}
    }
    const processed = allResults.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title || 'Untitled',
      description: item.snippet.description || '',
      channelName: item.snippet.channelTitle || 'YouTube',
      published: item.snippet.publishedAt || new Date().toISOString(),
      thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
      duration: durations[item.id.videoId] || '0:00',
      url: 'https://www.youtube.com/watch?v=' + item.id.videoId
    }));
    topicVideoCache[cacheKey] = { data: processed, timestamp: Date.now() };
    res.json(processed);
  } catch (error) {
    console.error('Error fetching videos for topic', topic + ':', error.message);
    const stale = topicVideoCache[cacheKey];
    if (stale) return res.json(stale.data);
    res.json([]);
  }
});

module.exports = router;
