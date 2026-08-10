import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl md:text-4xl tracking-widest text-mocha-900 uppercase mb-8">
            Privacy Policy
          </h1>
          <div className="font-lora text-mocha-600 space-y-6 leading-relaxed">
            <p>
              At Mocha & Mogra, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or make a purchase.
            </p>
            <h2 className="font-cinzel text-xl text-mocha-900 tracking-wider uppercase mt-8 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact us. This may include your name, email address, shipping address, and payment details.
            </p>
            <h2 className="font-cinzel text-xl text-mocha-900 tracking-wider uppercase mt-8 mb-4">How We Use Your Information</h2>
            <p>
              Your information is used to process your orders, communicate with you about your purchases, and, if you opt-in, to send you updates about new collections and exclusive offers. We do not sell your personal information to third parties.
            </p>
            <h2 className="font-cinzel text-xl text-mocha-900 tracking-wider uppercase mt-8 mb-4">Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. All sensitive payment information is processed through secure, encrypted gateways and is not stored on our servers.
            </p>
            <h2 className="font-cinzel text-xl text-mocha-900 tracking-wider uppercase mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@mochamogra.com" className="text-gold-600 hover:underline">hello@mochamogra.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
