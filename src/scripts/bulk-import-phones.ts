import Product from '../models/Product';
import connectToDatabase from '../lib/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const BRANDS = [
    { name: 'Samsung', major: true },
    { name: 'Apple', major: true },
    { name: 'Tecno', major: false },
    { name: 'Infinix', major: false },
    { name: 'Xiaomi', major: true },
    { name: 'Pixel', major: true },
    { name: 'Oppo', major: false },
    { name: 'Realme', major: false }
];

const PLACEHOLDER_IMAGE = "https://utfs.io/f/placeholder-iphone-17-max.png"; // Placeholder as requested

const generateSEOShortDescription = (brand: string, model: string, features: string[]) => {
    return `Buy the latest ${brand} ${model} in Kenya. This premium smartphone features ${features.slice(0, 3).join(', ')}, and more. Genuine ${brand} product with official warranty and fast delivery across Kenya.`;
};

const generateProductsForBrand = (brand: string, isMajor: boolean) => {
    const products = [];
    const featureCount = isMajor ? 8 : 4;

    for (let i = 1; i <= 25; i++) {
        const modelSuffix = i === 1 ? "Ultra" : i === 2 ? "Pro Max" : i === 3 ? "Plus" : i === 4 ? "Lite" : `Series ${i}`;
        const modelName = `${brand} Excellence ${modelSuffix}`;
        const ram = [4, 6, 8, 12, 16][Math.floor(Math.random() * 5)];
        const storage = [64, 128, 256, 512, 1024][Math.floor(Math.random() * 5)];
        const color = ['Midnight Black', 'Phantom Silver', 'Titanium Gray', 'Ocean Blue', 'Aurora Green'][Math.floor(Math.random() * 5)];

        // SEO Rich Title
        const title = `${modelName} - ${ram}GB RAM, ${storage}GB Storage, ${color} | Fast 5G Connectivity & Pro-Grade Camera System`;

        const features: Record<string, string> = {};
        const commonFeatures = [
            ["Display", "Super AMOLED Dynamic Refresh Rate 120Hz"],
            ["Camera", "108MP Quad Camera System with Night Mode"],
            ["Battery", "5000mAh High-Capacity Battery"],
            ["Charging", "65W Fast Wired Charging & Wireless Support"],
            ["Processor", "Flagship Grade 4nm Octa-Core Chipset"],
            ["Connectivity", "Dual SIM 5G LTE, Wi-Fi 6E, Bluetooth 5.3"],
            ["Security", "In-Display Fingerprint Sensor & Face ID"],
            ["OS", "Latest Android/iOS Version with Guaranteed Updates"],
            ["Build", "Gorilla Glass Victus 2 with Aerospace Aluminum Frame"],
            ["Warranty", "1 Year Original Manufacturer Warranty"]
        ];

        for (let j = 0; j < featureCount; j++) {
            const [key, val] = commonFeatures[j % commonFeatures.length];
            features[key] = val;
        }

        products.push({
            name: title,
            brand: brand,
            price: Math.floor(Math.random() * (150000 - 15000) + 15000),
            description: generateSEOShortDescription(brand, modelName, Object.values(features)),
            category: 'Phones',
            imageUrl: PLACEHOLDER_IMAGE,
            images: [PLACEHOLDER_IMAGE],
            features: features,
            specifications: {}, // Left empty for manual addition later
            status: 'published',
            stock: 20
        });
    }

    return products;
};

async function bulkImport() {
    try {
        await connectToDatabase();
        console.log('Connected to database for bulk import...');

        for (const brandConfig of BRANDS) {
            console.log(`Generating 25 products for ${brandConfig.name}...`);
            const products = generateProductsForBrand(brandConfig.name, brandConfig.major);

            for (const p of products) {
                // Use Name as uniqueness check
                const existing = await Product.findOne({ name: p.name });
                if (!existing) {
                    await Product.create(p);
                }
            }
            console.log(`✅ Finished ${brandConfig.name}`);
        }

        console.log('Bulk import completed sucessfully!');
        process.exit(0);
    } catch (error) {
        console.error('Bulk import failed:', error);
        process.exit(1);
    }
}

bulkImport();
