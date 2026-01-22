import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment.');
    process.exit(1);
}

// Minimal Product Schema
const ProductSchema = new mongoose.Schema({
    name: String,
    brand: String,
    status: String
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to DB');

        const brands = ['Apple', 'Samsung', 'Infinix', 'Tecno', 'Oppo', 'Vivo', 'Xiaomi'];

        console.log('\n🚀 Running Brand Filter Tests (Test 2 style)...');

        for (const brand of brands) {
            const results = await Product.find({
                $and: [
                    {
                        $or: [
                            { status: 'published' },
                            { status: { $exists: false } },
                            { status: null }
                        ]
                    },
                    { brand: { $regex: new RegExp(`^${brand}$`, 'i') } }
                ]
            }).lean();

            console.log(`\n🏷️ Brand: "${brand}" -> Found ${results.length} products`);
            results.forEach(p => console.log(`   - ${p.name}`));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    }
}

verify();
