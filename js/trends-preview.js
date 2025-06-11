/**
 * Trends Preview Component
 * This script populates the trends preview section on the homepage
 * with the latest ecological informatics trends and visualizations.
 */

class TrendsPreview {
  constructor() {
    // DOM elements for trends preview
    this.previewContainer = document.querySelector('.trends-preview-grid');
    this.maxPreviewItems = 3; // Number of trend items to show in the preview
    this.initialized = false;
    
    // DOM elements for visualizations
    this.vizCanvas = document.getElementById('home-visualization-canvas');
    this.vizTypeSelector = document.getElementById('home-viz-type-selector');
    this.refreshButton = document.getElementById('home-refresh-viz');
    this.insightCards = document.querySelectorAll('.home-insight-card');
    this.loadingIndicator = document.querySelector('.home-viz-loading');
    
    // Chart instance
    this.chart = null;
    
    // Current visualization state
    this.currentVizType = 'temperature';
    
    // Initialize the component
    this.init();
  }

  /**
   * Initialize the trends preview component
   */
  async init() {
    // Check if we're on the homepage
    if (!document.getElementById('trends-preview')) return;
    
    this.initialized = true;
    
    // Set up event listeners for visualization controls
    this.setupEventListeners();
    
    // Load trends data
    await this.loadTrends();
    
    // Initialize visualization if elements exist
    if (this.vizCanvas) {
      this.loadVisualization(this.currentVizType);
    }
  }

  /**
   * Set up event listeners for the visualization controls
   */
  setupEventListeners() {
    // Visualization type change
    if (this.vizTypeSelector) {
      this.vizTypeSelector.addEventListener('change', (e) => {
        this.currentVizType = e.target.value;
        this.loadVisualization(this.currentVizType);
        this.updateInsightCard(this.currentVizType);
      });
    }
    
    // Refresh button click
    if (this.refreshButton) {
      this.refreshButton.addEventListener('click', () => {
        this.refreshData();
      });
    }
  }
  
  /**
   * Load trends data from either the backend or the TrendsAPI
   */
  async loadTrends() {
    if (!this.previewContainer) return;
    
    try {
      let trendsData = [];
      
      // Try to use the backend service if available
      if (typeof trendsBackendService !== 'undefined') {
        // Check if the backend is available
        const isConnected = await trendsBackendService.checkConnection();
        
        if (isConnected) {
          // Fetch data from the backend
          trendsData = await trendsBackendService.fetchAllTrends();
        }
      }
      
      // If we couldn't get data from the backend, use the TrendsAPI
      if (!trendsData || trendsData.length === 0) {
        if (typeof TrendsAPI !== 'undefined') {
          const trendsApi = new TrendsAPI();
          // Get mock data from the TrendsAPI
          trendsData = trendsApi.getMockTrendData();
        } else {
          // Fallback to hardcoded data if TrendsAPI is not available
          trendsData = this.getFallbackTrendData();
        }
      }
      
      // Display the trends in the preview section
      this.displayTrendsPreview(trendsData);
      
    } catch (error) {
      console.error('Error loading trends preview:', error);
      // Use fallback data in case of error
      this.displayTrendsPreview(this.getFallbackTrendData());
    }
  }

  /**
   * Display trends in the preview section
   * @param {Array} trends - Array of trend objects
   */
  displayTrendsPreview(trends) {
    if (!this.previewContainer) return;
    
    // Clear any existing content
    this.previewContainer.innerHTML = '';
    
    // Sort by date (newest first) and take only the most recent items
    const sortedTrends = trends
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, this.maxPreviewItems);
    
    // Create and append trend cards
    sortedTrends.forEach(trend => {
      const card = this.createTrendCard(trend);
      this.previewContainer.appendChild(card);
    });
  }

  /**
   * Create a trend card element
   * @param {Object} trend - Trend data object
   * @returns {HTMLElement} - The created card element
   */
  createTrendCard(trend) {
    const card = document.createElement('div');
    card.className = 'trends-preview-card';
    
    const header = document.createElement('div');
    header.className = 'trends-preview-header';
    
    const category = document.createElement('div');
    category.className = 'trends-preview-category';
    category.textContent = trend.category;
    
    const date = document.createElement('div');
    date.className = 'trends-preview-date';
    date.textContent = this.formatDate(trend.date);
    
    header.appendChild(category);
    header.appendChild(date);
    
    const title = document.createElement('h3');
    title.textContent = trend.title;
    
    const description = document.createElement('p');
    // Truncate description if too long
    description.textContent = this.truncateText(trend.description, 120);
    
    const link = document.createElement('a');
    link.className = 'trends-preview-link';
    link.textContent = 'Read more';
    link.href = 'trends.html';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-arrow-right';
    link.appendChild(icon);
    
    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(link);
    
    return card;
  }

  /**
   * Format a date string
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  /**
   * Truncate text to a specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} - Truncated text
   */
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Get fallback trend data in case API is unavailable
   * @returns {Array} - Array of trend objects
   */
  getFallbackTrendData() {
    return [
      {
        title: 'New AI Models Predict Biodiversity Loss with Unprecedented Accuracy',
        description: 'Researchers have developed a new ensemble of machine learning models that can predict biodiversity loss due to climate change with over 85% accuracy, the highest rate achieved to date.',
        date: '2025-03-25',
        category: 'AI in Ecology',
        url: 'https://www.nature.com/articles/s41559-022-01914-9'
      },
      {
        title: 'Satellite Data Reveals Unexpected Forest Recovery Patterns',
        description: 'A global analysis of satellite imagery has uncovered unexpected patterns of forest recovery in previously degraded areas, suggesting new approaches for restoration ecology.',
        date: '2025-03-20',
        category: 'Remote Sensing',
        url: 'https://www.sciencedirect.com/science/article/pii/S0378112721007593'
      },
      {
        title: 'Acoustic Monitoring Networks Show Promise for Large-scale Biodiversity Assessment',
        description: 'A new study demonstrates how networks of acoustic sensors can provide cost-effective monitoring of biodiversity across large landscapes, offering alternatives to traditional survey methods.',
        date: '2025-03-15',
        category: 'Bioacoustics',
        url: 'https://www.pnas.org/doi/10.1073/pnas.2004702117'
      }
    ];
  }
  
  /**
   * Show the loading indicator for visualizations
   */
  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'flex';
    }
    if (this.vizCanvas) {
      this.vizCanvas.classList.remove('active-viz');
    }
  }
  
  /**
   * Hide the loading indicator for visualizations
   */
  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'none';
    }
    if (this.vizCanvas) {
      this.vizCanvas.classList.add('active-viz');
    }
  }
  
  /**
   * Update the active insight card
   * @param {string} vizType - The visualization type
   */
  updateInsightCard(vizType) {
    // Hide all insight cards
    this.insightCards.forEach(card => {
      card.classList.remove('active');
    });
    
    // Show the selected insight card
    const selectedCard = document.querySelector(`.home-insight-card[data-viz="${vizType}"]`);
    if (selectedCard) {
      selectedCard.classList.add('active');
    }
  }
  
  /**
   * Load a visualization based on type
   * @param {string} vizType - The visualization type
   */
  loadVisualization(vizType) {
    if (!this.vizCanvas) return;
    
    // Show loading indicator
    this.showLoading();
    
    // Simulate loading delay
    setTimeout(() => {
      // Get data for the selected visualization type
      const data = this.getVisualizationData(vizType);
      
      // Create or update the chart
      this.createChart(vizType, data);
      
      // Hide loading indicator
      this.hideLoading();
    }, 800);
  }
  
  /**
   * Refresh the current visualization data
   */
  refreshData() {
    if (!this.vizCanvas) return;
    
    // Show loading indicator
    this.showLoading();
    
    // Simulate data refresh
    setTimeout(() => {
      // Get the refreshed data
      const data = this.getVisualizationData(this.currentVizType);
      
      // Update the chart
      this.createChart(this.currentVizType, data);
      
      // Hide loading indicator
      this.hideLoading();
    }, 1200);
  }
  
  /**
   * Get data for a specific visualization type
   * @param {string} vizType - The visualization type
   * @returns {Object} - The data for the visualization
   */
  getVisualizationData(vizType) {
    switch (vizType) {
      case 'temperature':
        return this.getTemperatureData();
      case 'biodiversity':
        return this.getBiodiversityData();
      case 'landcover':
        return this.getLandCoverData();
      case 'species':
        return this.getSpeciesData();
      default:
        return this.getTemperatureData();
    }
  }
  
  /**
   * Create or update a chart with the provided data
   * @param {string} vizType - The visualization type
   * @param {Object} data - The chart data
   */
  createChart(vizType, data) {
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    // Get chart configuration based on visualization type
    const chartConfig = this.getChartConfig(vizType, data);
    
    // Create the chart
    this.chart = new Chart(this.vizCanvas, chartConfig);
  }
  
  /**
   * Get chart configuration based on visualization type
   * @param {string} vizType - The visualization type
   * @param {Object} data - The chart data
   * @returns {Object} - Chart configuration object
   */
  getChartConfig(vizType, data) {
    const baseConfig = {
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: "'Nunito', sans-serif",
                size: 12
              },
              color: '#e0e0e0'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
            titleFont: {
              family: "'Montserrat', sans-serif",
              size: 14
            },
            bodyFont: {
              family: "'Nunito', sans-serif",
              size: 13
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#b0b0b0',
              font: {
                family: "'Nunito', sans-serif",
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#b0b0b0',
              font: {
                family: "'Nunito', sans-serif",
                size: 11
              }
            }
          }
        }
      }
    };
    
    // Chart type-specific configurations
    switch (vizType) {
      case 'temperature':
        baseConfig.type = 'line';
        baseConfig.options.scales.y.title = {
          display: true,
          text: 'Temperature (u00b0C)',
          color: '#e0e0e0'
        };
        break;
        
      case 'biodiversity':
        baseConfig.type = 'bar';
        baseConfig.options.scales.y.title = {
          display: true,
          text: 'Shannon Index',
          color: '#e0e0e0'
        };
        break;
        
      case 'landcover':
        baseConfig.type = 'pie';
        // Remove scales for pie chart
        delete baseConfig.options.scales;
        break;
        
      case 'species':
        baseConfig.type = 'radar';
        baseConfig.options.scales = {
          r: {
            angleLines: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            pointLabels: {
              color: '#e0e0e0',
              font: {
                family: "'Nunito', sans-serif",
                size: 12
              }
            },
            ticks: {
              color: '#b0b0b0',
              backdropColor: 'transparent'
            }
          }
        };
        break;
        
      default:
        baseConfig.type = 'line';
    }
    
    return baseConfig;
  }
  
  /**
   * Get temperature data for visualization
   * @returns {Object} - Chart.js compatible data object
   */
  getTemperatureData() {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Average Temperature',
          data: [12.3, 13.1, 14.5, 16.2, 18.7, 21.5, 23.8, 23.2, 21.4, 18.5, 15.2, 13.1],
          borderColor: '#00ff8c',
          backgroundColor: 'rgba(0, 255, 140, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: false
        },
        {
          label: 'Maximum Temperature',
          data: [16.8, 17.5, 19.2, 21.5, 24.3, 27.8, 30.2, 29.5, 26.8, 23.2, 19.5, 17.2],
          borderColor: '#ff3a5e',
          backgroundColor: 'rgba(255, 58, 94, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          fill: false
        },
        {
          label: 'Minimum Temperature',
          data: [8.1, 8.5, 9.8, 11.2, 13.5, 15.8, 17.5, 17.2, 16.1, 13.8, 10.9, 8.7],
          borderColor: '#00b3ff',
          backgroundColor: 'rgba(0, 179, 255, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          fill: false
        }
      ]
    };
  }
  
  /**
   * Get biodiversity data for visualization
   * @returns {Object} - Chart.js compatible data object
   */
  getBiodiversityData() {
    return {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Protected Forest',
          data: [3.7, 3.8, 3.75, 3.82, 3.79],
          backgroundColor: 'rgba(0, 255, 140, 0.7)'
        },
        {
          label: 'Forest Edge',
          data: [3.2, 3.1, 2.9, 2.7, 2.5],
          backgroundColor: 'rgba(0, 179, 255, 0.7)'
        },
        {
          label: 'Agricultural Boundary',
          data: [1.8, 1.6, 1.5, 1.3, 1.2],
          backgroundColor: 'rgba(255, 58, 94, 0.7)'
        }
      ]
    };
  }
  
  /**
   * Get land cover data for visualization
   * @returns {Object} - Chart.js compatible data object
   */
  getLandCoverData() {
    return {
      labels: ['Primary Forest', 'Secondary Forest', 'Grassland', 'Agriculture', 'Urban/Built-up', 'Water Bodies'],
      datasets: [
        {
          data: [32, 18, 15, 25, 7, 3],
          backgroundColor: [
            'rgba(0, 255, 140, 0.7)',
            'rgba(0, 230, 118, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(255, 152, 0, 0.7)',
            'rgba(255, 58, 94, 0.7)',
            'rgba(0, 179, 255, 0.7)'
          ],
          borderColor: [
            'rgba(0, 255, 140, 1)',
            'rgba(0, 230, 118, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(255, 58, 94, 1)',
            'rgba(0, 179, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }
  
  /**
   * Get species distribution data for visualization
   * @returns {Object} - Chart.js compatible data object
   */
  getSpeciesData() {
    return {
      labels: ['Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish', 'Insects', 'Plants'],
      datasets: [
        {
          label: '2020 Baseline',
          data: [65, 78, 52, 74, 46, 85, 92],
          backgroundColor: 'rgba(0, 179, 255, 0.2)',
          borderColor: 'rgba(0, 179, 255, 0.8)',
          pointBackgroundColor: 'rgba(0, 179, 255, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 179, 255, 1)'
        },
        {
          label: 'Current',
          data: [68, 73, 48, 62, 42, 76, 88],
          backgroundColor: 'rgba(0, 255, 140, 0.2)',
          borderColor: 'rgba(0, 255, 140, 0.8)',
          pointBackgroundColor: 'rgba(0, 255, 140, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 255, 140, 1)'
        }
      ]
    };
  }
}

// Initialize the trends preview when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  const trendsPreview = new TrendsPreview();
});
