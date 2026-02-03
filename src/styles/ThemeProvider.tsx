'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'
import { EmotionCacheProvider } from './EmotionCache'

interface ThemeProviderProps {
	children: React.ReactNode
}

/**
 * Combined MUI theme and Emotion cache provider
 * Ensures proper SSR hydration by managing Emotion styles correctly
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
	return (
		<EmotionCacheProvider>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</EmotionCacheProvider>
	)
}
