import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { AdminProvider } from '@/lib/admin-context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Order Japan - Japanese Products Delivery to Vietnam',
  description: 'Order authentic Japanese products from Amazon Japan and Rakuten with fast delivery to Vietnam',
  openGraph: {
    title: 'Order Japan',
    description: 'Order authentic Japanese products from Amazon Japan and Rakuten with fast delivery to Vietnam',
    images: [
      {
        url: 'https://images.pexels.com/photos/3537952/pexels-photo-3537952.jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://images.pexels.com/photos/3537952/pexels-photo-3537952.jpeg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminProvider>
          <CartProvider>{children}</CartProvider>
        </AdminProvider>
        <Toaster />
      </body>
    </html>
  );
}
