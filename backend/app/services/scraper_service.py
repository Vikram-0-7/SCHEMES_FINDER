import asyncio
# from ddgs import DDGS
from duckduckgo_search import DDGS
import httpx
from bs4 import BeautifulSoup
import re

async def fetch_page_text(url: str) -> str:
    """Fetch and extract readable text from a URL."""
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            # Set a common user agent to avoid basic blocks
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.extract()
                
            text = soup.get_text(separator=' ', strip=True)
            # Basic cleanup: remove multiple spaces
            text = re.sub(r'\s+', ' ', text)
            
            # Return first 3000 chars to avoid overloading LLM token limits
            return text[:3000]
    except Exception as e:
        print(f"Failed to scrape {url}: {e}")
        return ""

async def search_and_scrape_schemes(query: str, max_results: int = 5) -> str:
    """
    Search DDG for the query, fetch top URLs, and return combined extracted text.
    Target public government websites.
    """
    try:
        # Append site:gov.in to ensure we only scrape public government websites
        gov_query = f"{query} site:gov.in"
        
        # Synchronous search via DDGS
        with DDGS() as ddgs:
            # DDGS text search
            search_results = list(ddgs.text(gov_query, max_results=max_results))
            
        urls_to_scrape = [res['href'] for res in search_results if 'href' in res]
        print(f"Found URLs for '{gov_query}': {urls_to_scrape}")
        
        # Concurrently scrape the URLs
        tasks = [fetch_page_text(url) for url in urls_to_scrape]
        scraped_texts = await asyncio.gather(*tasks)
        
        combined_text = ""
        for i, text in enumerate(scraped_texts):
            if text:
                combined_text += f"\n--- Source {i+1}: {urls_to_scrape[i]} ---\n{text}\n"
                
        return combined_text
    except Exception as e:
        print(f"Search/Scrape error: {e}")
        return ""
