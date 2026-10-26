/* ==========================================================================
   XMXX - Ultra Professional Core Engine & API Integration
   ========================================================================== */

// ১. API Configuration (এখানে আপনার API Host, Key এবং Endpoint বসাবেন)
const API_CONFIG = {
  // আপনার RapidAPI Host নিচে কোটেশনের ভেতর বসান
  HOST: 'YOUR_RAPIDAPI_HOST_HERE',
  
  // আপনার RapidAPI Key নিচে কোটেশনের ভেতর বসান
  KEY: '677f6077f6msh81af4e26e4f5359p1e9f7djsna06f2cb6db3b',
  
  // এপিআই-এর মেইন ইউআরএল বা এন্ডপয়েন্ট
  BASE_URL: 'porn-xnxx-api.p.rapidapi.com' 
};

// DOM Elements Selection
const videoGrid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryPills = document.querySelectorAll('.cat-pill');
const pageTitle = document.getElementById('pageTitle');
const resultCount = document.getElementById('resultCount');

// Modal Elements
const videoModal = document.getElementById('videoModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const playerContainer = document.getElementById('playerContainer');
const modalTitle = document.getElementById('modalTitle');
const modalViews = document.getElementById('modalViews');

// Global State
let mediaData = [];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderSkeletonLoaders();
  fetchMediaData('all');
});

// 2. Render Skeleton Loaders (পেজ লোড হওয়ার সময় স্কেলিটন ইফেক্ট)
function renderSkeletonLoaders(count = 8) {
  videoGrid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeletonHTML = `
      <div class="skeleton-card">
        <div class="skeleton-thumb"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text" style="width: 60%;"></div>
      </div>
    `;
    videoGrid.insertAdjacentHTML('beforeend', skeletonHTML);
  }
}

// 3. Fetch Data from API
async function fetchMediaData(query = '') {
  // যদি এপিআই কি/হোস্ট বসানো না থাকে, তবে ডেমো কার্ড শো করবে যেন ইউআই টেস্ট করা যায়
  if (API_CONFIG.KEY === 'YOUR_RAPIDAPI_KEY_HERE') {
    console.warn('RapidAPI Key is missing! Showing Fallback UI.');
    setTimeout(() => {
      loadFallbackData();
    }, 1000);
    return;
  }

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': API_CONFIG.HOST,
      'x-rapidapi-key': API_CONFIG.KEY
    }
  };

  try {
    const url = query && query !== 'all' 
      ? `${API_CONFIG.BASE_URL}?q=${encodeURIComponent(query)}`
      : API_CONFIG.BASE_URL;

    const response = await fetch(url, options);
    const result = await response.json();

    // API-এর রেসপন্স স্ট্রাকচার অনুযায়ী ডেটা পার্সিং (Array/Object Handling)
    mediaData = Array.isArray(result) ? result : (result.data || result.results || []);
    
    if (mediaData.length > 0) {
      renderCards(mediaData);
    } else {
      showEmptyState('No items found matching your criteria.');
    }

  } catch (error) {
    console.error('API Fetch Error:', error);
    showEmptyState('Failed to load content from remote API.');
  }
}

// 4. Render Media Cards in Grid
function renderCards(items) {
  videoGrid.innerHTML = '';
  resultCount.textContent = `Showing ${items.length} items`;

  items.forEach((item, index) => {
    // API রেসপন্স থেকে ডাইনামিক ফিল্ড এক্সট্র্যাক্ট করা
    const title = item.title || item.name || `Ultra HD Media #${index + 1}`;
    const thumbnail = item.thumbnail || item.image || item.url || 'https://via.placeholder.com/600x338/1c2128/ff0055?text=XMXX+Media';
    const duration = item.duration || 'HD 4K';
    const views = item.views ? `${item.views} Views` : '100% Quality';
    const mediaUrl = item.video_url || item.embed_url || item.url || thumbnail;

    const cardElement = document.createElement('div');
    cardElement.className = 'media-card';
    cardElement.innerHTML = `
      <div class="thumbnail-box">
        <img src="${thumbnail}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x338/1c2128/ff0055?text=XMXX+Media'">
        <span class="duration-tag">${duration}</span>
      </div>
      <div class="card-info">
        <h3 class="card-title">${title}</h3>
        <div class="card-meta">
          <span><i class="fa-solid fa-fire"></i> ${views}</span>
          <span class="badge-18">18+</span>
        </div>
      </div>
    `;

    // কার্ডে ক্লিক করলে মডাল প্লেয়ার ওপেন হবে
    cardElement.addEventListener('click', () => {
      openModal(title, mediaUrl, views);
    });

    videoGrid.appendChild(cardElement);
  });
}

// 5. Fallback Demo Data (এপিআই কানেক্ট করার আগের টেস্ট ডেটা)
function loadFallbackData() {
  const demoItems = Array.from({ length: 12 }, (_, i) => ({
    title: `XMXX Dynamic Stream Media Content - Sample Release #${i + 1}`,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop',
    duration: `${Math.floor(Math.random() * 15) + 5}:${Math.floor(Math.random() * 50) + 10}`,
    views: `${(Math.random() * 500).toFixed(1)}K`,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop'
  }));

  mediaData = demoItems;
  renderCards(demoItems);
}

// 6. Modal Functions (Video / Image Player Window)
function openModal(title, url, views) {
  modalTitle.textContent = title;
  modalViews.innerHTML = `<i class="fa-solid fa-eye"></i> ${views}`;

  // যদি প্লেয়ারের ইউআরএল <iframe> ফ্রেন্ডলি হয় বা ছবি হয়
  if (url.includes('embed') || url.includes('iframe')) {
    playerContainer.innerHTML = `<iframe src="${url}" allowfullscreen frameborder="0"></iframe>`;
  } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
    playerContainer.innerHTML = `<video src="${url}" controls autoplay loop style="width:100%; height:100%;"></video>`;
  } else {
    // পিকচার বা ইমেজ API হলে ইমেজ ভিউয়ার ওপেন হবে
    playerContainer.innerHTML = `<img src="${url}" alt="${title}" style="width:100%; height:100%; object-fit:contain;">`;
  }

  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  videoModal.classList.remove('active');
  playerContainer.innerHTML = '';
  document.body.style.overflow = 'auto';
}

closeModalBtn.addEventListener('click', closeModal);
videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) closeModal();
});

// 7. Search & Category Event Handlers
function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    pageTitle.textContent = `Search Results: "${query}"`;
    renderSkeletonLoaders();
    fetchMediaData(query);
  }
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// Category Pills Filter Action
categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    categoryPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const category = pill.getAttribute('data-category');
    pageTitle.textContent = pill.textContent.trim();
    renderSkeletonLoaders();
    fetchMediaData(category);
  });
});

// Empty State Display
function showEmptyState(message) {
  videoGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; margin-bottom: 16px; color: var(--accent-color);"></i>
      <h3 style="font-size: 18px; color: var(--text-main);">${message}</h3>
    </div>
  `;
  resultCount.textContent = '0 items found';
}
