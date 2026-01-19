import Hero from '@/components/home/Hero';
import SpecialOffers from '@/components/home/SpecialOffers';
import FeaturedProducts from '@/components/product/FeaturedProducts';

export default function Home() {
  return (
    <div>
      <Hero />
      <SpecialOffers />
      <FeaturedProducts />
    </div>
  );
}
