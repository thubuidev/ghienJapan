'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Eye, CircleAlert as AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-8">Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-20" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {order.customer_name}
                    </h3>
                    {order.status === 'pending' && (
                      <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pending Payment
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Order ID</p>
                      <p className="font-mono text-xs">{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total (JPY)</p>
                      <p className="font-semibold text-secondary">
                        {formatPrice(order.total_jpy, 'JPY')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-semibold">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No orders yet</p>
        </Card>
      )}
    </div>
  );
}
