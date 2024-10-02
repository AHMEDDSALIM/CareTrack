/** @type {import('tailwindcss').Config} */
import { content, plugin } from "flowbite-react/tailwind";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    content({ base: "./" }),
  ],
  theme: {
    extend: {
      animation: {
        showup: "slide_in 0.5s ease-in",
      },
      keyframes: {
        slide_in: {
          "0%": {
            transform: "translateY(-30px)", // Corrected to 'translateY'
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)", // Corrected to 'translateY'
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [plugin()],
};
