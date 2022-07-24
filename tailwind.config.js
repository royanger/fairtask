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
				black: {
					DEFAULT: '#000000',
				},
				background: {
					DEFAULT: '#F5F5F5',
				},
				grey: {
					100: '#EAEBEC',
					300: '#D1D1D6',
					DEFAULT: '#D1D1D6',
					700: '#ABABAB',
				},
				twitter: '#1da1f2',
				github: '#4078c0',
				google: '#4285f4',
			},
		},
	},
	plugins: [],
};
