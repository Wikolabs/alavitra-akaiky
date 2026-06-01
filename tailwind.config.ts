import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",900:"#0c4a6e" }
      },
      fontFamily: { display:["'Space Grotesk'","sans-serif"], body:["'Inter'","sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
