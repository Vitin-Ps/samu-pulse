/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pastoral: {
          bg: '#EFF7F6',
          text: '#1F2D3A',
          border: '#DDE9E8',
          neutral: '#95A5A6',

          primary: {
            lighter: '#E6F2FA',
            light: '#5AA7E2',
            DEFAULT: '#2587D7',
            dark: '#1B66A4',
            darker: '#12446E',
          },

          accent: {
            lighter: '#FFF9E6',
            light: '#D4B05F',
            DEFAULT: '#C4983A',
            dark: '#9E782B',
            darker: '#75581F',
          },

          success: {
            lighter: '#EAF4F2',
            light: '#72BCB0',
            DEFAULT: '#48A999',
            dark: '#357C70',
            darker: '#22524A',
          },

          warning: {
            lighter: '#FCF3E6',
            light: '#F7B748',
            DEFAULT: '#F39C12',
            dark: '#C27D0E',
            darker: '#915E0A',
          },

          danger: {
            lighter: '#FADBD8',
            light: '#E37A76',
            DEFAULT: '#D9534F',
            dark: '#AE3F3B',
            darker: '#832E2C',
          },
        },
      },
    },
  },
  plugins: [],
};
