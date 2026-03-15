'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { formatPrice, convertJpyToVnd } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const vndPrice = product ? convertJpyToVnd(product.price_jpy) : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    try {
      addItem(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart`);
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="w-32 h-10 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="w-full h-96" />
              <div className="space-y-4">
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-1/2 h-10" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
            <Button asChild>
              <Link href="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/products" className="flex items-center gap-2 text-secondary hover:text-secondary/80 mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.is_hot && (
                <div className="inline-block bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Hot Product
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

              <div className="space-y-2 mb-6">
                <div className="text-4xl font-bold text-secondary">{formatPrice(product.price_jpy, 'JPY')}</div>
                <div className="text-xl text-muted-foreground">{formatPrice(vndPrice, 'VND')}</div>
                <p className="text-sm text-muted-foreground">Conversion rate: 1 JPY = 170 VND</p>
              </div>

              {product.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 rounded-lg border border-border hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border border-border rounded-lg px-3 py-2"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg border border-border hover:bg-primary/10"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                size="lg"
                className="w-full flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">In Stock</h3>
                <p className="text-muted-foreground">{product.stock || 'Available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
