import { Inter, Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-main' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL('https://mobitoweraccesories.com'),
  title: {
    default: 'MobiTower Accessories | Premium Electronics Store',
    template: '%s | MobiTower Accessories'
  },
  description: 'Shop the best premium electronics in Kenya. Smartphones, Laptops, Accessories and more. Fast delivery and M-Pesa payment available.',
  keywords: ['Electronics', 'Kenya', 'Smartphones', 'Laptops', 'Headphones', 'MobiTower', 'Accessories', 'Samsung', 'Apple'],
  openGraph: {
    title: 'MobiTower Accessories | Premium Electronics Store',
    description: 'Shop the best premium electronics in Kenya. Smartphones, Laptops, Accessories and more.',
    url: 'https://mobitoweraccesories.com',
    siteName: 'MobiTower Accessories',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MobiTower Accessories | Premium Electronics Store',
    description: 'Shop the best premium electronics in Kenya. Smartphones, Laptops, Accessories and more.',
    // creator: '@mobitower', // If exists
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning> {/* Changed font variables to match the example's structure, but kept original font names */}
        {children}
      </body>
    </html>
  );
}
