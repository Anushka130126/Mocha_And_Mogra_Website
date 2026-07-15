import { NavLink } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-mocha-200 bg-mocha-900 text-gold-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/image.png"
                alt="Mocha & Mogra"
                className="h-10 w-10 object-contain brightness-0 invert opacity-80"
              />
              <span className="font-playfair text-xl font-bold text-gold-200">
                Mocha &amp; Mogra
              </span>
            </div>
            <p className="font-lora text-sm text-mocha-300 leading-relaxed max-w-xs">
              Bridging ancient Indian textile heritage with contemporary minimalist luxury. Slow fashion for the discerning soul.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="mailto:hello@mochamogra.com"
                aria-label="Email"
                className="text-mocha-400 hover:text-gold-300 transition-colors"
              >
                <Mail size={18} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-mocha-400 hover:text-gold-300 transition-colors"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-cinzel text-xs tracking-[0.25em] uppercase text-gold-500 mb-5">
              Discover
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop', path: '/shop' },
                { label: 'Our Story', path: '/our-story' },
                { label: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className="font-lora text-sm text-mocha-400 hover:text-gold-300 transition-colors"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Ethics & Legal */}
          <div>
            <h4 className="font-cinzel text-xs tracking-[0.25em] uppercase text-gold-500 mb-5">
              Ethics &amp; Craft
            </h4>
            <ul className="space-y-3 mb-8">
              {['Artisan-led', 'Timeless Design', 'Ethical Sourcing', 'Sustainability'].map(
                (item) => (
                  <li key={item}>
                    <span className="font-lora text-sm text-mocha-400">{item}</span>
                  </li>
                )
              )}
            </ul>
            <h4 className="font-cinzel text-xs tracking-[0.25em] uppercase text-gold-500 mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-lora text-sm text-mocha-400 hover:text-gold-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-mocha-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-lora text-xs text-mocha-500">
            &copy; 2024 Mocha &amp; Mogra. Handcrafted with Grace.
          </p>
          <p className="font-cinzel text-xs tracking-[0.2em] text-mocha-500 uppercase">
            Story Before Trend
          </p>
        </div>
      </div>
    </footer>
  );
}
