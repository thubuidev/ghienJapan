'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import { toast } from 'sonner';
import { Loader as Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price_jpy: product?.price_jpy || 0,
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
    stock: product?.stock || '',
    is_hot: product?.is_hot || false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price_jpy || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (product) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', product.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);

        if (error) throw error;
        toast.success('Product created successfully');
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="mt-2"
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="category_id">Category *</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-white text-foreground disabled:opacity-50"
                  disabled={submitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="price_jpy">Price (JPY) *</Label>
                <Input
                  id="price_jpy"
                  name="price_jpy"
                  type="number"
                  value={formData.price_jpy}
                  onChange={handleChange}
                  placeholder="0"
                  className="mt-2"
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  className="mt-2"
                  rows={4}
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Information</Label>
                <Input
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g., In Stock, Limited"
                  className="mt-2"
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-2"
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_hot"
                  name="is_hot"
                  checked={formData.is_hot}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_hot: checked as boolean,
                    }))
                  }
                  disabled={submitting}
                />
                <Label htmlFor="is_hot" className="font-normal cursor-pointer">
                  Mark as Hot Product
                </Label>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="font-bold text-foreground mb-4">Preview</h3>

            {formData.image_url && (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground line-clamp-2">
                  {formData.name || 'Product Name'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-xl font-bold text-secondary">
                  ¥{formData.price_jpy}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold text-foreground">
                  {categories.find((c) => c.id === formData.category_id)?.name || 'Select category'}
                </p>
              </div>

              {formData.is_hot && (
                <div className="p-2 bg-secondary text-white rounded text-sm font-semibold text-center">
                  🔥 Hot Product
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full lg:w-auto">
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          product ? 'Update Product' : 'Create Product'
        )}
      </Button>
    </form>
  );
}
