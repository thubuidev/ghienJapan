import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-2">🎌 Order Japan</div>
            <p className="text-sm text-gray-200">
              Fast and reliable Japanese product ordering service for Vietnam
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#hot-products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/order-from-link" className="hover:text-primary transition-colors">
                  Order from Link
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <div className="text-sm text-gray-200">
              <p>Monday - Friday: 9:00 - 18:00</p>
              <p>Saturday: 10:00 - 16:00</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+84123456789" className="hover:text-primary transition-colors">
                  +84 (0) 123 456 789
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@orderjapan.vn" className="hover:text-primary transition-colors">
                  info@orderjapan.vn
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-200 mb-4 md:mb-0">
              &copy; 2024 Order Japan. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-white hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-colors"
                aria-label="Zalo"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
