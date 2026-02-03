import type { Metadata } from 'next'
import { ibmVga } from '../fonts'
import { ThemeProvider } from '../styles/ThemeProvider'
import { QueryProvider } from '../lib/providers/QueryProvider'
import './globals.css'

export const metadata: Metadata = {
	title: 'Pokemon Trainer Registration',
	description: 'Register as a Pokemon trainer and choose your companion'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${ibmVga.variable} antialiased`}>
				<ThemeProvider>
					<QueryProvider>{children}</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
