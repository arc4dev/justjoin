import { createTheme } from '@mui/material/styles'

/**
 * MUI Theme - Single Source of Truth for Component Styling
 * Retro-Professional Pixel Aesthetic with IBM VGA font
 *
 * Design System Architecture:
 * - This theme defines all colors and tokens that MUI components use
 * - Colors are synced with globals.css primitive tokens
 * - cssVariables: true enables --mui-* CSS variables for external styling
 * - Components reference theme.palette.* instead of inline hex values
 */
export const theme = createTheme({
	cssVariables: true,

	palette: {
		mode: 'light',
		primary: {
			main: '#9747FF',
			dark: '#7135BF',
			light: '#9747FF40',
			contrastText: '#ffffff'
		},
		secondary: {
			main: '#EEEEEE',
			dark: '#E4E4E4',
			light: '#f5f5f5',
			contrastText: '#2A2A2A'
		},
		background: {
			default: '#ffffff',
			paper: '#ffffff'
		},
		text: {
			primary: '#2A2A2A',
			secondary: '#7F7F7F',
			disabled: 'rgba(0, 0, 0, 0.2)'
		},
		error: {
			main: '#FF4E4E',
			contrastText: '#ffffff'
		},
		divider: '#EEEEEE',
		grey: {
			100: '#2A2A2A',
			200: '#7F7F7F',
			300: '#E4E4E4',
			400: '#EEEEEE'
		}
	},

	typography: {
		fontFamily: 'var(--font-ibm-vga), monospace',
		fontSize: 14,

		h1: {
			fontSize: '1.5rem',
			fontWeight: 700,
			lineHeight: 1.2,
			letterSpacing: '0.05em'
		},
		h2: {
			fontSize: '1.25rem',
			fontWeight: 700,
			lineHeight: 1.3
		},
		body1: {
			fontSize: '0.875rem',
			lineHeight: 1.5
		},
		body2: {
			fontSize: '0.75rem',
			lineHeight: 1.4
		},
		caption: {
			fontSize: '0.625rem',
			lineHeight: 1.3,
			fontWeight: 700,
			textTransform: 'uppercase'
		},
		button: {
			textTransform: 'none',
			fontWeight: 400,
			fontSize: '0.875rem'
		}
	},

	shape: {
		borderRadius: 2
	},

	spacing: 8,

	components: {
		MuiButton: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: theme.shape.borderRadius,
					padding: theme.spacing(1.5, 4),
					minWidth: '120px',
					transition: 'all 0.2s ease',
					'&:focus-visible': {
						outline: 'none',
						boxShadow: 'var(--shadow-focus)'
					}
				}),
				contained: ({ theme }) => ({
					boxShadow: 'none',
					'&:hover': {
						boxShadow: 'none'
					},
					'&.MuiButton-containedPrimary': {
						backgroundColor: theme.palette.primary.main,
						color: theme.palette.primary.contrastText,
						'&:hover': {
							backgroundColor: theme.palette.primary.dark
						}
					},
					'&.MuiButton-containedSecondary': {
						backgroundColor: theme.palette.secondary.main,
						color: theme.palette.secondary.contrastText,
						'&:hover': {
							backgroundColor: theme.palette.secondary.dark
						}
					}
				})
			}
		},

		MuiTextField: {
			styleOverrides: {
				root: ({ theme }) => ({
					'& .MuiOutlinedInput-root': {
						borderRadius: theme.shape.borderRadius,
						transition: 'all 0.2s ease',
						'& fieldset': {
							borderWidth: '1px',
							borderColor: theme.palette.divider,
							transition: 'border-color 0.2s ease'
						},
						'&:hover:not(.Mui-focused) fieldset': {
							borderColor: theme.palette.grey[300]
						},
						'&.Mui-focused': {
							boxShadow: 'var(--shadow-focus)',
							'& fieldset': {
								borderWidth: '1px',
								borderColor: theme.palette.primary.main
							}
						},
						'&.Mui-error fieldset': {
							borderWidth: '1px',
							borderColor: theme.palette.divider
						}
					},
					'& .MuiFormHelperText-root': {
						fontSize: '10px',
						marginTop: theme.spacing(0.5),
						marginLeft: 0,
						fontWeight: 400,
						textTransform: 'none',
						'&.Mui-error': {
							color: theme.palette.error.main,
							fontWeight: 400
						}
					}
				})
			}
		},

		MuiInputLabel: {
			styleOverrides: {
				root: ({ theme }) => ({
					fontSize: theme.typography.body2.fontSize,
					fontWeight: 400,
					color: theme.palette.text.primary,
					position: 'relative',
					transform: 'none',
					marginBottom: theme.spacing(1),
					textTransform: 'uppercase',
					letterSpacing: '0.025em'
				})
			}
		},

		MuiAutocomplete: {
			styleOverrides: {
				root: ({ theme }) => ({
					'& .MuiOutlinedInput-root': {
						padding: theme.spacing(1)
					},
					'&.Mui-focused .MuiAutocomplete-popupIndicator': {
						transform: 'rotate(180deg)'
					},
					'& .MuiAutocomplete-popupIndicator': {
						transition: 'transform 0.2s ease'
					}
				}),
				paper: ({ theme }) => ({
					boxShadow: '0 4px 10px 2px rgba(0, 0, 0, 0.1)',
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius,
					marginTop: theme.spacing(0.5),
					fontFamily: theme.typography.fontFamily
				}),
				listbox: ({ theme }) => ({
					padding: 0,
					fontFamily: theme.typography.fontFamily,
					'& .MuiAutocomplete-option': {
						fontSize: theme.typography.body1.fontSize,
						padding: theme.spacing(1, 2),
						transition: 'background-color 0.15s ease',
						'&:hover': {
							backgroundColor: 'var(--dropdown-hover)'
						},
						'&[aria-selected="true"]': {
							backgroundColor: 'var(--dropdown-selected)',
							color: theme.palette.primary.main,
							'&:hover': {
								backgroundColor: 'var(--dropdown-selected-hover)'
							}
						},
						'&.Mui-focused': {
							backgroundColor: 'var(--dropdown-hover)'
						}
					}
				}),
				loading: ({ theme }) => ({
					color: theme.palette.primary.main
				}),
				noOptions: ({ theme }) => ({
					fontSize: theme.typography.body1.fontSize,
					padding: theme.spacing(2),
					color: theme.palette.text.secondary,
					fontFamily: theme.typography.fontFamily
				})
			}
		},

		MuiPaper: {
			styleOverrides: {
				root: ({ theme }) => ({
					boxShadow: '0 4px 10px 2px rgba(0, 0, 0, 0.1)',
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius
				})
			}
		},

		MuiChip: {
			styleOverrides: {
				root: ({ theme }) => ({
					height: 'auto',
					borderRadius: theme.shape.borderRadius,
					fontSize: theme.typography.caption.fontSize,
					fontWeight: theme.typography.caption.fontWeight,
					textTransform: 'uppercase'
				}),
				filled: {
					backgroundColor: 'var(--badge-bg)',
					color: 'var(--badge-text)'
				}
			}
		},

		MuiAlert: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: theme.shape.borderRadius,
					fontSize: theme.typography.body1.fontSize
				})
			}
		}
	}
})
