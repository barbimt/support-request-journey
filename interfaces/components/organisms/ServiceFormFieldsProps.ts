import type { ServiceForm } from '~/interfaces/serviceForm'

export interface ServiceFormFieldsProps {
  form: ServiceForm
  errorFor: (field: keyof ServiceForm) => string | undefined
}
