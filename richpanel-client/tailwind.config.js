/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root',
  theme: {
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      backgroundImage: theme => ({
        'rectangle-64': "url('/rectangle-64@2x.png')",
        'gradient-linear': 'linear-gradient(90deg, rgba(50,81,163,1) 0%, rgba(0,212,255,1) 100%)',
        'header-pattern': "url('https://d8it4huxumps7.cloudfront.net/uploads/images/6446493de8f5b_detail_header.svg')",
        'cert-img': "url('/cert-sample (1).png')",
      }),
      backgroundSize: {
        'size-contain': 'contain',
      },
      boxShadow: {
        'custom-dark': '0px 22px 36px 0px #06263908',
      },
      colors: {
        primary: '#1d4c91'
      },
      fontFamily: {
        "noto-sans": "'Noto Sans'",
        oswald: "Oswald",
        inter: "Inter",
        tinos: "Tinos",
        "fira-sans": "'Fira Sans'",
      },
      screens: {
        'xs': '478px',
        'sm': '767px',
        'md': '991px',
        'sc': '1134px',
        'lg': '1280px',
        'xl': '1440px',
        'hxl': '1580px',
        '2xl': '1920px',
        '3xl': '2560px',
      },
      fontSize: {
        "13xl": "2rem",
        "77xl": "6rem",
      },
    },
    variants: {
      extend: {
        backdropFilter: ['responsive'],
        display: ['group-hover'],
      },
    },
  },
};