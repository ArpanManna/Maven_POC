/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      transparent: "transparent",
      blue: colors.blue,
      black: colors.black,
      orange: colors.orange,
      green: colors.green,
      white: colors.white,
      gray: colors.gray,
      cyan: colors.cyan,
      purple: colors.purple,
      palatte1: "#44318D",  //blue
      palatte2: "#E98074",  //light
      palatte3: "#2A1B3D",  //dark
      palatte4: "#D83F87",  // red
      palatte5: "#A4B3B6"   // greenish
    },
  },
  plugins: [],
}
