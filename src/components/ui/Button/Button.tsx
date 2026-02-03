import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button'

// NOTE: I'd also not add this on prod level, but showcase how to extend MUI components
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ButtonProps extends MuiButtonProps {}

/**
 * Button component - fully theme-driven
 * All styling (colors, states, focus) comes from theme.ts
 */
export function Button({ children, ...props }: ButtonProps) {
	return (
		<MuiButton
			{...props}
			sx={{
				transition: 'transform 0.1s ease',
				'&:active': {
					transform: 'scale(0.98)'
				},
				...props.sx
			}}
		>
			{children}
		</MuiButton>
	)
}
