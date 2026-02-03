import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import { forwardRef } from 'react'
import { Box, Typography } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

export type TextFieldProps = MuiTextFieldProps

/**
 * TextField component - fully theme-driven
 * Labels positioned above inputs with theme typography
 * All styling (borders, colors, states) comes from theme.ts
 */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
	{ label, error, helperText, ...props },
	ref
) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			{label && (
				<Typography
					component='label'
					variant='caption'
					sx={{
						color: 'text.primary'
					}}
				>
					{label}
				</Typography>
			)}
			<MuiTextField
				ref={ref}
				variant='outlined'
				fullWidth
				error={error}
				InputLabelProps={{ shrink: false }}
				{...props}
				label={undefined}
				helperText={undefined}
			/>
			<Box
				sx={{
					minHeight: '20px',
					display: 'flex',
					alignItems: 'flex-start'
				}}
			>
				<AnimatePresence mode='wait'>
					{helperText && (
						<Box
							component={motion.div}
							initial={{ opacity: 0, y: -1, filter: 'blur(2px)' }}
							animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							exit={{ opacity: 0, y: -1, filter: 'blur(2px)' }}
							transition={{ duration: 0.1, ease: 'easeInOut' }}
							key={String(helperText)}
						>
							<Typography
								variant='body2'
								sx={{
									color: error ? 'error.main' : 'text.secondary'
								}}
							>
								{helperText}
							</Typography>
						</Box>
					)}
				</AnimatePresence>
			</Box>
		</Box>
	)
})
