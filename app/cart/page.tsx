'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { formatPrice, convertJpyToVnd } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const totalJpy = items.reduce((sum, item) => sum + item.product.price_jpy * item.quantity, 0);
  const totalVnd = convertJpyToVnd(totalJpy);

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Start shopping by browsing our products or pasting a link from your favorite Japanese store.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/order-from-link">Order from Link</Link>
              </Button>
            </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

          <div className="space-y-4 mb-8">
            {items.map((item) => {
              const itemTotal = item.product.price_jpy * item.quantity;
              const itemVnd = convertJpyToVnd(itemTotal);

              return (
                <div key={item.product_id} className="flex gap-4 bg-white border border-border rounded-lg p-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{item.product.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-secondary">{formatPrice(item.product.price_jpy, 'JPY')}</span>
                      <span className="text-sm text-muted-foreground">{formatPrice(convertJpyToVnd(item.product.price_jpy), 'VND')}</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="p-1 rounded border border-border hover:bg-primary/10"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                      className="w-12 text-center border border-border rounded px-2 py-1"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="p-1 rounded border border-border hover:bg-primary/10"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <div className="font-bold text-secondary mb-1">{formatPrice(itemTotal, 'JPY')}</div>
                    <div className="text-sm text-muted-foreground">{formatPrice(itemVnd, 'VND')}</div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-primary/10 rounded-lg p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-foreground font-semibold">Subtotal (JPY):</span>
                <span className="font-bold text-secondary">{formatPrice(totalJpy, 'JPY')}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-foreground font-semibold">Subtotal (VND):</span>
                <span className="font-bold text-secondary">{formatPrice(totalVnd, 'VND')}</span>
              </div>
              <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                <p>Conversion rate: 1 JPY = 170 VND</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild size="lg" className="flex-1">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
