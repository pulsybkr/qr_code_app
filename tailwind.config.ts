import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		colors: {
			primary: {
			  light: '#3B82F6', // blue-500
			  dark: '#60A5FA', // blue-400
			},
			secondary: {
			  light: '#1F2937', // gray-800
			  dark: '#F3F4F6', // gray-100
			},
			background: {
			  light: '#FFFFFF',
			  dark: '#111827', // gray-900
			},
			surface: {
			  light: '#F9FAFB', // gray-50
			  dark: '#1F2937', // gray-800
			},
		  },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
