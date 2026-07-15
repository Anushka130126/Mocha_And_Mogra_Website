/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        lora: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        mocha: {
          50:  '#FAF5EF',
          100: '#F4E9D9',
          200: '#E8D0B0',
          300: '#D4AD7A',
          400: '#C4904E',
          500: '#A67340',
          600: '#7D5530',
          700: '#5C3D22',
          800: '#3D2814',
          900: '#1E140A',
        },
        gold: {
          50:  '#FFFEF7',
          100: '#FFF8D6',
          200: '#FDF5E6',
          300: '#FCEABB',
          400: '#F5D680',
          500: '#E8B84B',
          600: '#C99A2E',
          700: '#A07520',
          800: '#6B4F15',
          900: '#3D2D0A',
        },
        forest: {
          50:  '#F0F4F0',
          100: '#D9E8D9',
          200: '#A8C9A8',
          300: '#72A872',
          400: '#4A884A',
          500: '#2D6A2D',
          600: '#1E4D1E',
          700: '#133313',
          800: '#0A1F0A',
          900: '#050F05',
        },
        cream: {
          50:  '#FFFEF9',
          100: '#FFFCF0',
          200: '#FFF8D6',
          300: '#FDF5E6',
          400: '#FCEABB',
          500: '#F5DFA0',
        },
      },
      backgroundImage: {
        'silk-gradient': 'radial-gradient(ellipse at 30% 20%, #FFF8D6 0%, #FDF5E6 40%, #FCEABB 70%, #FFF8D6 100%)',
        'silk-hero': 'linear-gradient(135deg, #FFFEF7 0%, #FFF8D6 25%, #FDF5E6 50%, #FCEABB 75%, #FFF8D6 100%)',
      },
      borderRadius: {
        'arch': '50% 50% 0 0 / 40% 40% 0 0',
      },
    },
  },
  plugins: [],
};
