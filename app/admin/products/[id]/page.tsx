'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../form';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-32 h-10" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return <ProductForm product={product || undefined} />;
}
