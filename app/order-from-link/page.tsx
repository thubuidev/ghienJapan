'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { formatPrice, convertJpyToVnd } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader as Loader2, Copy, Check } from 'lucide-react';

interface ProductPreview {
  name: string;
  image?: string;
  price?: number;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerContact: string;
  notes: string;
}

export default function OrderFromLinkPage() {
  const [productUrl, setProductUrl] = useState('');
  const [source, setSource] = useState<'amazon' | 'rakuten'>('amazon');
  const [extracting, setExtracting] = useState(false);
  const [productPreview, setProductPreview] = useState<ProductPreview | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  const [manualProduct, setManualProduct] = useState({
    name: '',
    image: '',
    price: '',
  });

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerContact: '',
    notes: '',
  });

  const handleExtractProduct = async () => {
    if (!productUrl.trim()) {
      toast.error('Please enter a product URL');
      return;
    }

    setExtracting(true);
    try {
      // Simulate extraction - in real app this would call an API
      setTimeout(() => {
        // Mock product extraction
        setProductPreview({
          name: 'Sample Japanese Product from ' + source.charAt(0).toUpperCase() + source.slice(1),
          image: 'https://images.pexels.com/photos/3962287/pexels-photo-3962287.jpeg',
          price: 5000 + Math.random() * 10000,
        });
        toast.success('Product information extracted');
      }, 1000);
    } catch (error) {
      toast.error('Failed to extract product information');
    } finally {
      setExtracting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async () => {
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!productPreview?.name) {
      toast.error('Please extract or enter product information');
      return;
    }

    setSubmitting(true);
    try {
      const price = productPreview.price || parseInt(manualProduct.price) || 0;

      const { data, error } = await supabase.from('link_orders').insert([
        {
          product_url: productUrl,
          source: source,
          product_name: productPreview.name || manualProduct.name,
          product_image: productPreview.image || manualProduct.image,
          price_jpy: price,
          status: 'pending',
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_address: formData.customerAddress,
          customer_contact: formData.customerContact,
          notes: formData.notes,
        },
      ]).select();

      if (error) throw error;

      const newOrderId = (data as Array<{ id: string }>)?.[0]?.id || 'pending';
      setOrderId(newOrderId);
      setSubmitted(true);
      toast.success('Order submitted successfully');

      // Reset form
      setProductUrl('');
      setProductPreview(null);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        customerContact: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

              <h1 className="text-4xl font-bold text-foreground mb-4">Order Submitted Successfully</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your order request has been received. Our team will process it and contact you soon.
              </p>

              <Card className="bg-primary/10 border-border mb-8 p-6">
                <p className="text-sm text-muted-foreground mb-2">Your Order ID:</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-secondary font-mono">{orderId}</p>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-primary/20 rounded transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </Card>

              <div className="space-y-4 mb-8 text-left">
                <div className="bg-primary/5 border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Next Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Our team will review your request</li>
                    <li>We'll contact you via phone or Zalo to confirm</li>
                    <li>Payment details will be provided</li>
                    <li>Your products will be shipped after payment confirmation</li>
                  </ol>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="flex-1"
                >
                  Submit Another Order
                </Button>
              </div>
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Order from Link</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Paste a product link from Amazon Japan or Rakuten and we'll help you get it
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1: Product URL */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Step 1: Enter Product Link</h2>

              <div className="space-y-4">
                <div>
                  <Label>Platform</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="amazon"
                        checked={source === 'amazon'}
                        onChange={(e) => setSource(e.target.value as 'amazon' | 'rakuten')}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground">Amazon Japan</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="rakuten"
                        checked={source === 'rakuten'}
                        onChange={(e) => setSource(e.target.value as 'amazon' | 'rakuten')}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground">Rakuten</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="url">Product URL</Label>
                  <Input
                    id="url"
                    placeholder={
                      source === 'amazon'
                        ? 'https://www.amazon.co.jp/...'
                        : 'https://www.rakuten.co.jp/...'
                    }
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleExtractProduct} disabled={extracting || !productUrl} className="w-full">
                  {extracting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    'Extract Product Info'
                  )}
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p>Can't extract the information?</p>
                  <button
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-secondary hover:underline"
                  >
                    Enter product details manually
                  </button>
                </div>

                {showManualInput && (
                  <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-border">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="Enter product name"
                        value={manualProduct.name}
                        onChange={(e) => setManualProduct({ ...manualProduct, name: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productImage">Image URL (optional)</Label>
                      <Input
                        id="productImage"
                        placeholder="https://..."
                        value={manualProduct.image}
                        onChange={(e) => setManualProduct({ ...manualProduct, image: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productPrice">Price (JPY)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        placeholder="5000"
                        value={manualProduct.price}
                        onChange={(e) => setManualProduct({ ...manualProduct, price: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Preview */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Product Preview</h2>

              {productPreview ? (
                <Card className="overflow-hidden">
                  {productPreview.image && (
                    <div className="relative w-full h-48 bg-gray-100">
                      <Image
                        src={productPreview.image}
                        alt={productPreview.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-foreground line-clamp-2">{productPreview.name}</h3>
                    {productPreview.price && (
                      <div>
                        <p className="text-lg font-bold text-secondary">
                          {formatPrice(productPreview.price, 'JPY')}
                        </p>
                        <p className="text-muted-foreground">
                          {formatPrice(convertJpyToVnd(productPreview.price), 'VND')}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="bg-primary/5 border-dashed border-2 p-8 text-center">
                  <p className="text-muted-foreground">Product preview will appear here</p>
                </Card>
              )}
            </div>
          </div>

          {/* Customer Information */}
          {productPreview && (
            <div className="mt-12 pt-12 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Step 2: Your Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
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

                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Additional Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any special requests or notes for your order"
                    value={formData.notes}
                    onChange={handleFormChange}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={submitting}
                size="lg"
                className="w-full mt-8"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Order Request'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
