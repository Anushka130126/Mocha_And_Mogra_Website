import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Feather } from 'lucide-react';
import { products } from '../data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const motifIcons = ['Fish', 'Pineapple', 'Owl', 'Elephant', 'Seahorse'];

export default function Home() {
  const navigate = useNavigate();
  const featured = products.slice(0, 3);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="min-h-[92vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-8 h-px bg-mocha-400" />
                <span className="section-label text-[10px]">Modern Sarees. Timeless Stories.</span>
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="font-playfair text-5xl md:text-6xl lg:text-7xl text-mocha-900 leading-[1.1] mb-8"
              >
                A Collection<br />
                of Stories,<br />
                <em className="not-italic text-mocha-600">Stitched in Silk.</em>
              </motion.h1>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 mb-10"
              >
                <div className="w-12 h-px bg-mocha-300" />
                <Feather size={12} className="text-gold-600" strokeWidth={1.5} />
                <div className="w-12 h-px bg-mocha-300" />
              </motion.div>

              <motion.p
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="font-lora text-lg text-mocha-600 leading-relaxed mb-12 max-w-md"
              >
                Each piece carries a mood, a motif, and a moment.
              </motion.p>

              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => navigate('/shop')}
                  className="btn-primary"
                >
                  Explore Collection
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => navigate('/our-story')}
                  className="font-cinzel text-xs tracking-[0.2em] uppercase text-mocha-500 hover:text-mocha-800 transition-colors py-3 flex items-center gap-2"
                >
                  Our Story
                </button>
              </motion.div>
            </div>

            {/* Hero Image — arch */}
            <motion.div
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="relative w-full max-w-sm">
                <div
                  className="arch-container-lg w-full overflow-hidden bg-mocha-100 shadow-2xl"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src="/images/modelslandscape.webp"
                    alt="Mocha & Mogra saree"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating tag */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -right-6 bottom-24 bg-mocha-900 text-gold-200 px-4 py-3 shadow-lg"
                >
                  <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase">New Arrivals</p>
                  <p className="font-playfair text-sm mt-0.5">8 Pieces</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motif Strip */}
      <section className="border-y border-mocha-200 py-6 overflow-hidden">
        <div className="flex gap-0 items-center">
          {[...motifIcons, ...motifIcons].map((motif, i) => (
            <div key={i} className="flex items-center gap-6 px-8 flex-shrink-0">
              <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-400">
                {motif}
              </span>
              {i < [...motifIcons, ...motifIcons].length - 1 && (
                <span className="text-gold-400">·</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Brand Teaser */}
      <section className="py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="arch-container overflow-hidden bg-mocha-100 col-span-1 row-span-2"
                style={{ aspectRatio: '3/5' }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src="/images/jalparie.webp"
                  alt="Saree"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="arch-container overflow-hidden bg-mocha-50 aspect-square"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <img
                  src="/images/coverpiccloseup.webp"
                  alt="Saree"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="arch-container overflow-hidden bg-mocha-100 aspect-square"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <img
                  src="/images/coverpicrubydoecloseup.webp"
                  alt="Saree"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="section-label mb-6">The Brand</p>
              <h2 className="font-playfair text-4xl lg:text-5xl text-mocha-900 leading-tight mb-8">
                Inspired by Heritage.<br />
                <em>Designed for Today.</em>
              </h2>
              <p className="font-lora text-base text-mocha-600 leading-relaxed mb-6">
                Mocha & Mogra is a contemporary premium saree label that celebrates storytelling through design. Every saree is crafted in premium silk and brought to life with artisan-led machine embroidery.
              </p>
              <p className="font-lora text-base text-mocha-600 leading-relaxed mb-10">
                We aren&apos;t creating seasonal collections. We are creating stories women can wear.
              </p>
              <button
                onClick={() => navigate('/our-story')}
                className="btn-primary"
              >
                Our Story <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-28 bg-mocha-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-gold-500 mb-4">
              The Collection
            </p>
            <h2 className="font-playfair text-4xl lg:text-5xl text-gold-200">
              Stories Worth Wearing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="group cursor-pointer"
                onClick={() => navigate('/shop')}
              >
                <div
                  className="arch-container overflow-hidden bg-mocha-700 mb-5 transition-transform duration-500 group-hover:-translate-y-1"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="font-cinzel text-xs tracking-[0.2em] uppercase text-gold-400 mb-1">
                  {product.name}
                </p>
                <p className="font-lora text-sm text-mocha-400">{product.priceDisplay}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 border border-gold-500 text-gold-300 font-cinzel text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-gold-500 hover:text-mocha-900 transition-all duration-300"
            >
              View All Pieces <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      {/* Values Strip */}
      <section className="py-20 bg-[#FFFEF7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Artisan-Led\nCraftsmanship', icon: '✦' },
              { label: 'Timeless\nYet Contemporary', icon: '✦' },
              { label: 'Thoughtful\nDetails', icon: '✦' },
              { label: 'Made to Be\nCherished', icon: '✦' },
            ].map(({ label, icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-gold-500 text-lg">{icon}</span>
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-600 whitespace-pre-line leading-5">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-px h-16 bg-mocha-300 mx-auto mb-10" />
            <blockquote className="font-playfair text-2xl md:text-3xl lg:text-4xl italic text-mocha-800 leading-relaxed mb-10">
              "Luxury, for me, has never been about loud logos. It is about thoughtful design. Beautiful craftsmanship."
            </blockquote>
            <p className="section-label">— Founder, Mocha & Mogra</p>
            <div className="w-px h-16 bg-mocha-300 mx-auto mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-mocha-200">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="section-label mb-4">Stay in the Story</p>
          <h3 className="font-playfair text-3xl text-mocha-900 mb-6">
            Be the first to know.
          </h3>
          <p className="font-lora text-sm text-mocha-600 mb-8 leading-relaxed">
            New pieces, behind-the-scenes stories, and quiet moments from the atelier — delivered thoughtfully.
          </p>
          <div className="flex gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 input-field border-b border-r-0 border-mocha-300 px-0 pr-4"
            />
            <button className="btn-primary-filled text-xs px-6 py-3">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
