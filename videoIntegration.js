(function () {
  'use strict';

  const CACHE_PREFIX = 'evcw_videos_';
  const CACHE_DURATION = 10 * 60 * 1000;

  function getCacheKey(topic) {
    return CACHE_PREFIX + (topic || '__all__');
  }

  function getCached(topic) {
    try {
      var key = getCacheKey(topic);
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var entry = JSON.parse(raw);
      if (Date.now() - entry.ts < CACHE_DURATION) {
        return entry.data;
      }
      localStorage.removeItem(key);
    } catch (e) {}
    return null;
  }

  function setCache(topic, data) {
    try {
      var key = getCacheKey(topic);
      localStorage.setItem(key, JSON.stringify({ data: data, ts: Date.now() }));
    } catch (e) {}
  }

  async function fetchVideos(topic) {
    var cached = getCached(topic);
    if (cached) return cached;

    var params = {};
    if (topic) params.topic = topic;
    var qs = new URLSearchParams(params).toString();
    var url = '/api/videos' + (qs ? '?' + qs : '');

    var res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load videos');
    var data = await res.json();
    setCache(topic, data);
    return data;
  }

  function formatDate(str) {
    try {
      var d = new Date(str);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return str || '';
    }
  }

  function renderSkeletons(container, count) {
    container.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var div = document.createElement('div');
      div.className = 'border border-zinc-200 bg-white p-4 flex flex-col gap-3 rounded-xl video-skeleton';
      div.innerHTML =
        '<div class="h-36 bg-zinc-100 rounded-lg animate-pulse"></div>' +
        '<div class="flex flex-col gap-2">' +
          '<div class="h-2.5 bg-zinc-100 rounded w-1/3 animate-pulse"></div>' +
          '<div class="h-3.5 bg-zinc-100 rounded w-3/4 animate-pulse"></div>' +
          '<div class="h-2.5 bg-zinc-100 rounded w-1/2 animate-pulse"></div>' +
        '</div>';
      container.appendChild(div);
    }
  }

  function renderCards(container, videos, options) {
    container.innerHTML = '';

    if (!videos || videos.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'col-span-full text-center py-16';
      empty.innerHTML = '<p class="text-zinc-400 font-mono text-xs">No videos available for this topic yet. Check back later.</p>';
      container.appendChild(empty);
      return;
    }

    (options.onBeforeRender || function(){})();

    var maxVideos = options.limit || videos.length;
    var displayVideos = videos.slice(0, maxVideos);

    displayVideos.forEach(function (video) {
      var card = document.createElement('div');
      card.className = 'border border-zinc-200 bg-white p-4 flex flex-col gap-3 group cursor-pointer hover:border-black transition-all video-card rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)]';
      card.setAttribute('data-video-id', video.id || '');

      var thumb = document.createElement('div');
      thumb.className = 'h-36 bg-zinc-50 border border-zinc-100 relative flex items-center justify-center overflow-hidden rounded-lg';

      var img = document.createElement('img');
      img.className = 'w-full h-full object-cover absolute inset-0';
      img.src = video.thumbnail || '';
      img.alt = video.title || 'EV Video';
      img.loading = 'lazy';
      img.onerror = function () { this.style.display = 'none'; };
      thumb.appendChild(img);

      var playBtn = document.createElement('div');
      playBtn.className = 'w-10 h-10 rounded-full border border-zinc-300 bg-white/90 flex items-center justify-center text-black scale-90 group-hover:scale-100 transition-transform duration-300 shadow relative z-10';
      playBtn.textContent = '\u25B6';
      thumb.appendChild(playBtn);

      var duration = document.createElement('span');
      duration.className = 'absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-[8px] font-mono tracking-wider rounded text-white';
      duration.textContent = video.duration || '0:00';
      thumb.appendChild(duration);

      card.appendChild(thumb);

      var info = document.createElement('div');
      info.className = 'flex flex-col gap-1 text-left font-mono';

      var channel = document.createElement('span');
      channel.className = 'text-[8px] text-zinc-500 uppercase truncate';
      channel.textContent = video.channelName || 'YouTube';
      info.appendChild(channel);

      var title = document.createElement('h3');
      title.className = 'text-xs font-bold text-zinc-700 group-hover:text-black transition-colors line-clamp-2';
      title.textContent = video.title || 'EV Video';
      info.appendChild(title);

      var date = document.createElement('span');
      date.className = 'text-[8px] text-zinc-400';
      date.textContent = formatDate(video.published);
      info.appendChild(date);

      card.appendChild(info);

      var link = document.createElement('a');
      link.href = video.url || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'mt-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500 hover:text-black transition-colors flex items-center gap-1';
      link.textContent = 'Watch on YouTube →';
      card.appendChild(link);

      container.appendChild(card);
    });

    (options.onAfterRender || function(){})();
  }

  function loadVideos(containerId, topic, options) {
    options = options || {};
    var container = document.getElementById(containerId);
    if (!container) return;

    renderSkeletons(container, options.skeletonCount || 6);

    fetchVideos(topic || '')
      .then(function (videos) {
        container.className = container.className.replace(/ grid-cols-\d+/g, '') + ' grid grid-cols-1 md:grid-cols-3 gap-6';
        renderCards(container, videos, options);
      })
      .catch(function (err) {
        console.error('VideoIntegration error:', err);
        container.className = container.className.replace(/ grid-cols-\d+/g, '') + ' grid grid-cols-1 md:grid-cols-3 gap-6';
        container.innerHTML = '';
        var errDiv = document.createElement('div');
        errDiv.className = 'col-span-full text-center py-16';
        errDiv.innerHTML = '<p class="text-zinc-400 font-mono text-xs">Unable to load videos right now. Please try again later.</p>';
        container.appendChild(errDiv);
      });
  }

  window.VideoIntegration = {
    fetchVideos: fetchVideos,
    loadVideos: loadVideos,
    renderCards: renderCards,
    renderSkeletons: renderSkeletons
  };
})();
