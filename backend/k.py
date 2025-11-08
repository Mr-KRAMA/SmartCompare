import cloudscraper
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
import urllib.parse
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import diskcache as dc
import hashlib
import json
import re
import logging
from auth import UserCreate, UserLogin, register_user, login_user, verify_token

logging.basicConfig(level=logging.INFO)

cache = dc.Cache("./smartprix_cache")  # Folder to store cache files



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:9001"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.5",
    "Referer": "https://www.google.com/",
    "DNT": "1",
    "Upgrade-Insecure-Requests": "1",
}

scraper = cloudscraper.create_scraper()


def scrape_smartprix(query):
    try:
        # Sanitize query input
        query = re.sub(r'[^\w\s-]', '', query)[:100]
        url = f'https://www.smartprix.com/products/?q={urllib.parse.quote(query)}'
        response = scraper.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            logging.error(f"Failed to retrieve page: {response.status_code}")
            return {"error": f"Failed to retrieve page: {response.status_code}"}

        soup = BeautifulSoup(response.text, 'html.parser')
        products = soup.select('div.sm-product.has-tag.has-features.has-actions')
        results = []
    except Exception as e:
        logging.error(f"Error in scrape_smartprix: {str(e)}")
        return {"error": "Failed to scrape products"}

    for product in products[:10]:  # Limit to 10 products
        try:
            name_tag = product.select_one('a.name.clamp-2 h2')
            price_tag = product.select_one('span.price')
            img_tag = product.select_one('img.sm-img')

            name = name_tag.text.strip() if name_tag else "N/A"
            price = price_tag.text.strip() if price_tag else "N/A"
            img = img_tag['src'] if img_tag else "N/A"
            link = name_tag['href'] if name_tag else "N/A"

            results.append({
                'name': name,
                'price': price,
                'img': img,
                'link': link
            })
        except Exception as e:
            print(f"Error while scraping a product: {str(e)}")
            continue

    return results

def scrape_smartprix_product(url):
    try:
        # Sanitize URL input
        url = re.sub(r'[^\w\s\-/.]', '', url)[:200]
        full_url = f"https://www.smartprix.com/{url}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
            "Referer": "https://www.google.com/",
        }
        
        response = scraper.get(full_url, headers=headers, timeout=10)
        if response.status_code != 200:
            logging.error(f"Failed to fetch page: {response.status_code}")
            return {"error": "Failed to fetch page"}
        
        soup = BeautifulSoup(response.text, "html.parser")
    except Exception as e:
        logging.error(f"Error in scrape_smartprix_product: {str(e)}")
        return {"error": "Failed to scrape product details"}
    
    product_name = soup.select_one(".pg-prd-head h1")
    price = soup.select_one(".liner strong")
    
    features = [li.get_text(strip=True) for li in soup.select("ul.sm-feat li")]
    
    listings = []
    for store in soup.select("ul.sm-store-strip li"):
        name = store.select_one("a div.name span")
        url_to_store = store.select_one("a")
        img_url = store.select_one("a div.name img")
        store_price = store.select_one("a span.price")
        listings.append({
            "name": name.get_text(strip=True) if name else "N/A",
            "url": url_to_store['href'],
            "image": img_url["src"].strip() if img_url else "N/A",
            "price": store_price.get_text(strip=True) if store_price else "N/A"
        })
    
    detailed_listings = []
    for detail in soup.select("div.sm-box-item.sm-pc-item"):
        store_url = detail.select_one("a.logo")["href"]
        store_image = detail.select_one("a.logo img")
        store_price = detail.select_one("div.price")
        shipping_texts = [div.get_text(strip=True) for div in detail.select("div.shipping div")]
        detailed_listings.append({
            "store_url": store_url,
            "store_image": store_image["src"].strip() if store_image else "N/A",
            "price": store_price.get_text(strip=True) if store_price else "N/A",
            "shipping": shipping_texts
        })
    
    specifications = {}

    # Locate the specifications container
    specs_container = soup.select_one("div.sm-quick-specs")

    if specs_container:
        headings = specs_container.select("div.heading")
        groups = specs_container.select("ul.group")

        for i in range(min(len(headings), len(groups))):  # Ensuring proper pairing
            heading = headings[i].get_text(strip=True) or "Unknown"
            specs = [li.select_one("span").get_text(strip=True) for li in groups[i].select("li") if li.select_one("span")]

            specifications[heading] = specs
    carousel_images = [img["src"].strip() for img in soup.select("div.sm-swiper img.sm-img") if img.get("src")]
    
    return {
        "id": product_name.get_text(strip=True) if product_name else "N/A",
        "name": product_name.get_text(strip=True) if product_name else "N/A",
        "price": price.get_text(strip=True) if price else "N/A",
        "features": features,
        "listings": listings,
        "detailed_listings": detailed_listings,
        "specifications": specifications,
        "carousel_images": carousel_images
    }




def get_amazon_images(product_url):
    try:
        response = scraper.get(product_url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            logging.error(f"Failed to fetch Amazon images: {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        image_containers = soup.find_all('div', class_='a-section aok-relative s-image-fixed-height')

        img_urls = []
        for container in image_containers:
            img_tag = container.find('img', class_='s-image')
            if img_tag and 'src' in img_tag.attrs:
                img_urls.append(img_tag['src'])

        return img_urls
    except Exception as e:
        logging.error(f"Error fetching Amazon images: {str(e)}")
        return []


def init_driver():
    try:
        from selenium.webdriver.firefox.options import Options
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        driver = webdriver.Firefox(options=options)
        return driver
    except Exception as e:
        logging.error(f"Failed to initialize driver: {str(e)}")
        raise HTTPException(status_code=500, detail="Browser driver initialization failed")

def cache_key(query, isCompare):
    # Use SHA-256 instead of MD5 for better security
    key_raw = f"{query.lower()}|compare={isCompare}"
    return hashlib.sha256(key_raw.encode()).hexdigest()

def scrape_search_cached(query, isCompare=False):
    key = cache_key(query, isCompare)

    if key in cache:
        print("Cache hit")
        return cache[key]

    print("Cache miss - scraping now")
    data = scrape_search(query, isCompare)
    cache.set(key, data, expire=3600)  # Cache for 1 hour
    return data



def scrape_search(query, isCompare=False):
    driver = None
    try:
        # Sanitize query input
        query = re.sub(r'[^\w\s-]', '', query)[:100]
        driver = init_driver()
        encoded_url = urllib.parse.quote(query)
        driver.get(f'https://www.smartprix.com/products/?q={encoded_url}')

        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.sm-product.has-tag.has-features.has-actions')))

        products = driver.find_elements(By.CSS_SELECTOR, 'div.sm-product.has-tag.has-features.has-actions')
        results = []
        logging.info(f"Number of products found: {len(products)}")
        
        limit_product = 40 if not isCompare else 20

        for product in products[:limit_product]:  
            try:
                name = product.find_element(By.CSS_SELECTOR, 'a.name.clamp-2').text
                price = product.find_element(By.CSS_SELECTOR, 'span.price').text
                img = product.find_element(By.CSS_SELECTOR, 'img.sm-img').get_attribute('src')
                link = product.find_element(By.CSS_SELECTOR, 'a.name.clamp-2').get_attribute('href')
                results.append({
                    'id': name,
                    'name': name,
                    'price': price,
                    'img': img,
                    'link': link
                })
            except Exception as e:
                logging.error(f"Error while scraping a product: {str(e)}")
                continue

        return results
    except Exception as e:
        logging.error(f"Failed to retrieve details from Smartprix: {str(e)}")
        return []
    finally:
        if driver:
            driver.quit()



@app.get("/scrape/{query}")
async def get_products(query: str):
    try:
        if not query or len(query.strip()) == 0:
            raise HTTPException(status_code=400, detail="Query parameter is required")
        products = scrape_smartprix(query)
        return products
    except Exception as e:
        logging.error(f"Error in get_products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")


@app.get("/details/{link:path}")
async def get_details(link: str):
    try:
        if not link or len(link.strip()) == 0:
            raise HTTPException(status_code=400, detail="Link parameter is required")
        
        products = scrape_smartprix_product(link)
        if "error" in products:
            raise HTTPException(status_code=404, detail=products["error"])
            
        search_query = link.split('/')[-1]
        url = f"https://www.amazon.in/s?k={search_query.replace(' ', '+')}"
        image_urls = get_amazon_images(url)

        products["image_urls"] = image_urls
        return JSONResponse(content=products)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error in get_details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch product details")


@app.get("/search/{query}")
def search(query: str, isCompare: bool = False):
    try:
        if not query or len(query.strip()) == 0:
            raise HTTPException(status_code=400, detail="Query parameter is required")
        return scrape_search_cached(query, isCompare)
    except Exception as e:
        logging.error(f"Error in search: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to search products")

# @app.get("/search/{query}")
# async def get_search_products(query: str):
#     products = scrape_search(query)
#     return products


@app.get("/img/{query}")
async def get_image(query: str):
    try:
        if not query or len(query.strip()) == 0:
            raise HTTPException(status_code=400, detail="Query parameter is required")
        
        # Sanitize query
        q = re.sub(r'[^\w\s-]', '', query).replace(" ", "+")
        url = f'https://www.amazon.in/s?k={q}'
        img_urls = get_amazon_images(url)
        return JSONResponse(content=img_urls)
    except Exception as e:
        logging.error(f"Error in get_image: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch images")

# Authentication endpoints
@app.post("/auth/register")
async def register(user: UserCreate):
    return register_user(user)

@app.post("/auth/login")
async def login(user: UserLogin):
    return login_user(user)

@app.get("/auth/me")
async def get_current_user(current_user: str = verify_token):
    return {"email": current_user}
