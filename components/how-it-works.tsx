import { Search, ShoppingBag, Truck } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Select',
      description:
        'Explore our collection of hot products or paste a link from Amazon Japan or Rakuten to find exactly what you want.',
    },
    {
      icon: ShoppingBag,
      title: 'Add to Cart & Checkout',
      description:
        'Add items to your cart, provide shipping details, and submit your order. Payment through bank transfer or Zalo.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description:
        'We process your order and arrange shipment. Receive your authentic Japanese products within 7 days.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent process to get your Japanese products delivered to your door
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative z-10">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full h-1 bg-primary/10 z-0" />

                  <h3 className="text-xl font-semibold text-foreground mb-3 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center text-sm">{step.description}</p>

                  <div className="mt-6 text-sm font-semibold text-secondary">Step {index + 1}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-primary/10 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">Typical Timeline</p>
          <p className="text-2xl font-bold text-secondary">1-2 days processing + 5-7 days delivery</p>
        </div>
      </div>
    </section>
  );
}
