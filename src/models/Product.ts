import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this product.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for this product.'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price.'],
    },
    category: {
        type: String,
        enum: ['Phones', 'Laptops', 'Tablets', 'Accessories', 'TVs', 'Other'],
        required: [true, 'Please specify a category.'],
    },
    variants: [{
        name: String,
        price: Number,
        salePrice: Number,
        stock: { type: Number, default: 0 }
    }],
    colors: {
        type: [String], // e.g., ["Black", "White"]
        default: []
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL.'],
    },
    stock: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'published',
    },
    features: {
        type: Object, // Changed from Map to Object for flexibility
        default: {}
    },
    specifications: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
