import Hero from '@/components/home/Hero';
import TrustBadges from '@/components/home/TrustBadges';
import SpecialOffers from '@/components/home/SpecialOffers';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import RecentlyViewed from '@/components/product/RecentlyViewed';

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
