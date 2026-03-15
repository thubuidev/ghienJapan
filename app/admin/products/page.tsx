'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Trash2, CreditCard as Edit2, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
      ]);

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleHot = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_hot: !product.is_hot })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, is_hot: !product.is_hot } : p
        )
      );
      toast.success(!product.is_hot ? 'Marked as hot product' : 'Removed from hot products');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-foreground">Products</h1>
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link href="/admin/products/new">
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-20" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-4 items-start">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                    {product.is_hot && (
                      <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">Hot</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {product.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-secondary">{formatPrice(product.price_jpy, 'JPY')}</span>
                    <span className="text-muted-foreground">{getCategoryName(product.category_id)}</span>
                    <span className="text-muted-foreground">Stock: {product.stock || 'N/A'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleHot(product)}
                    className="flex items-center gap-1"
                  >
                    <Star className={`w-4 h-4 ${product.is_hot ? 'fill-current' : ''}`} />
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                    <Link href={`/admin/products/${product.id}`}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Button asChild size="lg">
            <Link href="/admin/products/new" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Your First Product
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
