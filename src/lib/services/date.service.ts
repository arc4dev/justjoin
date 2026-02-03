/**
 * Time API service for fetching current date/time
 */

interface TimeApiResponse {
	year: number
	month: number
	day: number
	hour: number
	minute: number
	seconds: number
	milliSeconds: number
	dateTime: string
	date: string
	time: string
	timeZone: string
	dayOfWeek: string
	dstActive: boolean
}

/**
 * Fetches current date from Time API (Warsaw timezone)
 * @returns Formatted date string
 */
export async function getCurrentDate(): Promise<string> {
	try {
		const response = await fetch(
			'https://timeapi.io/api/time/current/zone?timeZone=Europe/Warsaw',
			{
				next: { revalidate: 60 } // Revalidate every minute
			}
		)

		if (!response.ok) {
			throw new Error('Failed to fetch time')
		}

		const data: TimeApiResponse = await response.json()

		// Format as "DD.MM.YYYY"
		const day = data.day.toString().padStart(2, '0')
		const month = data.month.toString().padStart(2, '0')
		const year = data.year

		return `${day}.${month}.${year}`
	} catch (error) {
		console.error('Error fetching time:', error)
		// Fallback to server time
		const now = new Date()
		const day = now.getDate().toString().padStart(2, '0')
		const month = (now.getMonth() + 1).toString().padStart(2, '0')
		const year = now.getFullYear()
		return `${day}.${month}.${year}`
	}
}
