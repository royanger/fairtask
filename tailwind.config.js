/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			poppins: ['Poppins', 'sans-serif'],
			sfprodisplay: ['SF Pro Display', 'sans-serif'],
		},
		extend: {
			colors: {
				green: {
					200: '#B1C4C4',
					300: '#83A1A1',
					DEFAULT: '#324646',
					500: '#324646',
				},
				blue: {
					DEFAULT: '#5966DB',
				},
				black: {
					DEFAULT: '#000000',
				},
				background: {
					DEFAULT: '#F5F5F5',
				},
				grey: {
					100: '#EAEBEC',
					DEFAULT: '#D1D1D6',
				},
			},
		},
	},
	plugins: [],
};
