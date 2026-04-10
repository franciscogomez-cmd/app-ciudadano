/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0B5FFF",
          secondary: "#16A34A",
        },
      },
      fontFamily: {
        ubuntu: ["Ubuntu-Regular"],
        "ubuntu-medium": ["Ubuntu-Medium"],
        "ubuntu-bold": ["Ubuntu-Bold"],
      },
    },
  },
};
