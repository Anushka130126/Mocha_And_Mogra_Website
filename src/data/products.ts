export interface Product {
  id: number;
  name: string;
  motif: string;
  price: number;
  priceDisplay: string;
  category: 'Saree' | 'Underskirt';
  personality: string[];
  keywords: string[];
  story: string;
  wearFor: string;
  image: string;
  images: string[];
  color: string;
}

export const products: Product[] = [
  {
    id: 7,
    name: 'SAPPHIRE MOGRA',
    motif: 'Cage',
    price: 9500,
    priceDisplay: '₹9,500',
    category: 'Saree',
    personality: ['Independent', 'Bold', 'Contemporary'],
    keywords: ['Silk', 'Cage Motif', 'Deep Blue', 'Statement'],
    story:
      'The cage motif was my little way of playing with the idea of freedom — because what’s more fun than putting a cage on a saree and then wearing it exactly how you want?',
    wearFor: 'I see this one on the woman who likes her classics with a little bit of edge. Dinner dates, cocktails, gallery evenings — basically anywhere you want someone to stop and ask, “Wait, is that a cage on your saree?”',
    image: '/images/sm1.webp',
    images: ['/images/sm1.webp', '/images/sm2.webm', '/images/sm3.webp', '/images/sm4.webp', '/images/sm5.webp'],
    color: '#8898B8',
  },
  {
    id: 6,
    name: 'BUTTER MOGRA',
    motif: 'Pineapple',
    price: 9500,
    priceDisplay: '₹9,500',
    category: 'Saree',
    personality: ['Sunny', 'Fresh', 'Effortless'],
    keywords: ['Silk', 'Pineapple Motif', 'Butter Yellow', 'Contemporary'],
    story:
      'Can we talk about how butter yellow is having such a moment right now? Gen Z, millennials — everyone seems to be obsessed with it. And then there’s the pineapple. Somehow, the two together just made perfect sense to me. It gives this saree that fresh, playful energy without making it feel too young.',
    wearFor: 'Haldi? Absolutely. Brunch date? Of course. Day wedding? Take her. She’s basically made for happy occasions.',
    image: '/images/bm1.webp',
    images: ['/images/bm1.webp', '/images/bm2.webp', '/images/bm3.webp', '/images/bm4.webp', '/images/bm5.webp'],
    color: '#D4C08A',
  },
  {
    id: 5,
    name: 'RUBY DOE',
    motif: 'Deer',
    price: 9500,
    priceDisplay: '₹9,500',
    category: 'Saree',
    personality: ['Soft', 'Romantic', 'Graceful'],
    keywords: ['Silk', 'Deer Motif', 'Ruby Tones', 'Romantic'],
    story:
      'I imagined Ruby Doe on the girl who has just become a bride — not in a heavy bridal saree, but in that beautiful new-bride phase where you want to wear colour, dress up and still feel like yourself. The little deer motif makes the red feel softer and more playful.',
    wearFor: 'Wear her to a wedding, a bridesmaid moment, an intimate dinner or that first wedding season after you say “I do.”',
    image: '/images/rd1.webp',
    images: ['/images/rd1.webp', '/images/rd2.webp', '/images/rd3.webp', '/images/rd4.webp', '/images/rd5.webp'],
    color: '#B89090',
  },
  {
    id: 1,
    name: 'JALPARIÉ',
    motif: 'Seahorse',
    price: 9500,
    priceDisplay: '₹9,500',
    category: 'Saree',
    personality: ['Elegant', 'Refined', 'Quiet Luxury'],
    keywords: ['Silk', 'Seahorse Motif', 'Artisan Embroidery', 'Premium'],
    story:
      'Think destination wedding by the sea. Barely-there breeze, cocktails at sunset, your hair doing its own thing — and a silk saree with tiny seahorses. This is exactly why I wanted the seahorse on it. It’s unexpected, but somehow feels completely at home.',
    wearFor: 'And honestly? This is the one I’d wear if I wanted people to ask me, “Where is that saree from?”',
    image: '/images/jp1.webp',
    images: ['/images/jp1.webp', '/images/jp2.webp', '/images/jp3.webp'],
    color: '#D4C5B0',
  },
  {
    id: 2,
    name: 'ROSÉ MOGRA',
    motif: 'Owl',
    price: 9500,
    priceDisplay: '₹9,500',
    category: 'Saree',
    personality: ['Confident', 'Intelligent', 'Playful'],
    keywords: ['Silk', 'Owl Motif', 'Rose Tones', 'Artisan Embroidery'],
    story:
      'I wanted something soft and feminine, but then I thought — why should pretty always mean predictable? So came the owl. A little unusual, a little mysterious and definitely not the motif you expect to find on a saree.',
    wearFor: 'I see this one at intimate dinners, date nights, sundowners and those occasions where you want to look pretty but still have something interesting going on.',
    image: '/images/rm1.webp',
    images: ['/images/rm1.webp', '/images/rm2.webp', '/images/rm3.webp', '/images/rm4.webp'],
    color: '#C9B5A8',
  },
  {
    id: 3,
    name: 'RIWAAYAT',
    motif: 'Elephant',
    price: 9500,
    priceDisplay: '₹9,500',
    category: 'Saree',
    personality: ['Heritage', 'Regal', 'Timeless'],
    keywords: ['Silk', 'Elephant Motif', 'Heritage', 'Regal'],
    story:
      'This one is very close to my heart. The elephant felt like the perfect place to start — deeply Indian, instantly recognisable, but playful enough to become something completely new through our patchwork. And you clearly agreed. Riwayaat is our best-seller. The saree that made people stop, ask questions and discover Mocha & Mogra for the first time.',
    wearFor: 'A little bit of our riwayaat, with a lot of our personality.',
    image: '/images/ri1.webp',
    images: ['/images/ri1.webp', '/images/ri2.webp', '/images/ri3.webp', '/images/ri4.webp', '/images/ri5.webp'],
    color: '#B8A898',
  },
  {
    id: 4,
    name: 'SUNDOWNER SILK',
    motif: 'Fish',
    price: 9500,
    priceDisplay: '₹9,500',
    category: 'Saree',
    personality: ['Playful', 'Artistic', 'Free-Spirited'],
    keywords: ['Silk', 'Fish Motif', 'Warm Tones', 'Artisan'],
    story:
      'Two little fish swimming across a silk saree. I don’t know — I just loved the idea. There’s something about this one that feels like holiday energy. A sunset dinner, a beachside celebration, a long evening with nowhere to be.',
    wearFor: 'Basically, the saree equivalent of saying, “Let’s stay for one more drink.”',
    image: '/images/ss1.webp',
    images: ['/images/ss1.webp', '/images/ss2.webp', '/images/ss3.webp', '/images/ss4.webp', '/images/ss5.webp'],
    color: '#C4A882',
  },
  {
    id: 8,
    name: 'CHAANDINI',
    motif: 'Designer Underskirt',
    price: 3500,
    priceDisplay: '₹3,500',
    category: 'Underskirt',
    personality: ['Regal', 'Elegant'],
    keywords: ['Underskirt', 'Silk Lining', 'Petticoat', 'Essential'],
    story:
      'I wanted the saree to move. So I made the underskirt ridiculously flared. The kind that gives your saree that gorgeous swish when you walk, sit, twirl — basically whenever you feel like being a little dramatic.',
    wearFor: 'You won’t necessarily see Chaandini. But you’ll definitely notice what she does.',
    image: '/images/riwaayat.webp',
    images: ['/images/riwaayat.webp'],
    color: '#D8D0C4',
  },
];
