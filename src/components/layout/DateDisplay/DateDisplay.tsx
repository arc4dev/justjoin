import { Box, Typography } from '@mui/material'

interface DateDisplayProps {
	date: string
}

export function DateDisplay({ date }: DateDisplayProps) {
	const dateObj = new Date(date)
	const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'flex-end',
				mb: 2
			}}
		>
			<Typography
				variant='caption'
				component='time'
				sx={{
					color: 'text.primary'
				}}
			>
				{dayName}, {date}
			</Typography>
		</Box>
	)
}
