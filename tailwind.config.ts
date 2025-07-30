
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Space Grotesk"', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'roll-up': {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pop-burst': {
            '0%': { transform: 'scale(1)', opacity: '1' },
            '50%': { transform: 'scale(1.4)', opacity: '1' },
            '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'arrested': {
          '0%': {
            'color': '#ff0000',
            'text-shadow': '0 0 10px #ff0000, 0 0 20px #ff0000',
            transform: 'scale(1.2) rotate(-2deg)'
          },
          '50%': {
            'color': 'white',
            'text-shadow': '0 0 10px #fff, 0 0 20px #fff',
            transform: 'scale(1.25) rotate(2deg)'
          },
          '100%': {
            'color': '#ff0000',
            'text-shadow': '0 0 10px #ff0000, 0 0 20px #ff0000',
            transform: 'scale(1.2) rotate(-2deg)'
          }
        },
        'police-lights': {
            '0%, 100%': {
                'border-color': '#0000ff',
                'box-shadow': '0 0 20px #0000ff, inset 0 0 10px #0000ff',
                'background-color': 'rgba(0, 0, 255, 0.1)'
            },
            '50%': {
                'border-color': '#ff0000',
                'box-shadow': '0 0 30px #ff0000, inset 0 0 20px #ff0000',
                'background-color': 'rgba(255, 0, 0, 0.1)'
            }
        },
        'spotlight-scan': {
            '0%': { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0.5' },
            '50%': { transform: 'translateX(100%) skewX(-15deg)', opacity: '1' },
            '100%': { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0.5' },
        },
        'chase-lights': {
            '0%': { 'background-position': '-100vw 0' },
            '100%': { 'background-position': '100vw 0' },
        },
        'emergency-title': {
            '0%, 100%': {
                color: '#ff4d4d',
                'text-shadow': '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000',
                transform: 'scale(1) skew(-1deg)',
            },
            '50%': {
                color: '#4d4dff',
                'text-shadow': '0 0 10px #0000ff, 0 0 20px #0000ff, 0 0 30px #0000ff',
                transform: 'scale(1.02) skew(1deg)',
            },
        },
        'glow-red-text': {
          '0%, 100%': {
              'text-shadow': '0 0 5px #ff0000, 0 0 10px #ff0000',
              color: '#ff4d4d',
          },
          '50%': {
              'text-shadow': '0 0 2px #ff0000, 0 0 5px #ff0000',
              color: '#ff8080',
          }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin-slow 5s linear infinite',
        'roll-up': 'roll-up 0.5s ease-out forwards',
        'pop-burst': 'pop-burst 0.5s ease-out',
        'arrested': 'arrested 0.5s infinite ease-in-out',
        'police-lights': 'police-lights 0.5s infinite',
        'glow-green-text': 'glow-green-text 1.5s infinite ease-in-out',
        'spotlight-scan': 'spotlight-scan 3s infinite linear',
        'chase-lights': 'chase-lights 2s linear infinite',
        'emergency-title': 'emergency-title 0.5s infinite ease-in-out',
        'glow-red-text': 'glow-red-text 1.5s infinite ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

    
