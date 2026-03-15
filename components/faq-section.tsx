'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How long does delivery take?',
    answer:
      'Orders typically take 1-2 business days to process, followed by 5-7 business days for delivery to Vietnam. During peak seasons, delivery may take slightly longer.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept bank transfers and payments via Zalo or Facebook. After placing your order, our team will contact you with payment details and instructions.',
  },
  {
    question: 'Can I paste a product link from any website?',
    answer:
      'Currently, we support links from Amazon Japan and Rakuten. If you have a link from another source, please contact us and we can help you find it on our supported platforms.',
  },
  {
    question: 'Are the products authentic?',
    answer:
      'Yes, all our products are sourced directly from official retailers. We guarantee authenticity for all items sold through our platform.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Products can be returned within 30 days of delivery if they are unopened and in original condition. Please contact our support team to initiate a return.',
  },
  {
    question: 'Do you ship to all locations in Vietnam?',
    answer:
      'We deliver to most locations in Vietnam. Some remote areas may require additional shipping fees. Enter your address during checkout to see if we deliver to your area.',
  },
  {
    question: 'Can I modify my order after placing it?',
    answer:
      'If your order is still in "pending" status, you can contact us via Zalo or Facebook to request modifications. Once it enters "processing" status, changes may not be possible.',
  },
  {
    question: 'What if my product arrives damaged?',
    answer:
      'If your product arrives damaged, please contact us immediately with photos of the damage. We will arrange a replacement or refund at no additional cost.',
  },
];

export function FAQSection() {
  return (
    <section className="py-16 sm:py-24 bg-primary/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about ordering with us
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-primary/10 text-left font-semibold text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-muted-foreground bg-primary/5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
