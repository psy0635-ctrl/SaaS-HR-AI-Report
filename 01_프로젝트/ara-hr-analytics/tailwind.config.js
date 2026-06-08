/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ara-bg': '#F7FBFC',
        'ara-surface': '#FFFFFF',
        'ara-navy': '#0F1C2E',
        'ara-teal': '#1AB8A6',
        'ara-teal-hover': '#159E8F',
        'ara-gold': '#F5A623',
        'ara-blue': '#2563EB',
        'ara-red': '#E24B4A',
        'ara-green': '#27AE60',
        'ara-muted': '#6B7280',
        'ara-border': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Pretendard', 'SUIT', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'modal': '20px',
      },
      boxShadow: {
        'premium': '0 2px 12px rgba(0,0,0,0.06)',
        'premium-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'teal-glow': '0 0 15px rgba(26, 184, 166, 0.4)',
        'gold-glow': '0 0 15px rgba(245, 166, 35, 0.4)',
        'blue-glow': '0 0 15px rgba(37, 99, 235, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
