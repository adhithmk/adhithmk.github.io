/**
 * Ecological Informatics Trend Backend Integration
 * This file connects the frontend website with the Python backend API
 * for fetching the latest trends in ecological informatics.
 */

class TrendsBackendService {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.defaultQuery = 'ecological informatics';
    this.isConnected = false;
    this.useMockData = true; // Fallback to mock data if API is unavailable
  }

  /**
   * Check if the backend API is available
   * @returns {Promise<boolean>} Whether the API is available
   */
  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        timeout: 3000 // 3 second timeout
      });
      
      if (response.ok) {
        console.log('Backend API is available');
        this.isConnected = true;
        this.useMockData = false;
        return true;
      }
      
      console.warn('Backend API returned non-OK status');
      this.isConnected = false;
      this.useMockData = true;
      return false;
    } catch (error) {
      console.warn('Backend API is not available:', error);
      this.isConnected = false;
      this.useMockData = true;
      return false;
    }
  }

  /**
   * Fetch all trends data from the backend
   * @param {string} query - Search query
   * @param {number} maxPapers - Maximum number of papers to fetch
   * @param {number} maxTweets - Maximum number of tweets to fetch
   * @returns {Promise<Object>} Combined trends data
   */
  async fetchAllTrends(query = this.defaultQuery, maxPapers = 5, maxTweets = 5) {
    // First check if the backend is available
    if (!this.isConnected) {
      await this.checkConnection();
    }
    
    // If we can't connect to the backend, use the existing API
    if (this.useMockData) {
      console.log('Using existing trends-api.js mock data');
      return null;
    }
    
    try {
      const url = `${this.baseUrl}/fetch-data?query=${encodeURIComponent(query)}&max_papers=${maxPapers}&max_tweets=${maxTweets}&max_bluesky=0`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatBackendData(data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
      this.useMockData = true;
      return null;
    }
  }
  
  /**
   * Format backend data to match the format expected by the frontend
   * @param {Object} backendData - Raw data from the backend
   * @returns {Array} Formatted trends data
   */
  formatBackendData(backendData) {
    const trends = [];
    
    // Process papers
    if (backendData.papers && backendData.papers.length > 0) {
      backendData.papers.forEach(paper => {
        trends.push({
          title: paper.title,
          description: paper.summary || paper.abstract,
          date: paper.published || paper.updated || new Date().toISOString(),
          category: paper.categories && paper.categories.length > 0 ? 
                   this.formatCategory(paper.categories[0]) : 'Research Paper',
          url: paper.url || paper.pdf_url,
          source: 'Academic Research'
        });
      });
    }
    
    // Process tweets
    if (backendData.tweets && backendData.tweets.length > 0) {
      backendData.tweets.forEach(tweet => {
        trends.push({
          title: tweet.text.length > 60 ? 
                 tweet.text.substring(0, 60) + '...' : 
                 tweet.text,
          description: tweet.summary || tweet.text,
          date: tweet.created_at || new Date().toISOString(),
          category: this.inferCategoryFromTweet(tweet.text),
          url: tweet.url,
          source: 'Twitter'
        });
      });
    }
    
    // Sort by date (newest first)
    trends.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return trends;
  }
  
  /**
   * Format arXiv category codes into readable names
   * @param {string} category - arXiv category code
   * @returns {string} Human-readable category
   */
  formatCategory(category) {
    const categoryMap = {
      'cs.AI': 'AI in Ecology',
      'cs.CY': 'Computing & Society',
      'cs.LG': 'Machine Learning',
      'q-bio': 'Quantitative Biology',
      'q-bio.PE': 'Population Ecology',
      'q-bio.QM': 'Quantitative Methods',
      'stat.ML': 'Machine Learning',
      'eess.SP': 'Signal Processing'
    };
    
    // Check if we have a mapping, otherwise clean up the category
    return categoryMap[category] || 
           category.split('.').pop().replace(/([A-Z])/g, ' $1').trim();
  }
  
  /**
   * Infer a category from tweet content
   * @param {string} tweetText - Tweet content
   * @returns {string} Inferred category
   */
  inferCategoryFromTweet(tweetText) {
    const lowerText = tweetText.toLowerCase();
    
    if (lowerText.includes('ai') || lowerText.includes('machine learning') || 
        lowerText.includes('deep learning') || lowerText.includes('algorithm')) {
      return 'AI in Ecology';
    } else if (lowerText.includes('sensing') || lowerText.includes('satellite') || 
              lowerText.includes('imagery') || lowerText.includes('remote')) {
      return 'Remote Sensing';
    } else if (lowerText.includes('audio') || lowerText.includes('sound') || 
              lowerText.includes('acoustic')) {
      return 'Bioacoustics';
    } else if (lowerText.includes('conservation') || lowerText.includes('protect') || 
              lowerText.includes('preserve')) {
      return 'Conservation';
    } else if (lowerText.includes('track') || lowerText.includes('gps') || 
              lowerText.includes('monitor') || lowerText.includes('migration')) {
      return 'Wildlife Tracking';
    } else if (lowerText.includes('marine') || lowerText.includes('ocean') || 
              lowerText.includes('sea') || lowerText.includes('coral')) {
      return 'Marine Ecology';
    } else if (lowerText.includes('climate') || lowerText.includes('warming') || 
              lowerText.includes('temperature')) {
      return 'Climate Impact';
    } else if (lowerText.includes('policy') || lowerText.includes('governance') || 
              lowerText.includes('regulation')) {
      return 'Environmental Policy';
    }
    
    return 'Ecological Informatics';
  }
}

// Create a global instance of the service
const trendsBackendService = new TrendsBackendService();

// Check connection when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Check if we're on the trends page
  if (window.location.pathname.includes('trends') || document.getElementById('trends')) {
    console.log('Trends page detected, initializing backend connection');
    await trendsBackendService.checkConnection();
  }
});

/**
 * Update trend cards with data from the backend
 * This will be called from the existing trends-api.js
 */
async function updateTrendsFromBackend() {
  const trendsData = await trendsBackendService.fetchAllTrends();
  
  // If we couldn't get data from the backend, return false to use the local API
  if (!trendsData) {
    return false;
  }
  
  // Otherwise update the UI with the backend data
  const trendsApi = window.TrendsAPI || {};
  if (trendsApi.updateTrendCardsWithData) {
    trendsApi.updateTrendCardsWithData(trendsData);
  } else {
    console.warn('TrendsAPI.updateTrendCardsWithData is not available');
  }
  
  return true;
}
