import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import TrustBadges from '@/components/home/TrustBadges';

// Lazy load non-critical sections
const SpecialOffers = dynamic(() => import('@/components/home/SpecialOffers'), {
  loading: () => <div style={{ height: '300px' }} /> // Placeholder
});
const RecentlyViewed = dynamic(() => import('@/components/product/RecentlyViewed'));

export default function Home() {
  return (
    <div>
      <Hero />
      <SpecialOffers />
      <FeaturedProducts />
      <TrustBadges />
      <RecentlyViewed />
    </div>
  );
}
