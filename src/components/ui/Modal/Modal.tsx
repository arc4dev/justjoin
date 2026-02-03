'use client'

import { useState, useEffect, useRef } from 'react'
import MuiModal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
	open: boolean
	onClose: () => void
	title?: string
	children: React.ReactNode
	maxWidth?: number
}

export function Modal({ open, onClose, title, children, maxWidth = 500 }: ModalProps) {
	const [muiOpen, setMuiOpen] = useState(false)
	const prevOpenRef = useRef(open)

	useEffect(() => {
		// Only update when open changes from false to true
		if (open && !prevOpenRef.current) {
			// NOTE: This setState in useEffect is a known anti-pattern but necessary here
			// to coordinate MUI Modal's lifecycle with Framer Motion's exit animations.
			// In production, I would consider refactoring to use a state machine or animation library
			// that better handles modal unmounting (e.g., Radix UI Primitives). I wanted to showcase this nice animation :)
			// eslint-disable-next-line
			setMuiOpen(true)
		}
		prevOpenRef.current = open
	}, [open])

	const handleExitComplete = () => {
		if (!open) {
			setMuiOpen(false)
		}
	}

	return (
		<MuiModal
			open={muiOpen}
			onClose={onClose}
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
			closeAfterTransition
			hideBackdrop
		>
			<Box>
				<AnimatePresence mode='wait' onExitComplete={handleExitComplete}>
					{open && (
						<>
							<Box
								component={motion.div}
								key='backdrop'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2, ease: 'easeOut' }}
								onClick={onClose}
								sx={{
									position: 'fixed',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: 'rgba(0, 0, 0, 0.25)',
									zIndex: -1
								}}
							/>
							<Box
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									outline: 'none'
								}}
							>
								<Box
									component={motion.div}
									key='modal-content'
									initial={{ opacity: 0, scale: 0.98, filter: 'blur(3px)' }}
									animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
									exit={{ opacity: 0, scale: 0.98, filter: 'blur(3px)' }}
									transition={{ duration: 0.2, ease: 'easeOut' }}
									sx={{
										width: '90vw',
										maxWidth,
										bgcolor: 'background.paper',
										boxShadow: 24,
										borderRadius: 1,
										p: 3
									}}
								>
									{title && (
										<Box sx={{ mb: 2 }}>
											<Typography id='modal-title' variant='h2' component='h2'>
												{title}
											</Typography>
										</Box>
									)}
									<Box id='modal-description'>{children}</Box>
								</Box>
							</Box>
						</>
					)}
				</AnimatePresence>
			</Box>
		</MuiModal>
	)
}
