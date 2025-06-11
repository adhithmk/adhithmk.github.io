from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

# Initialize the summarization pipeline (this will download the model on first run)
summarizer = None

def initialize_summarizer():
    """
    Initialize the summarization model using transformers pipeline.
    This is separated to allow lazy loading.
    """
    global summarizer
    try:
        if summarizer is None:
            logger.info("Initializing summarization model")
            summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
            logger.info("Summarization model initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing summarization model: {str(e)}")
        raise


def summarize_text(text: str, max_length: int = 150, min_length: int = 40) -> str:
    """
    Summarize the input text using a pre-trained model
    
    Args:
        text: Text to summarize
        max_length: Maximum length of the summary
        min_length: Minimum length of the summary
        
    Returns:
        Summarized text
    """
    try:
        # Initialize the summarizer if not already done
        if summarizer is None:
            initialize_summarizer()
        
        # Check if the text is long enough to summarize
        if len(text.split()) < min_length:
            logger.info(f"Text too short for summarization ({len(text.split())} words). Returning original.")
            return text
        
        # Truncate text if it's extremely long (transformer models have input limits)
        max_input_length = 1024  # Adjust based on model requirements
        truncated_text = " ".join(text.split()[0:max_input_length]) if len(text.split()) > max_input_length else text
        
        # Generate summary
        summary = summarizer(truncated_text, max_length=max_length, min_length=min_length, do_sample=False)
        
        # Return the summary text
        if summary and len(summary) > 0:
            return summary[0]['summary_text']
        else:
            return "Failed to generate summary."
            
    except Exception as e:
        logger.error(f"Error during summarization: {str(e)}")
        # Return a portion of the original text if summarization fails
        words = text.split()
        if len(words) > 50:
            return " ".join(words[:50]) + "..."
        return text
