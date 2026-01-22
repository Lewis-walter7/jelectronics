import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import BrandSection from '@/components/product/BrandSection';
import GamingDeals from '@/components/home/GamingDeals';
import PocketFriendlyDeals from '@/components/home/PocketFriendlyDeals';
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
      <BrandSection brand="Apple" title="Apple Products" />
      <BrandSection brand="Samsung" title="Samsung Products" minPrice={60000} />
      <BrandSection brand="Nothing" title="Nothing Products" />
      <BrandSection brand="Pixel" title="Google Pixel" />
      <GamingDeals />
      <PocketFriendlyDeals />
      <TrustBadges />
      <RecentlyViewed />
    </div>
  );
}
