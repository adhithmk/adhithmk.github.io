import os
import sys

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from app.api.papers import fetch_papers
from app.api.social_media import fetch_tweets, fetch_bluesky
from app.utils.summarization import summarize_text
from typing import List, Optional
from datetime import datetime
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Ecological Informatics API",
    description="API for managing ecological informatics data and content",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Ecological Informatics API"}


@app.get("/fetch-papers")
async def get_papers(
    query: str = Query(..., description="Search query for papers"),
    max_results: int = Query(5, description="Maximum number of papers to return")
):
    try:
        logger.info(f"Fetching papers for query: {query}")
        papers = await fetch_papers(query, max_results)
        
        # Add summaries to papers
        for paper in papers:
            if paper.get("abstract"):
                paper["summary"] = summarize_text(paper["abstract"])
            else:
                paper["summary"] = "No abstract available for summarization."
                
        return {"papers": papers}
    except Exception as e:
        logger.error(f"Error fetching papers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/fetch-tweets")
async def get_tweets(
    query: str = Query(..., description="Search query for tweets"),
    max_results: int = Query(10, description="Maximum number of tweets to return")
):
    try:
        logger.info(f"Fetching tweets for query: {query}")
        tweets = await fetch_tweets(query, max_results)
        
        # Add summaries to tweets if they're long enough
        for tweet in tweets:
            if len(tweet.get("text", "")) > 100:  # Only summarize longer tweets
                tweet["summary"] = summarize_text(tweet["text"])
            else:
                tweet["summary"] = tweet.get("text", "")
                
        return {"tweets": tweets}
    except Exception as e:
        logger.error(f"Error fetching tweets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/fetch-bluesky")
async def get_bluesky_posts(
    query: str = Query(..., description="Search query for Bluesky"),
    max_results: int = Query(10, description="Maximum number of posts to return")
):
    try:
        logger.info(f"Fetching Bluesky posts for query: {query}")
        # Note: This is a stub - Bluesky API may require registration and might be experimental
        posts = await fetch_bluesky(query, max_results)
        return {"posts": posts}
    except Exception as e:
        logger.error(f"Error fetching Bluesky posts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/fetch-data")
async def get_all_data(
    query: str = Query(..., description="Search query"),
    max_papers: int = Query(5, description="Maximum number of papers"),
    max_tweets: int = Query(10, description="Maximum number of tweets"),
    max_bluesky: int = Query(0, description="Maximum number of Bluesky posts")
):
    try:
        logger.info(f"Fetching all data for query: {query}")
        
        # Fetch data from all sources
        papers_data = await get_papers(query=query, max_results=max_papers)
        tweets_data = await get_tweets(query=query, max_results=max_tweets)
        
        # Only fetch Bluesky data if requested
        bluesky_data = {"posts": []}
        if max_bluesky > 0:
            bluesky_data = await get_bluesky_posts(query=query, max_results=max_bluesky)
        
        # Combine all results
        all_data = {
            "query": query,
            "timestamp": datetime.now().isoformat(),
            "papers": papers_data.get("papers", []),
            "tweets": tweets_data.get("tweets", []),
            "bluesky_posts": bluesky_data.get("posts", [])
        }
        
        return all_data
    except Exception as e:
        logger.error(f"Error fetching all data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include routes
from app.routes import blog, profile, research, certification, field_experience

app.include_router(profile.router, prefix="/profile", tags=["profile"])
app.include_router(research.router, prefix="/research", tags=["research"])
app.include_router(certification.router, prefix="/certifications", tags=["certifications"])
app.include_router(field_experience.router, prefix="/field-experiences", tags=["field-experiences"])
app.include_router(blog.router, prefix="/blog", tags=["blog"])


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
