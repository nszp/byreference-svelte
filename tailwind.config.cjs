const config = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        'lilith': '#A6344D',
        'blurple': '#5865F2',
        'lgray': {
          700: '#2b2b2b',
          750: '#222222',
          800: '#1E1E1E',
          900: '#171717'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

module.exports = config;
