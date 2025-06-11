import arxiv
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

async def fetch_papers(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """
    Fetch papers from arXiv based on a query
    
    Args:
        query: Search query string
        max_results: Maximum number of results to return
        
    Returns:
        List of paper dictionaries with metadata
    """
    try:
        logger.info(f"Fetching papers from arXiv with query: {query}, max_results: {max_results}")
        
        # Configure arXiv client
        client = arxiv.Client()
        
        # Create a search query
        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.SubmittedDate
        )
        
        # Execute the search and get results
        results = list(client.results(search))
        
        # Format the results
        papers = []
        for paper in results:
            papers.append({
                "title": paper.title,
                "authors": ", ".join([author.name for author in paper.authors]),
                "abstract": paper.summary,
                "pdf_url": paper.pdf_url,
                "published": paper.published.isoformat() if paper.published else None,
                "updated": paper.updated.isoformat() if paper.updated else None,
                "categories": paper.categories,
                "source": "arXiv",
                "id": paper.entry_id,
                "url": paper.entry_id
            })
        
        return papers
    except Exception as e:
        logger.error(f"Error fetching papers from arXiv: {str(e)}")
        raise


async def fetch_additional_papers(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """
    Placeholder for fetching papers from additional sources like Google Scholar, Scopus, etc.
    Note: Many academic APIs require institutional access or API keys
    
    Args:
        query: Search query string
        max_results: Maximum number of results to return
        
    Returns:
        List of paper dictionaries with metadata
    """
    # This is a stub function - implementation would depend on available APIs
    logger.info("fetch_additional_papers is a stub function")
    return []
