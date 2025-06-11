import tweepy
import os
import logging
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Get Twitter API credentials from environment variables
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
TWITTER_ACCESS_SECRET = os.getenv("TWITTER_ACCESS_SECRET")
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")

async def fetch_tweets(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Fetch tweets related to a query using Twitter API v2
    
    Args:
        query: Search query string
        max_results: Maximum number of tweets to return
        
    Returns:
        List of tweet dictionaries with metadata
    """
    try:
        logger.info(f"Fetching tweets with query: {query}, max_results: {max_results}")
        
        # Check if Twitter API credentials are available
        if not TWITTER_BEARER_TOKEN:
            logger.warning("Twitter API credentials not found. Using mock data.")
            return _mock_tweets(query, max_results)
        
        # Initialize Twitter client
        client = tweepy.Client(
            bearer_token=TWITTER_BEARER_TOKEN,
            consumer_key=TWITTER_API_KEY,
            consumer_secret=TWITTER_API_SECRET,
            access_token=TWITTER_ACCESS_TOKEN,
            access_token_secret=TWITTER_ACCESS_SECRET
        )
        
        # Search tweets
        tweets = client.search_recent_tweets(
            query=query,
            max_results=max_results,
            tweet_fields=["created_at", "author_id", "public_metrics", "source"]
        )
        
        # Format the results
        tweet_list = []
        if tweets and tweets.data:
            for tweet in tweets.data:
                tweet_list.append({
                    "id": tweet.id,
                    "text": tweet.text,
                    "created_at": tweet.created_at.isoformat() if tweet.created_at else None,
                    "author_id": tweet.author_id,
                    "likes": tweet.public_metrics.get("like_count", 0) if tweet.public_metrics else 0,
                    "retweets": tweet.public_metrics.get("retweet_count", 0) if tweet.public_metrics else 0,
                    "source": "Twitter",
                    "url": f"https://twitter.com/twitter/status/{tweet.id}"
                })
        
        return tweet_list
    except Exception as e:
        logger.error(f"Error fetching tweets: {str(e)}")
        # Fall back to mock data if there's an error
        return _mock_tweets(query, max_results)


async def fetch_bluesky(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Stub function for fetching posts from Bluesky
    Note: Bluesky's API might be experimental and may require registration and personal API keys
    
    Args:
        query: Search query string
        max_results: Maximum number of posts to return
        
    Returns:
        List of post dictionaries with metadata
    """
    # This is a stub function as Bluesky API might be experimental
    logger.info(f"Attempting to fetch Bluesky posts (stub function) for query: {query}")
    return _mock_bluesky_posts(query, max_results)


def _mock_tweets(query: str, count: int = 10) -> List[Dict[str, Any]]:
    """
    Generate mock tweet data for development and testing
    
    Args:
        query: Search query string used to theme the mock data
        count: Number of mock tweets to generate
        
    Returns:
        List of mock tweet dictionaries
    """
    import random
    from datetime import datetime, timedelta
    
    topics = {
        "ecological informatics": [
            "Exciting new paper on ecological data science just published #EcologicalInformatics",
            "Using big data to understand biodiversity patterns across landscapes #EcoInformatics",
            "Workshop on ecological informatics next month - registration open now!",
            "New R package for analyzing ecological time series data released today"
        ],
        "AI in ecology": [
            "Our new deep learning model can identify bird species from audio with 98% accuracy #AIEcology",
            "Using neural networks to predict species distributions under climate change scenarios",
            "Can machine learning help us detect early warning signals of ecosystem collapse? New study suggests yes.",
            "Artificial intelligence is revolutionizing how we monitor ecosystem health #AI #Ecology"
        ],
        "IT in conservation": [
            "New mobile app helps ranger teams track wildlife poaching in real-time #ConservationTech",
            "Blockchain technology being used to ensure transparency in carbon credit market #ITConservation",
            "Using IoT sensors to monitor forest health remotely - our latest conservation tech",
            "Cloud computing enables unprecedented environmental analysis for conservation planning"
        ]
    }
    
    # Default to general ecological informatics if query doesn't match
    selected_topic = "ecological informatics"
    for topic in topics.keys():
        if topic.lower() in query.lower():
            selected_topic = topic
    
    mock_tweets = []
    for i in range(count):
        # Pick a random template text and add some variation
        template = random.choice(topics[selected_topic])
        text = f"{template} {random.choice(['👍', '🌍', '🔬', '📊', '💻', '🌱', '🦉', '🌲', ''])}" 
        
        # Generate a random date within the last month
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 24)
        created_at = (datetime.now() - timedelta(days=days_ago, hours=hours_ago)).isoformat()
        
        mock_tweets.append({
            "id": f"mock_{i}_{random.randint(10000000, 99999999)}",
            "text": text,
            "created_at": created_at,
            "author_id": f"user_{random.randint(1000, 9999)}",
            "author_name": random.choice(["EcoScientist", "DataEcologist", "ConservationTech", "BiodiversityAI", "EarthDataLab"]),
            "likes": random.randint(5, 500),
            "retweets": random.randint(1, 100),
            "source": "Twitter (Mock)",
            "url": "https://twitter.com/"
        })
    
    return mock_tweets


def _mock_bluesky_posts(query: str, count: int = 10) -> List[Dict[str, Any]]:
    """
    Generate mock Bluesky post data for development and testing
    
    Args:
        query: Search query string used to theme the mock data
        count: Number of mock posts to generate
        
    Returns:
        List of mock post dictionaries
    """
    import random
    from datetime import datetime, timedelta
    
    topics = {
        "ecological informatics": [
            "Just published our ecological informatics research on biodiversity monitoring using sensor networks",
            "Ecological data science is evolving rapidly - new methods paper out today",
            "Thinking about the future of ecological informatics and how we analyze complex ecosystems",
            "Environmental databases need better standards - thoughts on our latest eco-informatics work"
        ],
        "AI in ecology": [
            "Using computer vision to track animal movements across landscapes - new preprint available",
            "Our lab is applying deep learning to classify habitat types from satellite imagery",
            "Can AI help us understand ecosystem dynamics? My thoughts on our latest ecological modeling work",
            "Machine learning application for predicting invasive species spread - new tool released"
        ],
        "IT in conservation": [
            "Digital twins for entire ecosystems - the future of conservation planning",
            "Our new conservation tech guides for field researchers are available for download",
            "Using distributed ledgers to verify sustainable supply chains in conservation",
            "Data visualization techniques for communicating conservation priorities to stakeholders"
        ]
    }
    
    # Default to general ecological informatics if query doesn't match
    selected_topic = "ecological informatics"
    for topic in topics.keys():
        if topic.lower() in query.lower():
            selected_topic = topic
    
    mock_posts = []
    for i in range(count):
        # Pick a random template text and add some variation
        text = random.choice(topics[selected_topic])
        
        # Generate a random date within the last month
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 24)
        created_at = (datetime.now() - timedelta(days=days_ago, hours=hours_ago)).isoformat()
        
        mock_posts.append({
            "id": f"bsky_{i}_{random.randint(10000000, 99999999)}",
            "text": text,
            "created_at": created_at,
            "author": random.choice(["eco.researcher.bsky.social", "data.ecologist.bsky.social", "conservation.tech.bsky.social"]),
            "likes": random.randint(5, 200),
            "reposts": random.randint(1, 50),
            "source": "Bluesky (Mock)",
            "url": "https://bsky.app/"
        })
    
    return mock_posts
