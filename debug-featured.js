
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
try {
    const envConfig = fs.readFileSync(path.resolve('.env.local'), 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log('Could not read .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing');
    process.exit(1);
}

const productSchema = new mongoose.Schema({
    name: String,
    isFeatured: Boolean,
    status: String
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function checkFeatured() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const count = await Product.countDocuments({ isFeatured: true });
        console.log(`Featured Products Count: ${count}`);

        const allCount = await Product.countDocuments({});
        console.log(`Total Products Count: ${allCount}`);

        // Check if status field exists
        const statusCount = await Product.countDocuments({ status: { $exists: true } });
        console.log(`Products with status field: ${statusCount}`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkFeatured();
