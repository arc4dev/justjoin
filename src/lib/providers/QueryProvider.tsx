'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface QueryProviderProps {
	children: React.ReactNode
}

/**
 * Client-side React Query provider
 * Manages client-side data fetching, caching, and state management
 */
export function QueryProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						refetchOnWindowFocus: false,
						retry: 1
					}
				}
			})
	)

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
