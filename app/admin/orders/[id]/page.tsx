'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Order, Product } from '@/lib/types';
import { formatPrice, convertJpyToVnd } from '@/lib/utils';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_jpy: number;
  price_vnd: number;
  product?: Product;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const [orderRes, itemsRes] = await Promise.all([
          supabase.from('orders').select('*').eq('id', orderId).single(),
          supabase.from('order_items').select('*').eq('order_id', orderId),
        ]);

        if (orderRes.error) throw orderRes.error;
        setOrder(orderRes.data);

        if (itemsRes.data) {
          const itemsWithProducts = await Promise.all(
            itemsRes.data.map(async (item) => {
              const { data: product } = await supabase
                .from('products')
                .select('*')
                .eq('id', item.product_id)
                .single();
              return { ...item, product };
            })
          );
          setItems(itemsWithProducts);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-32 h-10" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Button asChild>
          <Link href="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        asChild
        variant="outline"
        className="mb-8 flex items-center gap-2"
      >
        <Link href="/admin/orders">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Items</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                  {item.product?.image_url && (
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">
                      {item.product?.name || 'Unknown Product'}
                    </h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      <div className="text-right">
                        <p className="font-semibold text-secondary">
                          {formatPrice(item.price_jpy * item.quantity, 'JPY')}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatPrice(convertJpyToVnd(item.price_jpy * item.quantity), 'VND')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-6 bg-primary/5 border-border">
            <h3 className="font-bold text-foreground mb-4">Order Total</h3>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span className="text-foreground">Subtotal (JPY):</span>
                <span className="font-semibold text-secondary">
                  {formatPrice(order.total_jpy, 'JPY')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Subtotal (VND):</span>
                <span className="font-semibold text-secondary">
                  {formatPrice(order.total_vnd, 'VND')}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-xl">
                <span className="font-bold text-foreground">Total:</span>
                <span className="font-bold text-secondary">
                  {formatPrice(order.total_jpy, 'JPY')}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Order Status</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
              order.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>Order Date:</p>
              <p className="font-semibold text-foreground">
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Customer Information</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">
                    {order.customer_phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-semibold text-foreground whitespace-pre-wrap">
                    {order.customer_address}
                  </p>
                </div>
              </div>

              {order.customer_contact && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-semibold text-foreground break-all">
                      {order.customer_contact}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {order.notes && (
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-2">Notes</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {order.notes}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
