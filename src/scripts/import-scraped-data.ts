import mongoose from 'mongoose';
import Product from '../models/Product';
import connectToDatabase from '../lib/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const scrapedData = [
    {
        "name": "Samsung Galaxy Z TriFold",
        "price": "KSh 700,000",
        "brand": "Samsung",
        "url": "https://www.phoneplacekenya.com/product/samsung-galaxy-trifold/",
        "image_urls": ["https://www.phoneplacekenya.com/wp-content/uploads/2025/12/Samsung-Galaxy-Z-TriFold.webp"],
        "key_features": [
            "Tri-fold design",
            "10.0-inch Dynamic LTPO AMOLED 2X, 120Hz",
            "Snapdragon 8 Elite (3nm)",
            "16GB RAM, 512GB / 1TB Storage",
            "200MP Triple Main Camera",
            "5600mAh Battery with 45W Wired Charging"
        ],
        "technical_specs": {
            "Display": "10.0-inch Dynamic LTPO AMOLED 2X, 120Hz, HDR, 1600 nits",
            "Chipset": "Snapdragon 8 Elite (3nm)",
            "RAM & Storage": "16GB RAM · 512GB / 1TB Storage",
            "Operating System": "Android 16, One UI 8",
            "Main Camera": "200 MP (wide) + 10 MP (telephoto) + 12 MP (ultrawide)",
            "Front Camera": "10MP",
            "Battery": "5600mAh",
            "Charging": "45W Wired · 15W Wireless",
            "Build": "Gorilla Glass Ceramic 2, Titanium Hinge Housing, IP48 Resistance"
        }
    },
    {
        "name": "Samsung Galaxy F17 5G",
        "price": "KSh 20,000",
        "brand": "Samsung",
        "url": "https://www.phoneplacekenya.com/product/samsung-galaxy-f17-5g/",
        "image_urls": ["https://www.phoneplacekenya.com/wp-content/uploads/2025/11/Samsung-Galaxy-F17-5G.webp"],
        "key_features": [
            "6.7-inch Super AMOLED, 90Hz",
            "Exynos 1330 (5 nm) Chipset",
            "4GB/6GB RAM, 128GB Internal Storage",
            "50MP + 5MP + 2MP Main Camera",
            "5000mAh Battery with 25W Charging",
            "5G Connectivity"
        ],
        "technical_specs": {
            "OS": "Android 15, One UI 7",
            "Chipset": "Exynos 1330 (5 nm)",
            "CPU": "Octa-core (2×2.4 GHz Cortex-A78 & 6×2.0 GHz Cortex-A55)",
            "GPU": "Mali-G68 MP2",
            "Storage": "256GB 8GB RAM",
            "Network": "5G, 4G, 3G, 2G",
            "Battery": "5000mAh"
        }
    },
    {
        "name": "Samsung Galaxy M17 5G",
        "price": "KSh 21,500",
        "brand": "Samsung",
        "url": "https://www.phoneplacekenya.com/product/samsung-galaxy-m17-5g/",
        "image_urls": ["https://www.phoneplacekenya.com/wp-content/uploads/2025/10/samsung-galaxy-m17-5g.webp"],
        "key_features": [
            "6.7-inch Super AMOLED, 90Hz",
            "Mediatek Dimensity 6300 (6 nm)",
            "6GB RAM, 128GB Storage",
            "50MP + 5MP + 2MP Main Camera",
            "5000mAh Battery with 25W Wired Charging",
            "Android 15, up to 6 major upgrades"
        ],
        "technical_specs": {
            "Dimensions": "164.4 x 77.9 x 7.9 mm, 191g",
            "Display": "6.7 inches Super AMOLED, 1080 x 2340 pixels",
            "Chipset": "Mediatek Dimensity 6300 (6 nm)",
            "RAM": "6GB",
            "Storage": "128GB",
            "Main Camera": "50 MP + 5 MP + 2 MP",
            "Front Camera": "13 MP",
            "Battery": "5000 mAh",
            "Connectivity": "5G, Wi-Fi, Bluetooth 5.3, NFC"
        }
    },
    {
        "name": "Samsung Galaxy M36 5G",
        "price": "KSh 21,500 – KSh 24,000",
        "brand": "Samsung",
        "url": "https://www.phoneplacekenya.com/product/samsung-galaxy-m36-5g/",
        "image_urls": ["https://www.phoneplacekenya.com/wp-content/uploads/2025/09/Samsung-Galaxy-M36-5G.jpg"],
        "key_features": [
            "7-inch Super AMOLED Display",
            "Exynos 1380 (5 nm) Chipset",
            "6GB RAM, 128GB Internal Storage",
            "50MP + 8MP + 2MP Main Camera",
            "5000mAh Battery with 25W Fast Charging",
            "Android 15, One UI 7"
        ],
        "technical_specs": {
            "Display": "7-inch Super AMOLED",
            "Chipset": "Exynos 1380 (5 nm)",
            "RAM": "6GB",
            "Storage": "128GB",
            "Main Camera": "50MP + 8MP + 2MP",
            "Front Camera": "13MP",
            "Battery": "5,000mAh",
            "Connectivity": "5G, Bluetooth 5.3, NFC"
        }
    },
    {
        "name": "Samsung Galaxy A17 4G",
        "price": "KSh 20,500 – KSh 27,000",
        "brand": "Samsung",
        "url": "https://www.phoneplacekenya.com/product/samsung-galaxy-a17-4g/",
        "image_urls": ["https://www.phoneplacekenya.com/wp-content/uploads/2025/09/Samsung-Galaxy-A17-4G.jpg"],
        "key_features": [
            "6.7-inch Super AMOLED Display",
            "MediaTek Helio G99 (6nm) processor",
            "4GB/6GB/8GB RAM, 128GB/256GB Storage",
            "50MP + 2MP Main Camera",
            "Android 15, up to 6 major upgrades",
            "4G Connectivity"
        ],
        "technical_specs": {
            "Display": "6.7-inch Super AMOLED",
            "Chipset": "MediaTek Helio G99 (6nm)",
            "RAM": "4GB, 6GB, 8GB",
            "Storage": "128GB, 256GB",
            "Main Camera": "50MP + 2MP",
            "Front Camera": "13MP",
            "OS": "Android 15",
            "Connectivity": "4G, Bluetooth 5.3, NFC, Wi-Fi"
        }
    }
];

function parsePrice(priceStr: string): number {
    // If range "KSh 21,500 – KSh 24,000", take the first part
    const part = priceStr.split('–')[0];
    return parseInt(part.replace(/[^0-9]/g, '')) || 0;
}

async function importData() {
    try {
        await connectToDatabase();
        console.log('Connected to database.');

        for (const item of scrapedData) {
            const price = parsePrice(item.price);

            // Format features from array to Record<string, string>
            const features: Record<string, string> = {};
            item.key_features.forEach((feat, idx) => {
                if (feat.includes(':')) {
                    const [k, ...v] = feat.split(':');
                    features[k.trim()] = v.join(':').trim();
                } else {
                    features[`Highlight ${idx + 1}`] = feat;
                }
            });

            const productData = {
                name: item.name,
                brand: item.brand,
                price: price,
                description: item.key_features.join('. '),
                category: 'Phones',
                imageUrl: item.image_urls[0],
                images: item.image_urls,
                features: features,
                specifications: item.technical_specs,
                status: 'published',
                stock: 15
            };

            // Check existence
            const existing = await Product.findOne({ name: item.name });
            if (existing) {
                console.log(`Skipping existing: ${item.name}`);
                continue;
            }

            await Product.create(productData);
            console.log(`✅ Imported: ${item.name}`);
        }

        console.log('Import completed.');
        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

importData();
