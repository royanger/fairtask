/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			poppins: ['Poppins', 'sans-serif'],
			sfprodisplay: ['SF Pro Display', 'sans-serif'],
			inter: ['Inter', 'sans-serif'],
		},
		extend: {
			colors: {
				green: {
					200: '#B1C4C4',
					300: '#83A1A1',
					400: '#667373',
					DEFAULT: '#324646',
					500: '#324646',
				},
				blue: {
					DEFAULT: '#5966DB',
					700: '#0601B4',
				},
				pink: {
					DEFAULT: '#EEA1C5',
				},
				black: {
					DEFAULT: '#000000',
				},
				background: {
					DEFAULT: '#F5F5F5',
				},
				grey: {
					50: '#F1F1F1',
					100: '#EAEBEC',
					300: '#D1D1D6',
					DEFAULT: '#D1D1D6',
					700: '#ABABAB',
					900: '#7F8282',
				},
				twitter: '#1da1f2',
				github: '#4078c0',
				google: '#4285f4',
			},
		},
	},
	plugins: [],
};
