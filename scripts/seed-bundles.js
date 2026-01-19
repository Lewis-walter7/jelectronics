
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.resolve(__dirname, '../.env');
let mongoUri = '';

try {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
        const parts = line.split('=');
        const key = parts[0];
        if (key && key.trim() === 'MONGODB_URI') {
            mongoUri = parts.slice(1).join('=').trim();
            // Remove quotes if present
            if (mongoUri.startsWith('"') && mongoUri.endsWith('"')) {
                mongoUri = mongoUri.slice(1, -1);
            }
            break;
        }
    }
} catch (e) {
    console.warn('Could not read .env.local');
}

// Define basic schema if model loading fails
const ProductSchema = new mongoose.Schema({
    name: String,
    bundledProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    bundleDiscount: Number
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seedBundles() {
    try {
        if (!mongoUri) {
            console.error('MONGODB_URI not found in .env.local');
            return;
        }
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        // Find the Fold
        const mainProduct = await Product.findOne({ name: { $regex: /Samsung Galaxy Z TriFold/i } });

        if (!mainProduct) {
            console.log('Main product not found, using first available.');
        }

        const targetProduct = mainProduct || await Product.findOne();
        if (!targetProduct) {
            console.log('No products found to modify.');
            return;
        }

        console.log(`Setting bundles for: ${targetProduct.name}`);

        // Find 2 other random products
        const otherProducts = await Product.find({ _id: { $ne: targetProduct._id } }).limit(2);

        if (otherProducts.length === 0) {
            console.log('Not enough products to create a bundle.');
            return;
        }

        targetProduct.bundledProducts = otherProducts.map(p => p._id);
        targetProduct.bundleDiscount = 10; // 10% discount

        await targetProduct.save();
        console.log(`Successfully bundled ${otherProducts.length} products with ${targetProduct.name}`);
        console.log(`Bundle IDs: ${otherProducts.map(p => p._id).join(', ')}`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

seedBundles();
