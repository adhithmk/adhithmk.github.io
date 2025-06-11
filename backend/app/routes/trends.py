from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.utils.trends import fetch_trends

router = APIRouter()

@router.get("/fetch-data")
async def fetch_trends_data(
    query: str = "ecological informatics",
    max_papers: int = 5,
    max_tweets: int = 5,
    max_bluesky: int = 0
):
    """
    Fetch the latest trends data from various sources
    
    Args:
        query: Search query
        max_papers: Maximum number of academic papers to fetch
        max_tweets: Maximum number of tweets to fetch
        max_bluesky: Maximum number of Bluesky posts to fetch
    
    Returns:
        dict: Combined trends data
    """
    try:
        # Fetch data from different sources
        data = fetch_trends(query, max_papers, max_tweets, max_bluesky)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
