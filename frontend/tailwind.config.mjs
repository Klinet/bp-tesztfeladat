import plugin from 'tailwindcss/plugin';

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".lx-center": { left: "50%", transform: "translateX(-50%)" },
        ".ly-center": { top: "50%", transform: "translateY(-50%)" },
      });
    }),
  ],
};

export default config;