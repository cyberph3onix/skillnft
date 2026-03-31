import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: {
          yellow: '#FFFF00',
          blue: '#0066FF',
          red: '#FF0000',
          green: '#00FF00',
        },
      },
      borderWidth: {
        brutal: '4px',
        'brutal-lg': '6px',
      },
      boxShadow: {
        brutal: '8px 8px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '12px 12px 0px rgba(0, 0, 0, 1)',
        'brutal-offset': '6px 6px 0px rgba(0, 0, 0, 1)',
      },
      spacing: {
        brutal: '16px',
      },
    },
  },
  plugins: [],
}
export default config
