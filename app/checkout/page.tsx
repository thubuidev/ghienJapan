'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';
import { formatPrice, convertJpyToVnd } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader as Loader2, Check, ArrowLeft } from 'lucide-react';

interface FormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerContact: string;
  notes: string;
  agreeTerms: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerContact: '',
    notes: '',
    agreeTerms: false,
  });

  const totalJpy = items.reduce((sum, item) => sum + item.product.price_jpy * item.quantity, 0);
  const totalVnd = convertJpyToVnd(totalJpy);

  if (items.length === 0 && !submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add items to proceed with checkout.</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-block w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">Order Placed Successfully</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for your order. Our team will contact you soon to confirm payment details.
              </p>

              <Card className="bg-primary/10 border-border mb-8 p-6">
                <p className="text-sm text-muted-foreground mb-2">Your Order ID:</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-secondary font-mono">{orderId}</p>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(orderId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-2 hover:bg-primary/20 rounded transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : '📋'}
                  </button>
                </div>
              </Card>

              <div className="space-y-4 mb-8 text-left">
                <div className="bg-primary/5 border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Payment Information:</h3>
                  <p className="text-muted-foreground mb-2">
                    Our team will contact you via phone or Zalo with bank transfer details.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please keep your Order ID ready when communicating with us.
                  </p>
                </div>

                <div className="bg-primary/5 border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Timeline:</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>✓ Order received</li>
                    <li>→ 1-2 hours: Team will contact you</li>
                    <li>→ Payment confirmation</li>
                    <li>→ 1-2 days: Processing</li>
                    <li>→ 5-7 days: Delivery to your address</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.customerName,
            customer_phone: formData.customerPhone,
            customer_address: formData.customerAddress,
            customer_contact: formData.customerContact,
            notes: formData.notes,
            total_jpy: totalJpy,
            total_vnd: totalVnd,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_jpy: item.product.price_jpy,
        price_vnd: convertJpyToVnd(item.product.price_jpy),
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(orderData.id);
      clearCart();
      setSubmitted(true);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-secondary/80 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-border p-6 mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
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

                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {formatPrice(item.product.price_jpy, 'JPY')}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {formatPrice(item.product.price_jpy * item.quantity, 'JPY')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Information</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      placeholder="Your full name"
                      value={formData.customerName}
                      onChange={handleFormChange}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      placeholder="+84 123 456 789"
                      value={formData.customerPhone}
                      onChange={handleFormChange}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerAddress">Delivery Address *</Label>
                    <Textarea
                      id="customerAddress"
                      name="customerAddress"
                      placeholder="Full address including district and city"
                      value={formData.customerAddress}
                      onChange={handleFormChange}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerContact">Facebook or Zalo Contact</Label>
                    <Input
                      id="customerContact"
                      name="customerContact"
                      placeholder="Your Facebook URL or Zalo ID"
                      value={formData.customerContact}
                      onChange={handleFormChange}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special requests for your order"
                      value={formData.notes}
                      onChange={handleFormChange}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreeTerms: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="agreeTerms" className="font-normal cursor-pointer">
                      I agree to the terms and conditions and understand payment will be requested after order confirmation
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div>
              <div className="bg-primary/10 rounded-lg border border-border p-6 sticky top-20">
                <h2 className="text-xl font-bold text-foreground mb-6">Total</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground">Subtotal (JPY):</span>
                    <span className="font-semibold text-secondary">{formatPrice(totalJpy, 'JPY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Subtotal (VND):</span>
                    <span className="font-semibold text-secondary">{formatPrice(totalVnd, 'VND')}</span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-bold text-foreground">Total (JPY):</span>
                      <span className="text-lg font-bold text-secondary">{formatPrice(totalJpy, 'JPY')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-foreground">Total (VND):</span>
                      <span className="text-lg font-bold text-secondary">{formatPrice(totalVnd, 'VND')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-6 p-3 bg-white rounded">
                  Conversion rate: 1 JPY = 170 VND
                </div>

                <Button onClick={handleSubmit} disabled={loading} size="lg" className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Payment details will be provided after order confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
