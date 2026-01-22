import { JSDOM } from 'jsdom';
import mongoose from 'mongoose';
import Product from '../models/Product';
import connectToDatabase from '../lib/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SLEEP_MS = 2000; // Be polite to the server
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeProductPage(url: string, brandName: string) {
    console.log(`Scraping product: ${url}`);
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // 1. Basic Info
    const name = doc.querySelector('h1.product_title')?.textContent?.trim() || '';

    // Price extraction logic
    let price = 0;
    const gtmData = doc.querySelector('.gtm4wp_productdata')?.getAttribute('data-gtm4wp_product_data');
    if (gtmData) {
        try {
            const parsed = JSON.parse(gtmData);
            price = parsed.price || 0;
        } catch (e) { }
    }

    if (!price) {
        const priceText = doc.querySelector('.summary .price .woocommerce-Price-amount bdi')?.textContent?.replace(/[^0-9]/g, '') ||
            doc.querySelector('.summary .price ins .woocommerce-Price-amount bdi')?.textContent?.replace(/[^0-9]/g, '') ||
            '0';
        price = parseInt(priceText);
    }

    // 2. Images
    const imageUrls: string[] = [];
    doc.querySelectorAll('.woocommerce-product-gallery__image img').forEach(img => {
        const src = img.getAttribute('data-large_image') || img.getAttribute('src');
        if (src && !imageUrls.includes(src)) imageUrls.push(src);
    });

    // 3. Key Features (from summary list)
    const features: Record<string, string> = {};
    doc.querySelectorAll('.summary ul li').forEach(li => {
        const text = li.textContent?.trim();
        if (text && text.includes(':')) {
            const [key, ...valParts] = text.split(':');
            features[key.trim()] = valParts.join(':').trim();
        }
    });

    // 4. Technical Specifications
    const specifications: Record<string, string> = {};
    const content = doc.querySelector('.entry-content');

    // Often specs are in lists following headers
    if (content) {
        let currentSection = 'General';
        content.childNodes.forEach(node => {
            const el = node as HTMLElement;
            if (['H2', 'H3', 'H4'].includes(el.tagName)) {
                currentSection = el.textContent?.trim() || currentSection;
            } else if (el.tagName === 'UL') {
                el.querySelectorAll('li').forEach(li => {
                    const text = li.textContent?.trim();
                    if (text && text.includes(':')) {
                        const [key, ...valParts] = text.split(':');
                        specifications[`${currentSection} - ${key.trim()}`] = valParts.join(':').trim();
                    }
                });
            }
        });
    }

    return {
        name,
        brand: brandName,
        price,
        description: doc.querySelector('.woocommerce-product-details__short-description')?.textContent?.trim() || name,
        category: 'Phones',
        imageUrl: imageUrls[0] || '',
        images: imageUrls,
        features,
        specifications,
        status: 'published',
        stock: 10 // Default stock
    };
}

async function startScraping(brandUrl: string, brandName: string, limit: number = 5) {
    try {
        await connectToDatabase();
        console.log(`Connected to database. Targeting brand: ${brandName}`);

        const response = await fetch(brandUrl, { headers: { 'User-Agent': USER_AGENT } });
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const productLinks: string[] = [];
        const links = doc.querySelectorAll('.product-name a');
        if (links.length === 0) {
            console.log('DEBUG: No links found with .product-name a. HTML Snippet:');
            console.log(html.substring(0, 2000));
        }
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (href && !productLinks.includes(href)) productLinks.push(href);
        });

        console.log(`Found ${productLinks.length} products on category page.`);
        const toScrape = productLinks.slice(0, limit);

        for (const link of toScrape) {
            try {
                const productData = await scrapeProductPage(link, brandName);

                // Check if product exists
                const existing = await Product.findOne({ name: productData.name });
                if (existing) {
                    console.log(`Skipping existing product: ${productData.name}`);
                    continue;
                }

                await Product.create(productData);
                console.log(`✅ Saved: ${productData.name}`);

                await sleep(SLEEP_MS);
            } catch (err) {
                console.error(`Failed to scrape ${link}:`, err);
            }
        }

        console.log('Scraping completed.');
        process.exit(0);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

// Example usage: npx tsx src/scripts/scrape-products.ts <brand_url> <brand_name> <limit>
const args = process.argv.slice(2);
const targetUrl = args[0] || 'https://www.phoneplacekenya.com/product-category/smartphones/samsung/';
const targetBrand = args[1] || 'Samsung';
const targetLimit = parseInt(args[2] || '5');

startScraping(targetUrl, targetBrand, targetLimit);
