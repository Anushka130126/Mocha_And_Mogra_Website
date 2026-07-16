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
  color: string;
}

export const products: Product[] = [
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
      'Jalparié is named for the water-spirit of old Indian folklore — graceful, elusive, and utterly compelling. The seahorse motif, rendered in meticulous artisan embroidery, speaks to those who move through the world with effortless refinement. She does not seek attention. She commands it.',
    wearFor: 'Intimate dinners, art gallery openings, quiet celebrations of the self.',
    image: '/images/jalparie.webp',
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
      'The owl has long been the keeper of wisdom — but Rosé Mogra knows that wisdom can be joyful. Blush undertones meet crisp ivory silk in a saree that is at once serious and delightful. She is the woman in the room who has read every book and still laughs the loudest.',
    wearFor: 'Weddings you attend as a guest worth remembering. Board presentations. Sunset ceremonies.',
    image: '/images/rose_mogra.webp',
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
      'Riwaayat means tradition — but not the kind that binds. The kind that grounds. The elephant, India\'s most sacred symbol of memory and matriarchal strength, is woven into every drape of this saree. For the woman who carries history forward without being weighed down by it.',
    wearFor: 'Family milestones. Temple visits. The moments you want to remember forever.',
    image: '/images/riwaayat.webp',
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
      'Sunset light on still water. That is the feeling Sundowner Silk was made to hold. The fish motif dances across the fabric like ripples — fluid, carefree, impossible to pin down. For the creative soul who dresses like a poem.',
    wearFor: 'Rooftop evenings, art shows, the kind of gatherings that turn into memories.',
    image: '/images/sundowner_silk.webp',
    color: '#C4A882',
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
      'Ruby Doe is a love letter — to softness, to femininity, to the beauty of vulnerability worn with grace. The deer motif is delicate yet present, much like the woman who wears this saree: gentle in spirit, certain in presence. Deep ruby silk warms the skin like late afternoon light.',
    wearFor: 'Engagement ceremonies, anniversary dinners, moments of quiet romance.',
    image: '/images/ruby_doe.webp',
    color: '#B89090',
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
      'Butter Mogra is the feeling of a perfect morning — warm, unhurried, bright without effort. The pineapple, a symbol of hospitality and warmth across cultures, appears in playful precision across soft butter-yellow silk. This is the saree you reach for when you want to feel like sunshine.',
    wearFor: 'Daytime celebrations, baby showers, festive mornings, haldi ceremonies.',
    image: '/images/butter_mogra.webp',
    color: '#D4C08A',
  },
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
      'The cage motif on Sapphire Mogra is not about confinement — it is about choice. She who wears this saree opens every door herself. Deep sapphire silk grounds the design with commanding authority while the geometric embroidery speaks a contemporary language rooted in ancient craft.',
    wearFor: 'Power meetings, cultural events, evenings where you intend to be unforgettable.',
    image: '/images/sapphire_mogra.webp',
    color: '#8898B8',
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
      'Every great story has a foundation. Chaandini — moonlit, luminous — is the underskirt your saree deserves. Designed to drape perfectly and move gracefully, it is crafted in the same premium silk sensibility as every Mocha & Mogra piece. Because the details that no one sees matter most.',
    wearFor: 'The perfect companion to any Mocha & Mogra saree.',
    image: '/images/riwaayat.webp',
    color: '#D8D0C4',
  },
];
