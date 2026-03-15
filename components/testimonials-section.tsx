import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Nguyen Thi Linh',
    location: 'Ho Chi Minh City',
    rating: 5,
    text: 'Super fast delivery! The product quality is excellent and exactly as described. Will definitely order again.',
  },
  {
    name: 'Tran Van An',
    location: 'Hanoi',
    rating: 5,
    text: 'Great service and competitive prices. The ordering process is simple and the team is very responsive.',
  },
  {
    name: 'Le Thu Huong',
    location: 'Da Nang',
    rating: 5,
    text: 'I love being able to paste a product link directly. Makes it so easy to get exactly what I want from Japan.',
  },
  {
    name: 'Pham Duc Thanh',
    location: 'Can Tho',
    rating: 5,
    text: 'Trustworthy seller with authentic products. Their customer service is helpful and friendly.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied customers who trust Order Japan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
