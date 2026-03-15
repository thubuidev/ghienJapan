'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/hero-section';
import { HowItWorks } from '@/components/how-it-works';
import { TestimonialsSection } from '@/components/testimonials-section';
import { FAQSection } from '@/components/faq-section';
import { ProductCard } from '@/components/product-card';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_hot', true)
          .limit(6);

        if (error) throw error;
        setHotProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch hot products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  return (
    <>
      <Header />
      <HeroSection />

      <section id="hot-products" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Hot Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked selection of trending Japanese products
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full h-48 rounded-lg" />
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
              ))}
            </div>
          ) : hotProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hot products available yet.</p>
            </div>
          )}
        </div>
      </section>

      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </>
  );
}
