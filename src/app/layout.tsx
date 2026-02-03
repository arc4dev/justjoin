import type { Metadata } from 'next'
import { ibmVga } from '../fonts'
import './globals.css'

export const metadata: Metadata = {
	title: 'JustJoin Assignment 🥳',
	description: 'A simple Next.js application about POKEMONS! 🤩'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${ibmVga.variable} antialiased`}>{children}</body>
		</html>
	)
}
