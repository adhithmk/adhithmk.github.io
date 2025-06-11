/**
 * Trends API Integration for Ecological Informatics Website
 * Fetches trends from academic and social platforms
 */

class TrendsAPI {
  constructor() {
    this.trendCards = document.querySelectorAll('.trend-card');
    this.apiKeys = {
      // These would need to be replaced with actual API keys
      twitter: 'YOUR_TWITTER_API_KEY',
      // Add other API keys as needed
    };
    
    // Keywords to track in ecological informatics
    this.keywords = [
      'ecological informatics',
      'wildlife conservation',
      'biodiversity monitoring',
      'GIS ecology',
      'remote sensing ecology',
      'acoustic ecology',
      'bioacoustics',
      'ecosystem restoration'
    ];
    
    // Initialize proxy for cross-origin requests
    this.corsProxy = 'https://corsproxy.io/?';
    
    this.chart = null;
    this.initialized = false;
    this.useBackend = false; // Flag to determine if we should use the backend API
  }
  
  /**
   * Initialize and start all data fetching
   */
  async init() {
    await this.initialize();
    
    // Fetch data every 1 hour
    this.updateTrends();
    setInterval(() => this.updateTrends(), 3600000);
    
    // Add event listener for manual refresh
    const refreshBtn = document.getElementById('refresh-trends');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.updateTrends());
    }
    
    // Add click handlers to ensure links open correctly
    this.setupLinkHandlers();
    
    // Setup edit and delete handlers for admin buttons
    this.setupAdminHandlers();
  }
  
  /**
   * Initialize the trends API
   */
  async initialize() {
    if (this.initialized) return;
    
    // Check if the backend integration script is loaded
    if (typeof trendsBackendService !== 'undefined') {
      // Try to connect to the backend
      this.useBackend = await trendsBackendService.checkConnection();
      console.log(`Using backend API: ${this.useBackend}`);
    }
    
    this.initialized = true;
  }
  
  /**
   * Update all trend sources
   */
  async updateTrends() {
    try {
      // Update loading state
      this.setLoading(true);
      
      // Fetch data from multiple sources in parallel
      const trendsData = await this.updateTrendCards();
      
      // Update last refreshed timestamp
      this.updateRefreshTimestamp();
    } catch (error) {
      console.error('Error updating trends:', error);
    } finally {
      this.setLoading(false);
    }
  }
  
  /**
   * Update the trend cards with data from either the backend or mock data
   */
  async updateTrendCards() {
    await this.initialize();
    
    // Try to get data from the backend first
    if (this.useBackend) {
      try {
        const backendData = await trendsBackendService.fetchAllTrends();
        if (backendData && backendData.length > 0) {
          // Use the backend data if available
          return this.updateTrendCardsWithData(backendData);
        }
      } catch (error) {
        console.error('Error fetching data from backend:', error);
        // Fall back to mock data
      }
    }
    
    // If backend data isn't available, use the mock data
    const mockData = this.getSimulatedScholarResults().concat(this.getSimulatedTwitterResults(), this.getSimulatedNewsResults());
    return this.updateTrendCardsWithData(mockData);
  }
  
  /**
   * Update trend cards with the provided data
   * @param {Array} data - Array of trend objects
   */
  updateTrendCardsWithData(data) {
    const container = document.querySelector('.trends-grid');
    if (!container) return;
    
    // Clear any dynamically added cards
    const existingDynamicCards = container.querySelectorAll('.trend-card[data-dynamic="true"]');
    existingDynamicCards.forEach(card => card.remove());
    
    // Add each trend as a card
    data.forEach(trend => {
      const card = document.createElement('div');
      card.className = 'trend-card';
      card.setAttribute('data-dynamic', 'true');
      
      const header = document.createElement('div');
      header.className = 'trend-header';
      
      const category = document.createElement('div');
      category.className = 'trend-category';
      category.textContent = trend.category;
      
      const date = document.createElement('div');
      date.className = 'trend-date';
      date.textContent = this.formatDate(trend.date);
      
      header.appendChild(category);
      header.appendChild(date);
      
      const title = document.createElement('h3');
      title.textContent = trend.title;
      
      const description = document.createElement('p');
      description.textContent = trend.description;
      
      card.appendChild(header);
      card.appendChild(title);
      card.appendChild(description);
      
      // Add link button if URL is provided
      if (trend.url) {
        const button = document.createElement('button');
        button.className = 'trend-link btn';
        button.textContent = 'Read Original Paper';
        button.onclick = function() {
          window.open(trend.url, '_blank');
        };
        card.appendChild(button);
      }
      
      container.appendChild(card);
    });
    
    // Set up link handlers for any static cards
    this.setupLinkHandlers();
    
    return data;
  }
  
  /**
   * Set up click handlers for trend card links
   */
  setupLinkHandlers() {
    // Find all trend cards
    const trendCards = document.querySelectorAll('.trend-card');
    
    // For each card, ensure the link opens in a new tab
    trendCards.forEach(card => {
      const linkEl = card.querySelector('.trend-link');
      
      // If it's a button with onclick already set, skip it
      if (linkEl && linkEl.tagName === 'BUTTON' && linkEl.hasAttribute('onclick')) {
        return;
      }
      
      // If it's an anchor tag, convert it to a button
      if (linkEl && linkEl.tagName === 'A') {
        const url = linkEl.getAttribute('href');
        const text = linkEl.textContent;
        
        // Create a new button with onclick handler
        const newButton = document.createElement('button');
        newButton.classList.add('trend-link', 'btn');
        newButton.textContent = text || 'Read Original Paper';
        newButton.onclick = function() {
          window.open(url, '_blank');
        };
        
        // Replace the link with the button
        linkEl.parentNode.replaceChild(newButton, linkEl);
      }
    });
  }
  
  /**
   * Setup edit and delete handlers for admin buttons
   */
  setupAdminHandlers() {
    // Edit button handler
    document.querySelectorAll('.edit-trend').forEach(button => {
      button.addEventListener('click', async (e) => {
        const trendId = e.target.dataset.trendId;
        const updatedData = this.getUpdatedDataFromForm(trendId);
        try {
          await this.editTrend(trendId, updatedData);
          alert('Trend updated successfully!');
          this.updateTrends();
        } catch (error) {
          alert('Error updating trend: ' + error.message);
        }
      });
    });

    // Delete button handler
    document.querySelectorAll('.delete-trend').forEach(button => {
      button.addEventListener('click', async (e) => {
        const trendId = e.target.dataset.trendId;
        if (confirm('Are you sure you want to delete this trend?')) {
          try {
            await this.deleteTrend(trendId);
            alert('Trend deleted successfully!');
            this.updateTrends();
          } catch (error) {
            alert('Error deleting trend: ' + error.message);
          }
        }
      });
    });
  }

  /**
   * Get updated data from edit form
   * @param {string} trendId - ID of trend being edited
   */
  getUpdatedDataFromForm(trendId) {
    const form = document.querySelector(`#edit-form-${trendId}`);
    return {
      title: form.querySelector('.edit-title').value,
      description: form.querySelector('.edit-description').value,
      category: form.querySelector('.edit-category').value
    };
  }
  
  /**
   * Update the timestamp for when data was last refreshed
   */
  updateRefreshTimestamp() {
    const timestampEl = document.getElementById('last-updated');
    if (timestampEl) {
      const now = new Date();
      timestampEl.textContent = `Last updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }
  }
  
  /**
   * Set loading state in the UI
   */
  setLoading(isLoading) {
    const loadingEl = document.getElementById('trends-loading');
    if (loadingEl) {
      if (isLoading) {
        loadingEl.style.display = 'flex';
      } else {
        loadingEl.style.display = 'none';
      }
    }
  }
  
  /**
   * Format a date string to a readable format
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  /**
   * Simulate Google Scholar results
   */
  getSimulatedScholarResults() {
    return [
      {
        title: 'Machine Learning Approaches for Biodiversity Monitoring: A Comprehensive Review',
        description: 'This paper reviews recent advances in machine learning techniques for biodiversity monitoring, highlighting strengths and limitations of different approaches.',
        date: '2025-03-21',
        category: 'AI in Ecology',
        url: 'https://www.nature.com/articles/s41597-021-01113-4'
      },
      {
        title: 'Integrating Indigenous Knowledge with Remote Sensing for Improved Forest Management',
        description: 'Researchers demonstrate how combining traditional ecological knowledge with satellite data can enhance forest conservation strategies.',
        date: '2025-03-18',
        category: 'Remote Sensing',
        url: 'https://www.sciencedirect.com/science/article/pii/S0034425720304314'
      },
      {
        title: 'Automated Bioacoustic Monitoring Reveals Cryptic Species in Tropical Rainforests',
        description: 'Novel deep learning algorithms applied to long-term acoustic monitoring have identified previously unknown species in biodiversity hotspots.',
        date: '2025-03-12',
        category: 'Bioacoustics',
        url: 'https://www.pnas.org/doi/10.1073/pnas.2110940118'
      }
    ];
  }
  
  /**
   * Simulate Twitter results
   */
  getSimulatedTwitterResults() {
    return [
      {
        title: 'New Open-Source Tools for Ecological Data Analysis Released',
        description: 'The EcoInformatics Institute has released a suite of open-source R packages for analyzing and visualizing ecological datasets, available for free download.',
        date: '2025-03-25',
        category: 'Tools & Technology',
        url: 'https://github.com/weecology/MATSS'
      },
      {
        title: 'Global Climate Biodiversity Summit Announces New Conservation Targets',
        description: 'World leaders have committed to protecting 40% of terrestrial and marine habitats by 2030, with special focus on biodiversity hotspots.',
        date: '2025-03-17',
        category: 'Conservation',
        url: 'https://www.unep.org/resources/publications/1st-draft-post-2020-global-biodiversity-framework'
      }
    ];
  }
  
  /**
   * Simulate news results
   */
  getSimulatedNewsResults() {
    return [
      {
        title: 'Breakthrough in Environmental DNA Techniques Allows Rapid Ecosystem Assessment',
        description: 'Scientists have developed a new eDNA sequencing method that can identify thousands of species from a single water sample in under 24 hours.',
        date: '2025-03-23',
        category: 'Genomics',
        url: 'https://www.science.org/doi/10.1126/science.aau1780'
      },
      {
        title: 'Citizen Science Platform Reaches One Million Ecological Observations',
        description: 'The EcoTrack platform has logged its millionth observation, making it one of the largest citizen science datasets for ecological research.',
        date: '2025-03-19',
        category: 'Citizen Science',
        url: 'https://www.inaturalist.org/pages/publications'
      }
    ];
  }
  
  /**
   * Handle edit trend
   * @param {string} trendId - ID of trend to edit
   * @param {Object} updatedData - New trend data
   */
  async editTrend(trendId, updatedData) {
    try {
      if (this.useBackend) {
        return await trendsBackendService.editTrend(trendId, updatedData);
      }
      // Fallback to local storage if backend not available
      const trends = JSON.parse(localStorage.getItem('trends') || '[]');
      const index = trends.findIndex(t => t.id === trendId);
      if (index !== -1) {
        trends[index] = { ...trends[index], ...updatedData };
        localStorage.setItem('trends', JSON.stringify(trends));
        return trends[index];
      }
      throw new Error('Trend not found');
    } catch (error) {
      console.error('Error editing trend:', error);
      throw error;
    }
  }

  /**
   * Handle delete trend
   * @param {string} trendId - ID of trend to delete
   */
  async deleteTrend(trendId) {
    try {
      if (this.useBackend) {
        return await trendsBackendService.deleteTrend(trendId);
      }
      // Fallback to local storage if backend not available
      const trends = JSON.parse(localStorage.getItem('trends') || '[]');
      const filteredTrends = trends.filter(t => t.id !== trendId);
      localStorage.setItem('trends', JSON.stringify(filteredTrends));
      return true;
    } catch (error) {
      console.error('Error deleting trend:', error);
      throw error;
    }
  }
}

// Initialize and export trends API
const trendsAPI = new TrendsAPI();
document.addEventListener('DOMContentLoaded', () => trendsAPI.init());
