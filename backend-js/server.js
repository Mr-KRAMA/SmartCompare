import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Builder } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js';
import NodeCache from 'node-cache';

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:9001'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/smartprix_db')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('💡 Make sure MongoDB is running on localhost:27017');
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-this';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Scraping functions
const scrapeSmartprix = async (query) => {
  try {
    const sanitizedQuery = query.replace(/[^\w\s-]/g, '').substring(0, 100);
    const url = `https://www.smartprix.com/products/?q=${encodeURIComponent(sanitizedQuery)}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const products = [];

    $('div.sm-product.has-tag.has-features.has-actions').slice(0, 10).each((i, element) => {
      try {
        const name = $(element).find('a.name.clamp-2 h2').text().trim() || 'N/A';
        const price = $(element).find('span.price').text().trim() || 'N/A';
        const img = $(element).find('img.sm-img').attr('src') || 'N/A';
        const link = $(element).find('a.name.clamp-2').attr('href') || 'N/A';

        products.push({ name, price, img, link });
      } catch (err) {
        console.error('Error scraping product:', err);
      }
    });

    return products;
  } catch (error) {
    console.error('Scraping error:', error);
    return { error: 'Failed to scrape products' };
  }
};

const scrapeProductDetails = async (url) => {
  try {
    const sanitizedUrl = url.replace(/[^\w\s\-/.]/g, '').substring(0, 200);
    const fullUrl = `https://www.smartprix.com/${sanitizedUrl}`;
    
    const response = await axios.get(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
        'Referer': 'https://www.google.com/',
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    const productName = $('.pg-prd-head h1').text().trim() || 'N/A';
    const price = $('.liner strong').text().trim() || 'N/A';
    const features = [];
    
    $('ul.sm-feat li').each((i, el) => {
      features.push($(el).text().trim());
    });

    const specifications = {};
    $('.sm-quick-specs .heading').each((i, el) => {
      const heading = $(el).text().trim() || 'Unknown';
      const specs = [];
      $(el).next('ul.group').find('li span').each((j, span) => {
        specs.push($(span).text().trim());
      });
      specifications[heading] = specs;
    });

    const carouselImages = [];
    $('div.sm-swiper img.sm-img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http')) {
        carouselImages.push(src);
      }
    });

    return {
      id: productName,
      name: productName,
      price,
      features,
      specifications,
      carousel_images: carouselImages,
      listings: [],
      detailed_listings: []
    };
  } catch (error) {
    console.error('Product details error:', error);
    return { error: 'Failed to scrape product details' };
  }
};

const scrapeWithSelenium = async (query, isCompare = false) => {
  let driver;
  try {
    const sanitizedQuery = query.replace(/[^\w\s-]/g, '').substring(0, 100);
    const options = new firefox.Options();
    options.addArguments('--headless');
    
    driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();

    await driver.get(`https://www.smartprix.com/products/?q=${encodeURIComponent(sanitizedQuery)}`);
    
    const products = await driver.executeScript(() => {
      const elements = document.querySelectorAll('div.sm-product.has-tag.has-features.has-actions');
      const results = [];
      
      for (let i = 0; i < Math.min(elements.length, 40); i++) {
        try {
          const element = elements[i];
          const name = element.querySelector('a.name.clamp-2')?.textContent || '';
          const price = element.querySelector('span.price')?.textContent || '';
          const img = element.querySelector('img.sm-img')?.src || '';
          const link = element.querySelector('a.name.clamp-2')?.href || '';
          
          results.push({ id: name, name, price, img, link });
        } catch (err) {
          console.error('Error processing element:', err);
        }
      }
      
      return results;
    });

    return products;
  } catch (error) {
    console.error('Selenium error:', error);
    return [];
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
};

// Routes
app.post('/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ detail: 'All fields are required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({ detail: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    console.log('✅ User registered successfully:', email);

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '30m' });
    
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: { name, email }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ detail: 'Registration failed: ' + error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ detail: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ detail: 'Invalid credentials' });
    }
    
    console.log('✅ Login successful:', email);

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '30m' });
    
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ detail: 'Login failed: ' + error.message });
  }
});

app.get('/scrape/:query', async (req, res) => {
  try {
    const { query } = req.params;
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const products = await scrapeSmartprix(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/details/:catId/:id', async (req, res) => {
  try {
    const { catId, id } = req.params;
    if (!catId?.trim() || !id?.trim()) {
      return res.status(400).json({ error: 'Parameters are required' });
    }
    
    const link = `${catId}/${id}`;
    const products = await scrapeProductDetails(link);
    
    if (products.error) {
      return res.status(404).json(products);
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

app.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { isCompare } = req.query;
    
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const cacheKey = `${query.toLowerCase()}|compare=${isCompare || false}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }
    
    const products = await scrapeWithSelenium(query, isCompare === 'true');
    cache.set(cacheKey, products);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});