'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { formatPrice, convertJpyToVnd } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const vndPrice = convertJpyToVnd(product.price_jpy);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem(product, 1);
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
        {product.is_hot && (
          <div className="absolute top-2 right-2 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">
            Hot
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-foreground hover:text-secondary line-clamp-2 mb-2 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="space-y-1 mb-4 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-secondary">{formatPrice(product.price_jpy, 'JPY')}</span>
          </div>
          <div className="text-sm text-muted-foreground">{formatPrice(vndPrice, 'VND')}</div>
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Link href={`/products/${product.id}`} className="flex items-center justify-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </Link>
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
