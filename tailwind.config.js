// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandPurple: "#633cff",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // poppins: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
