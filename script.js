/* ==========================================================================
   XMXX - Ultra Professional Core Engine & Video Player Integration
   ========================================================================== */

// ১. API Configuration
const API_CONFIG = {
  HOST: 'porn-xnxx-api.p.rapidapi.com',
  KEY: '677f6077f6msh81af4e26e4f5359p1e9f7djsna06f2cb6db3b',
  BASE_URL: 'https://porn-xnxx-api.p.rapidapi.com/search'
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
  fetchMediaData('trending');
});

// ২. Render Skeleton Loaders
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

// ৩. Category Mapping
function getSearchKeyword(category) {
  const map = {
    'all': 'trending',
    'popular': 'popular',
    'latest': 'new',
    'top_rated': 'best',
    'hd': 'hd'
  };
  return map[category] || category || 'trending';
}

// ৪. Fetch Data from API
async function fetchMediaData(query = 'trending') {
  const searchTerm = getSearchKeyword(query);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': API_CONFIG.HOST,
      'x-rapidapi-key': API_CONFIG.KEY
    },
    body: JSON.stringify({
      q: searchTerm,
      page: 1
    })
  };

  try {
    const response = await fetch(API_CONFIG.BASE_URL, options);
    if (!response.ok) {
      throw new Error(`API Error Status: ${response.status}`);
    }
    const result = await response.json();

    mediaData = Array.isArray(result) 
      ? result 
      : (result.result || result.results || result.videos || result.data || []);
    
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

// ৫. Render Cards
function renderCards(items) {
  videoGrid.innerHTML = '';
  resultCount.textContent = `Showing ${items.length} items`;

  items.forEach((item, index) => {
    const title = item.title || item.name || `Ultra HD Video #${index + 1}`;
    const thumbnail = item.thumbnail || item.thumb || item.image || 'https://via.placeholder.com/600x338/1c2128/ff0055?text=XMXX+Media';
    const duration = item.duration || item.time || '1080p Full HD';
    const views = item.views || item.view_count || '100% HD';
    
    // Video Link Parsing
    const videoLink = item.link || item.url || item.video_url || item.embed_url || '';

    const cardElement = document.createElement('div');
    cardElement.className = 'media-card';
    cardElement.innerHTML = `
      <div class="thumbnail-box">
        <img src="${thumbnail}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x338/1c2128/ff0055?text=XMXX+Video'">
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

    cardElement.addEventListener('click', () => {
      openModal(title, videoLink, thumbnail, views);
    });

    videoGrid.appendChild(cardElement);
  });
}

// ৬. Ultra Professional Video Player Modal
function openModal(title, videoUrl, thumbnailUrl, views) {
  modalTitle.textContent = title;
  modalViews.innerHTML = `<i class="fa-solid fa-eye"></i> ${views}`;

  // প্লেয়ারের ভেতরে প্রফেশনাল ভিডিও প্লে ওভারলে ও প্লে বাটন তৈরি
  playerContainer.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%; background: #000; display: flex; align-items: center; justify-content: center;">
      <img src="${thumbnailUrl}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.5; filter: blur(2px);" />
      
      <div style="position: absolute; text-align: center; z-index: 5; padding: 20px;">
        <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" style="
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #ff0055;
          color: #ffffff;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 0 30px rgba(255, 0, 85, 0.6);
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
          <i class="fa-solid fa-play" style="font-size: 22px;"></i> WATCH / PLAY VIDEO NOW
        </a>
        <p style="color: #8b949e; font-size: 12px; margin-top: 14px;">Click above to stream this 4K video directly</p>
      </div>
    </div>
  `;

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

// ৭. Search & Category Handlers
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

function showEmptyState(message) {
  videoGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; margin-bottom: 16px; color: var(--accent-color);"></i>
      <h3 style="font-size: 18px; color: var(--text-main);">${message}</h3>
    </div>
  `;
  resultCount.textContent = '0 items found';
                  }
