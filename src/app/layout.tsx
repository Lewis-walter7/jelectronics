import { Inter, Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
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
  keywords: [
    'Electronics', 'Kenya', 'Smartphones', 'Laptops', 'Headphones', 'MobiTower', 'Accessories', 'Samsung', 'Apple',
    'iPhone Price in Kenya', 'Samsung Phones Kenya', 'HP Laptops Kenya', 'Dell Laptops', 'Lenovo', 'MacBook',
    'JBL Speakers', 'Smartwatches', 'Gaming Consoles', 'PS5 Kenya', 'Xbox',
    'Phone Accessories', 'Chargers', 'Cables', 'Screen Protectors', 'Cases',
    'Buy Online', 'M-Pesa Payment', 'Fast Delivery Nairobi', 'Original Products'
  ],
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
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
