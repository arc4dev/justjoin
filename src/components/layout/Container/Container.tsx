import { Container as MuiContainer, Box } from '@mui/material'

interface ContainerProps {
	children: React.ReactNode
}

export function Container({ children }: ContainerProps) {
	return (
		<MuiContainer maxWidth='md'>
			<Box
				sx={{
					minHeight: '100vh',
					py: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				{children}
			</Box>
		</MuiContainer>
	)
}
