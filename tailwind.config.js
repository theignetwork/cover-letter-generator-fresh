/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors - navy, teal, soft blues
        'background': '#0a0e27',
        'foreground': '#e2e8f0',
        'card': '#151931',
        'card-foreground': '#e2e8f0',
        'primary': '#38b2ac',
        'primary-foreground': '#ffffff',
        'secondary': '#4a5568',
        'secondary-foreground': '#e2e8f0',
        'muted': '#2d3748',
        'muted-foreground': '#a0aec0',
        'accent': '#4fd1c5',
        'accent-foreground': '#0a0e27',
        'destructive': '#f56565',
        'destructive-foreground': '#ffffff',
        'border': '#2d3748',
        'input': '#1a202c',
        'ring': '#4fd1c5',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}