import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://mobitoweraccesories.com';

    // Static routes
    const routes = [
        '',
        '/about',
        '/products',
        '/delivery',
        '/faq',
        '/special-offers',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    try {
        await connectToDatabase();
        const products = await Product.find({}).select('name category updatedAt _id').lean();

        const productRoutes = products.map((product: any) => {
            const slug = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product._id}`;
            return {
                url: `${baseUrl}/products/${product.category}/${slug}`,
                lastModified: product.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            };
        });

        return [...routes, ...productRoutes];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes;
    }
}
