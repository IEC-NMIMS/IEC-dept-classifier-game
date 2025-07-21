/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/**/*.{js,ts,jsx,tsx,css}",
    "./app/components/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/api/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/page/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/layout/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/components/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/pages/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/styles/**/*.{js,ts,jsx,tsx,css}",
    "./app/app/globals.css",
    "./app/globals.css",
  ],
  theme: {
    extend: {
      maxWidth: {
        '2xl': '42rem',
        '4xl': '56rem',
      },
    },
  },
  plugins: [],
}