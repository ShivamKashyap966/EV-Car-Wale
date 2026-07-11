const express = require('express');
const axios = require('axios');

const router = express.Router();

// 30-minute in-memory cache for news
let newsCache = {
  data: null,
  timestamp: 0
};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper to assign a single unique category based on strict priority:
// Infrastructure > Buying & Launches > Latest
function assignCategory(item) {
  const title = (item.title || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const text = title + ' ' + description;

  // Priority 1: Infrastructure
  const infraKeywords = [
    'charging station', 'charging stations', 'charging infrastructure', 'fast charger', 
    'fast chargers', 'ultra-fast charger', 'ultra-fast chargers', 'public charging', 
    'home charging', 'charging corridor', 'charging corridors', 'battery swapping', 
    'grid infrastructure', 'grid upgrade', 'grid upgrades', 'government ev infrastructure', 
    'renewable energy', 'charging company', 'charging companies', 'ocpp', 
    'open charge map', 'charging investment', 'charging investments', 'statiq', 
    'chargezone', 'zeon', 'tata power', 'bpcl', 'hpcl', 'shell recharge'
  ];
  if (infraKeywords.some(kw => text.includes(kw))) {
    return 'infrastructure';
  }

  // Priority 2: Buying & Launches
  const buyingKeywords = [
    'new ev car launch', 'new ev launch', 'upcoming ev', 'ev car review', 'ev car buying guide', 
    'best ev car', 'price update', 'price updates', 'variant', 'variants', 'range', 
    'charging speed', 'safety', 'comparison', 'comparisons', 'delivery', 'deliveries', 
    'booking', 'bookings', 'test drive', 'test drives', 'facelift', 'facelifts', 
    'upcoming car', 'upcoming cars', 'booking open', 'bookings open', 'variant launch'
  ];
  if (buyingKeywords.some(kw => text.includes(kw))) {
    return 'buying';
  }

  // Priority 3: Latest (fallback)
  return 'latest';
}

// Helper scoring function to filter and prioritize EV car news with >= 80% relevance
function scoreArticle(item) {
  const title = (item.title || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const text = title + ' ' + description;

  // 1. Exclude keywords check (boundary checks)
  const excludeRegex = /\b(sports|cricket|football|hockey|tennis|olympics|celebrities|celebrity|movies|movie|politics|elections|election|stock market|share market|mutual funds|cryptocurrency|crypto|ipl|general business|stock|stocks|shares|mutual fund)\b/i;
  if (excludeRegex.test(text)) {
    return 0; // Rejected immediately
  }

  // Reject general batteries (battery companies unless directly related to EV vehicles)
  const batteryCos = /\b(exide|amara raja|panasonic|catl|lg energy|samsung sdi|exide industries)\b/i;
  if (batteryCos.test(text)) {
    const hasEvContext = /\b(ev|electric vehicle|electric car|electric cars|lithium-ion battery|solid-state battery)\b/i.test(text) ||
                         /\b(tata|mahindra|mg|byd|hyundai|kia|bmw|mercedes|volvo|audi|porsche|vinfast|tesla|skoda|volkswagen)\b/i.test(text);
    if (!hasEvContext) {
      return 0;
    }
  }

  // Exclude non-passenger EV vehicles (electric bikes, electric scooters, trucks, buses, commercial vehicles, petrol/diesel/hybrid/cng/3w/3ws/2w/2ws/three-wheeler/two-wheeler)
  const excludeVehicles = /\b(scooter|scooters|bike|bikes|motorcycle|motorcycles|bicycle|bicycles|cycle|cycles|2-wheeler|two-wheeler|3-wheeler|three-wheeler|truck|trucks|bus|buses|commercial vehicle|commercial vehicles|ebike|escooter|electric bike|electric scooter|electric cycle|petrol|diesel|hybrid|cng|3w|3ws|2w|2ws|three-wheeler|three-wheelers|two-wheelers)\b/i;
  if (excludeVehicles.test(text)) {
    return 0;
  }

  // 2. Score calculation based on Allowed Keywords & Brands
  const allowedEVKeywords = [
    'electric vehicle', 'electric vehicle', 'electric car', 'electric cars', 'electric suv', 'electric suvs', 
    'ev', 'evs', 'ev industry', 'ev battery', 'battery technology', 'battery tech', 'lithium battery', 
    'solid-state battery', 'charging station', 'charging stations', 'charging infrastructure', 'ev charging', 
    'fast charging', 'government ev policy', 'fame', 'pm e-drive', 'ev subsidy', 'subsidies', 'road tax', 
    'charging corridor', 'charging corridors', 'battery swapping', 'grid upgrade', 'grid upgrades'
  ];

  const prioritizedBrands = [
    'tata', 'mahindra', 'mg', 'byd', 'hyundai', 'kia', 'bmw', 'mercedes', 'volvo', 'audi', 
    'porsche', 'vinfast', 'tesla', 'skoda', 'volkswagen'
  ];

  let score = 0;
  let matchesCount = 0;

  allowedEVKeywords.forEach(kw => {
    let kwMatched = false;
    if (title.includes(kw)) {
      score += 80;
      kwMatched = true;
    } else if (description.includes(kw)) {
      score += 50;
      kwMatched = true;
    }
    if (kwMatched) {
      matchesCount++;
      if (matchesCount > 1) {
        score += 15;
      }
    }
  });

  prioritizedBrands.forEach(brand => {
    if (text.includes(brand)) {
      score += 25;
    }
  });

  const isCarOrInfra = /\b(car|cars|suv|suvs|sedan|sedans|hatchback|hatchbacks|charging|charger|chargers|infrastructure|swapping)\b/i.test(text);
  if (isCarOrInfra) {
    score += 15;
  }

  const hasTitleMatch = allowedEVKeywords.some(kw => title.includes(kw)) || prioritizedBrands.some(brand => title.includes(brand));
  if (hasTitleMatch) {
    score += 10;
  }

  return Math.min(score, 100);
}

// Processes, scores, deduplicates, categorizes, and sorts the list of articles
function processAndCategorize(rawArticles) {
  // Deduplicate strictly by Title, Source, and URL
  const seenUrls = new Set();
  const seenTitles = new Set();
  
  let uniqueArticles = [];
  rawArticles.forEach(item => {
    if (!item.url || !item.title) return;
    const url = item.url.trim();
    const title = item.title.trim().toLowerCase();
    
    if (seenUrls.has(url) || seenTitles.has(title)) {
      return;
    }
    seenUrls.add(url);
    seenTitles.add(title);
    uniqueArticles.push(item);
  });

  // Score, filter out non-car EV news, and assign category
  let processed = uniqueArticles
    .map(item => {
      const score = scoreArticle(item);
      const category = assignCategory(item);
      
      let sourceName = 'Unknown Source';
      if (item.author) {
        sourceName = item.author.trim();
      } else if (item.url) {
        try {
          sourceName = new URL(item.url).hostname.replace('www.', '');
        } catch (e) {}
      }

      return {
        title: item.title || 'Untitled EV News',
        description: item.description || '',
        image: item.image && item.image !== 'None' ? item.image : '',
        source: sourceName,
        published: item.published || new Date().toISOString(),
        url: item.url || '#',
        score: score,
        category: category
      };
    })
    .filter(item => item.score >= 80); // Only keep articles with relevance >= 80%

  // Sort by score first, then by publish date desc
  processed.sort((a, b) => b.score - a.score || new Date(b.published) - new Date(a.published));
  
  return processed;
}

router.get('/', async (req, res) => {
  // Check cache validity
  if (newsCache.data && (Date.now() - newsCache.timestamp < CACHE_DURATION)) {
    return res.json(newsCache.data);
  }

  try {
    const apiKey = process.env.CURRENT_NEWS_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: CURRENT_NEWS_API_KEY is not defined in environment.");
    }

    let allRawNews = [];
    let processed = [];
    let pageNum = 1;

    // Fetch additional pages if fewer than 20 EV articles are found (up to page 5)
    while (processed.length < 20 && pageNum <= 5) {
      const initialQueries = [
        'electric vehicle',
        'EV charging India',
        'electric car India'
      ];

      const initialPromises = initialQueries.map(q => 
        axios.get('https://api.currentsapi.services/v1/search', {
          params: { keywords: q, language: 'en', apiKey: apiKey, page_number: pageNum },
          timeout: 8000
        }).catch(err => {
          console.warn(`Fetch failed for query "${q}" page ${pageNum}:`, err.message);
          return { data: { news: [] } };
        })
      );

      const initialResults = await Promise.all(initialPromises);
      let newArticlesFound = false;
      initialResults.forEach(res => {
        if (res && res.data && res.data.news && res.data.news.length > 0) {
          allRawNews.push(...res.data.news);
          newArticlesFound = true;
        }
      });

      processed = processAndCategorize(allRawNews);
      if (!newArticlesFound) {
        break;
      }
      pageNum++;
    }

    // Categories Check
    let infraList = processed.filter(a => a.category === 'infrastructure');
    let buyingList = processed.filter(a => a.category === 'buying');
    let latestList = processed.filter(a => a.category === 'latest');

    // Backup queries list to fetch incrementally if any category has fewer than 6 articles
    const backupQueries = [
      'Tata EV',
      'Mahindra EV',
      'MG Windsor EV',
      'Statiq EV charging',
      'EV launch India',
      'electric SUV India',
      'Tata Harrier EV',
      'Tata Curvv EV',
      'BYD Seal India'
    ];

    let queryIndex = 0;
    while (
      (infraList.length < 6 || buyingList.length < 6 || latestList.length < 6) &&
      queryIndex < backupQueries.length
    ) {
      const q = backupQueries[queryIndex++];
      console.log(`Category count low (infra: ${infraList.length}, buying: ${buyingList.length}, latest: ${latestList.length}). Fetching backup: "${q}"...`);
      try {
        const response = await axios.get('https://api.currentsapi.services/v1/search', {
          params: { keywords: q, language: 'en', apiKey: apiKey },
          timeout: 8000
        });
        if (response.data && response.data.news) {
          allRawNews.push(...response.data.news);
          processed = processAndCategorize(allRawNews);
          
          infraList = processed.filter(a => a.category === 'infrastructure');
          buyingList = processed.filter(a => a.category === 'buying');
          latestList = processed.filter(a => a.category === 'latest');
        }
      } catch (err) {
        console.warn(`Backup fetch failed for query "${q}":`, err.message);
      }
    }

    // Update cache
    newsCache.data = processed;
    newsCache.timestamp = Date.now();

    res.json(processed);

  } catch (error) {
    console.error('Error fetching live news:', error.message);
    
    if (newsCache.data) {
      console.log('Serving stale news cache due to API failure.');
      return res.json(newsCache.data);
    }

    res.status(500).json({ error: 'Unable to load latest EV news.' });
  }
});

module.exports = router;
