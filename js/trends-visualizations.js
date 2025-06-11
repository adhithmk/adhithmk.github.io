/**
 * Ecological Trends Visualizations
 * This script handles the interactive data visualizations on the trends page
 */

class TrendsVisualizations {
  constructor() {
    // DOM elements
    this.vizCanvas = document.getElementById('visualization-canvas');
    this.vizTypeSelector = document.getElementById('viz-type-selector');
    this.timeRangeSelector = document.getElementById('time-range');
    this.refreshButton = document.getElementById('refresh-viz');
    this.insightCards = document.querySelectorAll('.insight-card');
    this.loadingIndicator = document.querySelector('.viz-loading');
    
    // Chart instance
    this.chart = null;
    
    // Current visualization state
    this.currentVizType = 'temperature';
    this.currentTimeRange = '5years';
    
    // Sample data for visualizations
    this.sampleData = {
      temperature: this.generateTemperatureData(),
      biodiversity: this.generateBiodiversityData(),
      landcover: this.generateLandCoverData(),
      species: this.generateSpeciesData()
    };
    
    // Initialize the visualization
    this.init();
  }
  
  /**
   * Initialize the visualization component
   */
  init() {
    // Check if we're on the trends page
    if (!this.vizCanvas) return;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load initial visualization
    this.loadVisualization(this.currentVizType, this.currentTimeRange);
  }
  
  /**
   * Set up event listeners for the visualization controls
   */
  setupEventListeners() {
    // Visualization type change
    if (this.vizTypeSelector) {
      this.vizTypeSelector.addEventListener('change', (e) => {
        this.currentVizType = e.target.value;
        this.loadVisualization(this.currentVizType, this.currentTimeRange);
        this.updateInsightCard(this.currentVizType);
      });
    }
    
    // Time range change
    if (this.timeRangeSelector) {
      this.timeRangeSelector.addEventListener('change', (e) => {
        this.currentTimeRange = e.target.value;
        this.loadVisualization(this.currentVizType, this.currentTimeRange);
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
   * Show the loading indicator
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
   * Hide the loading indicator
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
    const selectedCard = document.querySelector(`.insight-card[data-viz="${vizType}"]`);
    if (selectedCard) {
      selectedCard.classList.add('active');
    }
  }
  
  /**
   * Load a visualization based on type and time range
   * @param {string} vizType - The visualization type
   * @param {string} timeRange - The time range
   */
  loadVisualization(vizType, timeRange) {
    // Show loading indicator
    this.showLoading();
    
    // Simulate loading delay
    setTimeout(() => {
      // Get data for the selected visualization type and time range
      const data = this.getVisualizationData(vizType, timeRange);
      
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
    // Show loading indicator
    this.showLoading();
    
    // Simulate data refresh
    setTimeout(() => {
      // Regenerate data for the current visualization type
      this.sampleData[this.currentVizType] = this[`generate${this.capitalizeFirstLetter(this.currentVizType)}Data`]();
      
      // Get the refreshed data
      const data = this.getVisualizationData(this.currentVizType, this.currentTimeRange);
      
      // Update the chart
      this.createChart(this.currentVizType, data);
      
      // Hide loading indicator
      this.hideLoading();
    }, 1200);
  }
  
  /**
   * Get data for a specific visualization type and time range
   * @param {string} vizType - The visualization type
   * @param {string} timeRange - The time range
   * @returns {Object} - The data for the visualization
   */
  getVisualizationData(vizType, timeRange) {
    // Get the full dataset for the visualization type
    const fullData = this.sampleData[vizType];
    
    // Filter data based on time range
    let filteredData = { ...fullData };
    
    // Apply time range filtering
    if (timeRange === '1year') {
      // Last 12 months of data
      filteredData.labels = fullData.labels.slice(-12);
      filteredData.datasets.forEach(dataset => {
        dataset.data = dataset.data.slice(-12);
      });
    } else if (timeRange === '5years') {
      // Last 5 years (60 months) of data
      filteredData.labels = fullData.labels.slice(-60);
      filteredData.datasets.forEach(dataset => {
        dataset.data = dataset.data.slice(-60);
      });
    } else if (timeRange === '10years') {
      // Last 10 years (120 months) of data
      filteredData.labels = fullData.labels.slice(-120);
      filteredData.datasets.forEach(dataset => {
        dataset.data = dataset.data.slice(-120);
      });
    }
    // 'all' time range uses the full dataset
    
    return filteredData;
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
          text: 'Temperature (°C)',
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
   * Generate sample temperature data
   * @returns {Object} - Chart.js compatible data object
   */
  generateTemperatureData() {
    const years = 10; // 10 years of data
    const months = years * 12;
    const labels = [];
    
    // Generate labels for the past 10 years by month
    const today = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      labels.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
    }
    
    // Generate temperature data with seasonal patterns and slight upward trend
    const avgTemps = [];
    const minTemps = [];
    const maxTemps = [];
    
    for (let i = 0; i < months; i++) {
      // Base temperature with seasonal variation (higher in summer, lower in winter)
      const monthInYear = i % 12;
      const seasonalOffset = Math.sin((monthInYear / 12) * Math.PI * 2) * 10;
      
      // Add slight upward trend (climate warming)
      const yearTrend = (i / months) * 2;
      
      // Add some random variation
      const randomVariation = (Math.random() - 0.5) * 3;
      
      // Calculate average temperature
      const avgTemp = 15 + seasonalOffset + yearTrend + randomVariation;
      avgTemps.push(avgTemp.toFixed(1));
      
      // Calculate min and max temperatures
      minTemps.push((avgTemp - 5 - Math.random() * 2).toFixed(1));
      maxTemps.push((avgTemp + 5 + Math.random() * 3).toFixed(1));
    }
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Average Temperature',
          data: avgTemps,
          borderColor: '#00ff8c',
          backgroundColor: 'rgba(0, 255, 140, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: false
        },
        {
          label: 'Maximum Temperature',
          data: maxTemps,
          borderColor: '#ff3a5e',
          backgroundColor: 'rgba(255, 58, 94, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          fill: false
        },
        {
          label: 'Minimum Temperature',
          data: minTemps,
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
   * Generate sample biodiversity data
   * @returns {Object} - Chart.js compatible data object
   */
  generateBiodiversityData() {
    const years = 5; // 5 years of data
    const labels = [];
    
    // Generate labels for the past 5 years
    const today = new Date();
    for (let i = years - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setFullYear(today.getFullYear() - i);
      labels.push(date.getFullYear().toString());
    }
    
    // Generate biodiversity index data for different habitat types
    return {
      labels: labels,
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
        },
        {
          label: 'Restoration Sites',
          data: [1.2, 1.5, 1.9, 2.3, 2.6],
          backgroundColor: 'rgba(255, 193, 7, 0.7)'
        }
      ]
    };
  }
  
  /**
   * Generate sample land cover data
   * @returns {Object} - Chart.js compatible data object
   */
  generateLandCoverData() {
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
   * Generate sample species distribution data
   * @returns {Object} - Chart.js compatible data object
   */
  generateSpeciesData() {
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
  
  /**
   * Capitalize the first letter of a string
   * @param {string} string - The string to capitalize
   * @returns {string} - The capitalized string
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Initialize the trends visualizations when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  const trendsViz = new TrendsVisualizations();
});
