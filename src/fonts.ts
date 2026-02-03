import localFont from 'next/font/local'

export const ibmVga = localFont({
	src: [
		{
			path: './assets/fonts/ibm-vga.woff',
			weight: '400',
			style: 'normal'
		}
	],
	variable: '--font-ibm-vga',
	display: 'swap'
})
