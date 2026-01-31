
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import dns from 'dns';
// import path from 'path';

// // Fix for querySrv ECONNREFUSED on some networks
// try {
//     dns.setServers(['8.8.8.8', '8.8.4.4']);
//     console.log('🌐 Custom DNS servers set.');
// } catch (e) {
//     console.warn('⚠️ Failed to set custom DNS servers:', e);
// }

// // Load environment variables from .env file
// dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// const SOURCE_URI = 'mongodb+srv://lewisindusa_db_user:hyOBqtNQlQhN63od@cluster0.e5yjp8u.mongodb.net/phonemallexpress?retryWrites=true&w=majority&appName=Cluster0';
// const TARGET_URI = process.env.MONGODB_URI;

// if (!TARGET_URI) {
//     console.error('❌ MONGODB_URI is ignored or missing in .env');
//     process.exit(1);
// }

// // target schema definitions (simplified for migration)
// // We need the schema to use the model, or we can just use collection access.
// // Using the Model ensures hooks run (slug generation, price calc).
// // Let's import the Prodcut model from the app code if possible, or define it dynamicallly?
// // Importing might trigger db connection of the app.
// // Ideally, we define a lightweight schema or prevent auto-connect.
// // But `src/models/Product.ts` does `export default ... model`. Importing it usually doesn't connect but registers the model.
// // However, to use it with a specific connection, we need to register it on that connection.

// const ProductSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     youtubeUrl: String,
//     price: Number,
//     isOnSpecialOffer: Boolean,
//     salePrice: Number,
//     discountPercentage: Number,
//     minPrice: Number,
//     maxPrice: Number,
//     brand: String,
//     category: String,
//     subcategory: String,
//     variants: [],
//     storageVariants: [],
//     warrantyVariants: [],
//     simVariants: [],
//     colors: [String],
//     imageUrl: String,
//     images: [String],
//     stock: Number,
//     isFeatured: Boolean,
//     averageRating: Number,
//     reviewCount: Number,
//     status: String,
//     features: Object,
//     specifications: Object,
//     frequentlyBoughtTogether: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
//     bundleDiscount: Number,
//     slug: { type: String, unique: true, sparse: true }
// }, { timestamps: true, strict: false }); // strict: false to allow other fields if any, but we mainly care about these

// // Add the pre-save hook logic to ensure data consistency
// ProductSchema.pre('save', async function () {
//     // 1. Slug generation
//     if (!this.slug || this.isModified('name')) {
//         let slug = (this.name || '').toLowerCase()
//             .replace(/[^a-z0-9]+/g, '-')
//             .replace(/^-+|-+$/g, '');

//         if (this._id) {
//             slug = `${slug}-${this._id}`;
//         }
//         this.slug = slug;
//     }

//     // 2. Min/Max Price Calc (Simplified copy from source)
//     const basePrice = (this as any).price || 0;
//     const storagePrices = (this as any).storageVariants?.filter((v: any) => !v.isDisabled).map((v: any) => (v.salePrice > 0 ? v.salePrice : v.price)) || [basePrice];
//     const warrantyPrices = (this as any).warrantyVariants?.filter((v: any) => !v.isDisabled).map((v: any) => (v.salePrice > 0 ? v.salePrice : v.price)) || [basePrice];
//     const simAddons = (this as any).simVariants?.filter((v: any) => !v.isDisabled).map((v: any) => (v.salePrice > 0 ? v.salePrice : v.price)) || [0];

//     const combinedBases: number[] = [];
//     if (storagePrices.length && warrantyPrices.length) {
//         storagePrices.forEach((s: number) => {
//             warrantyPrices.forEach((w: number) => {
//                 combinedBases.push(Math.max(s, w, basePrice));
//             });
//         });
//     } else {
//         combinedBases.push(basePrice);
//     }


//     const allTotals: number[] = [];
//     if (combinedBases.length && simAddons.length) {
//         combinedBases.forEach(cb => {
//             simAddons.forEach((sim: number) => {
//                 allTotals.push(cb + sim);
//             });
//         });
//     }

//     if (allTotals.length > 0) {
//         (this as any).minPrice = Math.min(...allTotals);
//         (this as any).maxPrice = Math.max(...allTotals);
//     }
// });


// async function migrate() {
//     console.log('🚀 Starting Migration...');
//     console.log('📦 Source:', SOURCE_URI.split('@')[1]); // Log safe part
//     console.log('🎯 Target:', TARGET_URI!.split('@')[1]);

//     const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
//     const targetConn = await mongoose.createConnection(TARGET_URI!).asPromise();

//     console.log('✅ Connected to both databases.');

//     try {
//         const SourceProductModel = sourceConn.model('Product', new mongoose.Schema({}, { strict: false })); // Generic schema to read all fields
//         const TargetProductModel = targetConn.model('Product', ProductSchema);

//         const sourceProducts = await SourceProductModel.find().lean();
//         console.log(`📦 Found ${sourceProducts.length} products in Source.`);

//         let insertedCount = 0;
//         let skippedCount = 0;
//         let errorCount = 0;

//         for (const srcProd of sourceProducts) {
//             try {
//                 // Check existence by _id
//                 const exists = await TargetProductModel.findById(srcProd._id);
//                 if (exists) {
//                     skippedCount++;
//                     // console.log(`⏭️ Skipped (Exists): ${srcProd.name}`);
//                     continue;
//                 }

//                 // Prepare object
//                 const newProdData = { ...srcProd };
//                 delete newProdData.__v; // Remove version key

//                 // Map fields
//                 if ((srcProd as any).youtubeVideoUrl && !newProdData.youtubeUrl) {
//                     newProdData.youtubeUrl = (srcProd as any).youtubeVideoUrl;
//                 }
//                 // delete legacy field if it exists in data but not in schema (schema strict:false might allow it, but we want to clean up if we want)
//                 // but let's keep it clean
//                 delete (newProdData as any).youtubeVideoUrl;

//                 // Create and Save (triggers hooks)
//                 // We use new Model(data) and save() to ensure hooks run
//                 const newDoc = new TargetProductModel(newProdData);
//                 await newDoc.save();

//                 insertedCount++;
//                 console.log(`✅ Inserted: ${srcProd.name}`);

//             } catch (err: any) {
//                 console.error(`❌ Error migrating ${srcProd.name}:`, err.message);
//                 errorCount++;
//             }
//         }

//         console.log('\n==========================================');
//         console.log(`🎉 Migration Completed`);
//         console.log(`✅ Inserted: ${insertedCount}`);
//         console.log(`⏭️ Skipped: ${skippedCount}`);
//         console.log(`❌ Errors: ${errorCount}`);
//         console.log('==========================================\n');

//     } catch (error) {
//         console.error('Migration Fatal Error:', error);
//     } finally {
//         await sourceConn.close();
//         await targetConn.close();
//         console.log('🔌 Connections closed.');
//     }
// }

// migrate();
