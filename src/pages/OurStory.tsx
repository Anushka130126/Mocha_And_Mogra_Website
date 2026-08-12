import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const values = [
  { label: 'Story Before Trend', desc: 'Every piece begins with a narrative, not a mood board.' },
  { label: 'Craft Before Mass Production', desc: 'We work slowly, deliberately, and with extraordinary skill.' },
  { label: 'Quiet Luxury Over Loud Fashion', desc: 'The finest things whisper. They never shout.' },
  { label: 'Contemporary Design Rooted in Indian Heritage', desc: 'We honor the past by reimagining it for the present.' },
  { label: 'Pieces That Become Future Heirlooms', desc: "We make things that will matter to someone who hasn't been born yet." },
];

export default function OurStory() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-0">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-label mb-4"
        >
          Who We Are
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-cinzel text-4xl md:text-6xl tracking-widest text-mocha-900 uppercase"
        >
          Our Story
        </motion.h1>
      </div>

      {/* Full-width opening image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[50vh] lg:h-[65vh] overflow-hidden mb-24 bg-mocha-100"
      >
        <img
          src="/images/modelslandscape.webp"
          alt="Mocha & Mogra atelier"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </motion.div>

      {/* The Vision */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 text-center mb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="section-label mb-8">The Vision</p>
          <h2 className="font-cinzel text-2xl md:text-3xl tracking-wider text-mocha-900 uppercase mb-10">
            The Vision
          </h2>
          <blockquote className="font-playfair text-2xl md:text-3xl lg:text-4xl italic text-mocha-700 leading-relaxed mb-10">
            "Luxury, for me, has never been about loud logos. It's about thoughtful design. Beautiful craftsmanship."
          </blockquote>
          <p className="font-lora text-base text-mocha-600 leading-relaxed">
            We believe in creating contemporary silhouettes that honor the past while embracing the present. Our vision is to clothe the modern woman in timeless pieces, empowering her to carry forward the legacy of our cultural heritage with pride, elegance, and a sense of belonging to a larger narrative.
          </p>
        </motion.div>
      </section>

      {/* Divider ornament */}
      <div className="flex justify-center mb-24">
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-mocha-300" />
          <img src="/images/mnmlogo-Photoroom.webp" alt="" className="h-8 w-8 object-contain opacity-40" loading="lazy" />
          <div className="w-16 h-px bg-mocha-300" />
        </div>
      </div>

      {/* The Founder's Journey */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">The Founder</p>
          <h2 className="font-cinzel text-2xl md:text-3xl tracking-wider text-mocha-900 uppercase">
            The Founder's Journey
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="arch-container-lg overflow-hidden bg-mocha-100 shadow-xl"
            style={{ aspectRatio: '4/5' }}
          >
            <img
              src="/images/modelwalkinginriwaayat.webp"
              alt="The Founder"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-playfair text-3xl text-mocha-900 mb-6">
              Rooted in Tradition.
            </h3>
            <p className="font-lora text-base text-mocha-600 leading-relaxed mb-6">
              We are a tribute to the rich tapestry of Indian textiles, born from a desire to preserve and celebrate centuries-old craftsmanship.
            </p>
            <p className="font-lora text-base text-mocha-600 leading-relaxed mb-6">
              Our journey began with a deep respect for the hands that weave magic into every thread, passing down techniques that have defined our cultural narrative for generations.
            </p>
            <p className="font-lora text-base text-mocha-600 leading-relaxed mb-10">
              I wanted to create something timeless, yet fresh. Something rooted in Indian craftsmanship but designed for the modern woman who wears her personality as confidently as she wears her clothes. The saree had always been saved for "special occasions" in our homes — I wanted to change that. Every day she wears something beautiful is a special occasion.
            </p>
            <p className="font-playfair text-lg italic text-mocha-700">
              — Founder, Mocha &amp; Mogra
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Craft */}
      <section className="bg-mocha-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-gold-500 mb-4">
              How We Make
            </p>
            <h2 className="font-cinzel text-3xl md:text-4xl tracking-wider text-gold-200 uppercase">
              Our Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="font-playfair text-3xl text-gold-200 mb-6">
                Artisan-Led Excellence.
              </h3>
              <p className="font-lora text-sm text-mocha-300 leading-relaxed mb-6">
                Each piece is a labor of love, meticulously handcrafted by skilled artisans across regions known for their distinct textile heritage.
              </p>
              <p className="font-lora text-sm text-mocha-300 leading-relaxed mb-6">
                From delicate thread work to vibrant block printing, we ensure that every detail tells a story of skill, patience, and dedication to the craft.
              </p>
              <p className="font-lora text-sm text-mocha-300 leading-relaxed">
                Our artisan-led machine embroidery bridges the gap between traditional technique and contemporary precision — creating motifs that are both timeless and modern.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="arch-container-lg overflow-hidden bg-mocha-700 shadow-2xl"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src="/images/machine.webp"
                alt="Artisan craftsmanship"
                className="w-full h-full object-cover opacity-90"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-24 max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="section-label mb-4">What We Stand For</p>
          <h2 className="font-cinzel text-3xl md:text-4xl tracking-wider text-mocha-900 uppercase">
            Brand Values
          </h2>
        </div>

        <div className="space-y-0">
          {values.map((value, i) => (
            <motion.div
              key={value.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex gap-6 py-8 border-b border-mocha-200 group"
            >
              <div className="flex-shrink-0 w-8 flex items-start pt-1">
                <span className="font-cinzel text-xs text-gold-500">0{i + 1}</span>
              </div>
              <div>
                <h3 className="font-playfair text-xl text-mocha-900 mb-2 group-hover:text-mocha-700 transition-colors">
                  {value.label}
                </h3>
                <p className="font-lora text-sm text-mocha-500 leading-relaxed">{value.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-[#FFFEF7] border-t border-mocha-200">
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-playfair text-3xl text-mocha-900 mb-6">
              Find your story.
            </h3>
            <p className="font-lora text-sm text-mocha-600 leading-relaxed mb-10">
              Each Mocha & Mogra saree is waiting for the woman it was made for. Browse the collection and discover which one speaks to you.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary"
            >
              Shop the Collection <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
