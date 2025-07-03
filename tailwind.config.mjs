/** @type {import('tailwindcss').Config} */

export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		"./node_modules/flowbite/**/*.js"
	],
	theme: {
		
		extend: {
			height: {
				'128': '32rem',
			},
			typography: (theme) => ({
				DEFAULT: {
				  css: {
					fontFamily: `'Outfit', ${theme('fontFamily.sans').join(', ')}`,
					color:  '#16345F',
				  },
				}
			}),
			colors: {
				primary: '#16345F',
				secondary: '#00AA81',
				terciary: '#9BB8E0',
			  },
			fontFamily: {
				sans: ['Outfit', 'sans-serif'],
			  },
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-15px)' },
				},
				'float-fast': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' },
				},
			},
			animation: {
				'float': 'float 3s ease-in-out infinite',
				'float-slow': 'float-slow 4s ease-in-out infinite',
				'float-fast': 'float-fast 2.5s ease-in-out infinite',
			},
		},
	},
	plugins: [
		require('flowbite/plugin'),
		require('@tailwindcss/typography'),
	],
}
