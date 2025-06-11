# Ecological Informatics Trend Aggregator Backend

This Python backend application aggregates and summarizes the latest trends in ecological informatics, AI in ecology, and IT in conservation from multiple sources including research papers and social media.

## Features

- **Data Collection from Multiple Sources**
  - Academic papers from arXiv
  - Social media data from Twitter (requires API keys)
  - Placeholder for Bluesky integration (API experimental)

- **Content Summarization**
  - Uses Hugging Face Transformers to generate concise summaries of abstracts and posts
  - Configurable summary length

- **REST API Endpoints**
  - `/fetch-papers`: Get the latest research papers based on a query
  - `/fetch-tweets`: Get tweets related to a query
  - `/fetch-bluesky`: Placeholder for Bluesky posts
  - `/fetch-data`: Combined endpoint to get data from all sources

## Installation

### Prerequisites

- Python 3.8 or higher
- Virtual environment (recommended)

### Setup

1. Clone the repository or navigate to your project directory

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Unix/MacOS
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys for Twitter (optional)

## Usage

### Running the API Server

```bash
python -m app.main
```

Or use uvicorn directly:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Example API Calls

#### Fetch Papers

```
GET /fetch-papers?query=ecological%20informatics&max_results=5
```

#### Fetch Tweets

```
GET /fetch-tweets?query=AI%20in%20ecology&max_results=10
```

#### Fetch All Data

```
GET /fetch-data?query=conservation%20technology&max_papers=5&max_tweets=10&max_bluesky=0
```

## Integration with Frontend

The backend API is designed to work with a web frontend. To connect it with your website:

1. Update your JavaScript code to call the API endpoints
2. Parse the JSON responses and render the data in your UI
3. Add CORS settings in the backend if needed for your domain

### JavaScript Example

```javascript
async function fetchTrends(query) {
  try {
    const response = await fetch(`http://localhost:8000/fetch-data?query=${encodeURIComponent(query)}&max_papers=5&max_tweets=10`);
    const data = await response.json();
    
    // Process and display the results
    displayTrends(data);
  } catch (error) {
    console.error('Error fetching trends:', error);
  }
}
```

## Notes

- The Transformers library will download model files on first run (approx. 1.5GB)
- Twitter API access requires developer credentials
- Bluesky API is currently a stub implementation

## Future Enhancements

- Add more academic sources beyond arXiv
- Implement proper Bluesky integration when API stabilizes
- Add more sophisticated filtering and categorization of results
- Add caching to improve performance and reduce API calls
