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

// Define simple schema to read everything
const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function verifyFilters() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Test Case: Storage Filter
        const storageInput = '128GB';
        const storageRegexes = [new RegExp(storageInput.trim(), 'i')];

        console.log(`Testing Storage Filter for "${storageInput}"...`);

        const storageQuery = {
            $or: [
                { 'variants.name': { $in: storageRegexes } },
                { 'features.Storage': { $in: storageRegexes } },
                { 'features.Internal Storage': { $in: storageRegexes } },
                { 'features.Memory': { $in: storageRegexes } }
            ]
        };

        const results = await Product.find(storageQuery).select('name features').lean();

        console.log(`Found ${results.length} products matching "${storageInput}".`);
        results.forEach(p => {
            // Check where it matched
            const featStorage = p.features['Storage'] || p.features['Internal Storage'] || p.features['Memory'];
            console.log(`- ${p.name} [Feature Value: "${featStorage}"]`);
        });

        if (results.length > 0) {
            console.log('✅ Storage Filter Test PASSED');
        } else {
            console.log('❌ Storage Filter Test FAILED (No results found)');
        }

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyFilters();
