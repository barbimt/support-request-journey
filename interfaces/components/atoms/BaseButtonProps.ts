export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export type ButtonType = 'button' | 'submit' | 'reset'

export type ButtonSize = 'default' | 'compact'

export interface BaseButtonProps {
  to?: string
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  type?: ButtonType
  disabled?: boolean
  ariaBusy?: boolean
}
