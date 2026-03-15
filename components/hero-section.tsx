import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 animate-fade-in">
          <span className="inline-block text-6xl sm:text-7xl mb-4">🎌</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Order Authentic <span className="text-secondary">Japanese Products</span> Direct to Vietnam
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Fast, reliable access to thousands of products from Amazon Japan and Rakuten. Competitive prices with convenient delivery straight to your door.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
            <Link href="/#hot-products" className="flex items-center gap-2">
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/order-from-link">Paste Product Link</Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-8 border-t border-border">
          <div>
            <div className="text-3xl font-bold text-secondary">500+</div>
            <p className="text-sm text-muted-foreground">Products</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary">2K+</div>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary">7</div>
            <p className="text-sm text-muted-foreground">Days Delivery</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
    </div>
  );
}
