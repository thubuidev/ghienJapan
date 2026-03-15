'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Product, Order } from '@/lib/types';
import { formatPrice, convertJpyToVnd } from '@/lib/utils';
import { ShoppingCart, Package, TrendingUp, Clock, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
          supabase.from('products').select('*', { count: 'exact' }),
        ]);

        const totalOrders = ordersRes.count || 0;
        const totalProducts = productsRes.count || 0;

        let totalRevenue = 0;
        if (ordersRes.data) {
          totalRevenue = ordersRes.data.reduce((sum: number, order: Order) => sum + (order.total_jpy || 0), 0);
        }

        setStats({
          totalOrders,
          totalProducts,
          totalRevenue,
        });

        setRecentOrders(ordersRes.data || []);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
              {loading ? (
                <Skeleton className="w-16 h-8" />
              ) : (
                <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
              )}
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Products</p>
              {loading ? (
                <Skeleton className="w-16 h-8" />
              ) : (
                <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
              )}
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Package className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Revenue (JPY)</p>
              {loading ? (
                <Skeleton className="w-24 h-8" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalRevenue, 'JPY')}</p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Revenue (VND)</p>
              {loading ? (
                <Skeleton className="w-24 h-8" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{formatPrice(convertJpyToVnd(stats.totalRevenue), 'VND')}</p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Orders</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">View All</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-mono text-sm">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-foreground">{order.customer_name}</td>
                    <td className="py-3 px-4 text-foreground font-semibold">
                      {formatPrice(order.total_jpy, 'JPY')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
