export type ButtonVariant = 'primary' | 'secondary'

export type ButtonType = 'button' | 'submit' | 'reset'

export interface AppButtonProps {
  to?: string
  variant?: ButtonVariant
  type?: ButtonType
  disabled?: boolean
  ariaBusy?: boolean
}
