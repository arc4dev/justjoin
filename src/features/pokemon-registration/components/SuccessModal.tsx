'use client'

import { Box, Typography } from '@mui/material'
import { Modal } from '@/components/ui/Modal/Modal'
import { Button } from '@/components/ui/Button/Button'

interface SuccessModalProps {
	open: boolean
	onClose: () => void
	onReset: () => void
	message?: string
}

/**
 * Success modal displayed after successful trainer registration
 * Provides option to reset form and register another trainer
 */
export function SuccessModal({ open, onClose, onReset, message }: SuccessModalProps) {
	const handleReset = () => {
		onReset()
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose} title='🎉 Success!'>
			<Box sx={{ textAlign: 'center', py: 2 }}>
				<Typography variant='body1' sx={{ mb: 3, textWrap: 'balance' }}>
					{message || 'Your trainer registration was successful!'}
				</Typography>

				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
					<Button variant='outlined' onClick={onClose}>
						Close
					</Button>
					<Button
						variant='contained'
						onClick={handleReset}
						aria-label='Reset form and register another trainer'
					>
						Register Another Trainer
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}
