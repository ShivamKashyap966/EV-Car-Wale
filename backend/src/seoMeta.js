const EV_DATABASE = require('./seoCars.json');

const SOCIAL_CRAWLERS = [
  'WhatsApp',
  'Facebook',
  'Twitter',
  'LinkedIn',
  'Telegram',
  'Slack',
  'Discord',
  'Googlebot',
  'Bingbot',
  'Yahoo',
  'DuckDuckBot',
  'Applebot',
  'facebot',
  'ExternalHit',
  'preview',
  'crawler',
  'spider',
  'bot'
];

const INSIGHTS_PAGES = {
  'ev-cost-savings': {
    title: 'EV Cost & Savings — Total Cost of Ownership | EV Car Wale',
    description: 'Calculate EV running costs, charging expenses, maintenance savings and total cost of ownership compared with petrol cars.',
    image: 'https://www.evcarwale.com/insights_images/ev_cost&savings.jpg'
  },
  'ev-charging-explained': {
    title: 'EV Charging Explained — Types, Speed & Costs | EV Car Wale',
    description: 'Understand AC and DC charging, charging speeds, connectors, charging time and EV charging costs in India.',
    image: 'https://www.evcarwale.com/insights_images/ev-charging-explained.JPG'
  },
  'ev-infrastructure-india': {
    title: 'EV Charging Infrastructure in India | EV Car Wale',
    description: "Explore India's growing EV charging network, major charging operators, highway charging infrastructure and the future of electric mobility.",
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'government-policies': {
    title: 'EV Government Policies & Subsidies in India | EV Car Wale',
    description: 'Latest EV government policies, FAME subsidies, state EV policies and incentives for electric vehicle buyers in India.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'where-electricity-comes-from': {
    title: 'Where Does EV Electricity Come From? | EV Car Wale',
    description: 'Learn about electricity generation in India, renewable energy sources and how clean EV charging really is.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'renewable-energy': {
    title: 'Renewable Energy & EVs — Clean Mobility | EV Car Wale',
    description: 'Explore the intersection of renewable energy and electric vehicles, solar-powered charging and sustainable mobility.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'ev-guides': {
    title: 'EV Buying Guide & Ownership Tips | EV Car Wale',
    description: 'Complete guide to buying your first EV, ownership tips, maintenance advice and everything you need to know.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'companies-building-indias-network': {
    title: 'Companies Building India\'s EV Network | EV Car Wale',
    description: 'Major EV charging companies in India including Tata Power, ChargeZone, Statiq, Jio-bp Pulse and more.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'latest-news': {
    title: 'Latest EV News & Updates | EV Car Wale',
    description: 'Stay updated with the latest electric vehicle news, launches, policy changes and industry developments in India.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  }
};

const TOOLS_PAGES = {
  'charging-time': {
    title: 'EV Charging Time Calculator | EV Car Wale',
    description: 'Calculate exact charging time for any EV based on battery capacity, charger type and current charge level.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'emi-calculator': {
    title: 'EV Loan EMI Calculator | EV Car Wale',
    description: 'Calculate monthly EMI for your electric vehicle loan based on loan amount, interest rate and tenure.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'petrol-savings': {
    title: 'EV vs Petrol Savings Calculator | EV Car Wale',
    description: 'Compare fuel costs between electric and petrol vehicles. Calculate how much you can save by switching to EV.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  },
  'charging-stations': {
    title: 'Find EV Charging Stations Near You | EV Car Wale',
    description: 'Locate DC fast charging stations, AC chargers and EV charging points near you in India.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  }
};

const LEARN_PAGES = {
  'guide': {
    title: 'EV Guide — Learn Everything About Electric Vehicles | EV Car Wale',
    description: 'Complete guide to electric vehicles, buying tips, ownership advice and comprehensive EV knowledge.',
    image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
  }
};

function getMetadataForPath(urlPath) {
  const path = urlPath.replace(/^\/+/, '').replace(/\/$/, '');

  if (path === '' || path === '/') {
    return null;
  }

  const parts = path.split('/');

  if (parts[0] === 'cars' && parts[1]) {
    const carId = parts[1];
    const car = EV_DATABASE.find(c => c.id === carId);
    if (car) {
      const brand = car.brand || '';
      const model = car.model || '';
      const title = `${brand} ${model} — Price, Range, Battery & Charging | EV Car Wale`;
      const description = `Explore the ${brand} ${model} with price, real-world range, battery capacity, charging time, variants and specifications in India.`;
      const image = car.image || 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg';
      return {
        title,
        description,
        image: image.startsWith('http') ? image : `https://www.evcarwale.com${image.startsWith('/') ? '' : '/'}${image}`
      };
    }
  }

  if (parts[0] === 'insights' && parts[1]) {
    const key = parts[1];
    if (INSIGHTS_PAGES[key]) {
      return INSIGHTS_PAGES[key];
    }
  }

  if ((parts[0] === 'hub' || parts[0] === 'tools') && parts[1]) {
    const key = parts[1];
    if (TOOLS_PAGES[key]) {
      return TOOLS_PAGES[key];
    }
  }

  if (parts[0] === 'guide' && parts[1]) {
    return LEARN_PAGES['guide'];
  }

  if (parts[0] === 'view-all' && parts[1]) {
    const sectionLabels = {
      popular: 'Popular',
      launches: 'Launches',
      upcoming: 'Upcoming',
      all: 'All'
    };
    const label = sectionLabels[parts[1]] || parts[1];
    return {
      title: `${label} Electric Vehicles in India | EV Car Wale`,
      description: `Browse ${label.toLowerCase()} electric vehicles in India with prices, range and specifications.`,
      image: 'https://www.evcarwale.com/LOGO/EVCarWale_Logo.jpeg'
    };
  }

  return null;
}

function isSocialCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SOCIAL_CRAWLERS.some(bot => ua.includes(bot.toLowerCase()));
}

function injectMetaTags(html, metadata) {
  if (!metadata) return html;

  const ogTags = `
  <meta property="og:title" content="${escapeHtml(metadata.title)}" />
  <meta property="og:description" content="${escapeHtml(metadata.description)}" />
  <meta property="og:image" content="${escapeHtml(metadata.image)}" />
  <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
  <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
  <meta name="twitter:image" content="${escapeHtml(metadata.image)}" />`;

  let result = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);
  result = result.replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(metadata.description)}" />`);

  const existingOg = result.match(/<meta\s+property="og:title"[^>]*>/i);
  if (existingOg) {
    result = result.replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`);
    result = result.replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`);
    result = result.replace(/<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(metadata.image)}" />`);
    result = result.replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`);
    result = result.replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`);
    result = result.replace(/<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(metadata.image)}" />`);
  } else {
    result = result.replace('</head>', `${ogTags}\n</head>`);
  }

  return result;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  isSocialCrawler,
  getMetadataForPath,
  injectMetaTags
};
