const defaultTheme = require("tailwindcss/defaultTheme");
const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        float: "float 5s ease-in-out infinite",
        aurora: "auroraMove 6s infinite alternate ease-in-out",
        auroraParallax: "auroraParallax 7s infinite ease-in-out alternate",



        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",


      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        auroraMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        auroraParallax: {
          "0%": { backgroundPosition: "0% 50%" },
          "25%": { backgroundPosition: "25% 55%" },
          "50%": { backgroundPosition: "50% 45%" },
          "75%": { backgroundPosition: "75% 55%" },
          "100%": { backgroundPosition: "100% 50%" },
        },

        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      fontFamily: {
        dmserif: ["DM Serif Text", "serif"],
        funnelsans: ["Funnel Sans", "sans-serif"],
        newsreader: ["'Newsreader'", "serif"],
        platypi: ["Platypi", "serif"],
        marko: ["Marko One", "serif"],
        cormorant: ['Cormorant Upright', 'serif'],
        lato: ["Lato", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        munika: ['Munika', 'sans-serif'],
        nunito: ["Nunito Sans", "sans-serif"],
        isidora:["Isidora Soft", "sans-serif"],
        bump:["LT Bump SmRd","sans-serif"]
        







      },
    },
  },
  plugins: [addVariablesForColors,
    require('tailwind-scrollbar-hide'),
    addVariablesForColors,
    function ({
      matchUtilities,
      theme
    }) {
      matchUtilities({
        "bg-dot-thick": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
          )}")`,
        }),
      }, { values: flattenColorPalette(theme("backgroundColor")), type: "color" });
    },



  ],
};

function addVariablesForColors({
  addBase,
  theme
}) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({
    ":root": newVars,
  });
}






