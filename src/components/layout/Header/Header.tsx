import { Box, Typography } from '@mui/material'

export function Header() {
	return (
		<Box
			component='header'
			sx={{
				py: 3,
				borderBottom: '2px solid',
				borderColor: 'divider',
				mb: 4
			}}
		>
			<Typography
				variant='h1'
				component='h1'
				sx={{
					textAlign: 'center',
					fontSize: { xs: '1.5rem', sm: '2rem' }
				}}
			>
				🎮 Pokemon Trainer Registration by Arek
			</Typography>
		</Box>
	)
}
