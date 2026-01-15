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
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        dmserif: ["DM Serif Text", "serif"],
        funnelsans: ["Funnel Sans", "sans-serif"],
        newsreader: ["'Newsreader'", "serif"],
        platypi: ["Platypi", "serif"],
        marko: ["Marko One", "serif"],
        cormorant: ['Cormorant Upright', 'serif'],
        munika: ['Munika', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],



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






