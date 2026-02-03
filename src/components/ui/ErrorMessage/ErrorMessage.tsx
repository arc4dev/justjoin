import { Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface ErrorMessageProps {
	message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
			<ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />
			<Typography variant='caption' color='error.main'>
				{message}
			</Typography>
		</div>
	)
}
