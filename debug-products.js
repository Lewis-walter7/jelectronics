
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually load .env.local or .env
const envFiles = ['.env.local', '.env'];
let loaded = false;

for (const file of envFiles) {
    try {
        const envPath = path.resolve(file);
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim();
                    if (key && value) {
                        process.env[key] = value;
                    }
                }
            });
            console.log(`Loaded env from ${file}`);
            loaded = true;
            break;
        }
    } catch (e) {
        // ignore
    }
}

if (!loaded) console.log('Could not load .env file');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing');
    process.exit(1);
}

const productSchema = new mongoose.Schema({
    name: String,
    variants: [Object],
    features: Object,
    description: String
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function checkProductData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const products = await Product.find({}).limit(5).lean();

        console.log('--- Sample Products Data ---');
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log('Variants:', JSON.stringify(p.variants, null, 2));
            console.log('Features:', JSON.stringify(p.features, null, 2));
            console.log('---------------------------');
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkProductData();
