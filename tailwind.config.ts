import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        principalColor: 'var(--principalColor)',
        firstColor: 'var(--firstColor)',
        secondColor: 'var(--secondColor)',
        thirdColor: 'var(--thirdColor)',
        fourthColor: 'var(--fourthColor)',
        fifthColor: 'var(--fifthColor)',
        sixthColor: 'var(--sixthColor)',
        seventhColor: 'var(--seventhColor)',
        eighthColor: 'var(--eighthColor)',
        ninthColor: 'var(--ninthColor)'
      },
    },
  },
  plugins: [],
};

export default config;