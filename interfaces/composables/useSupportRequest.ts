import type { SupportRequestForm, ValidationError } from '~/interfaces/supportRequest'

export interface SubmitSupportRequestSuccess {
  success: true
  message: string
  reference: string
}

export interface SubmitSupportRequestValidationFailure {
  success: false
  validationErrors: ValidationError[]
}

export interface SubmitSupportRequestServerFailure {
  success: false
  serverError: string
}

export type SubmitSupportRequestResult =
  | SubmitSupportRequestSuccess
  | SubmitSupportRequestValidationFailure
  | SubmitSupportRequestServerFailure

export interface UseSupportRequestReturn {
  submitSupportRequest: (
    payload: SupportRequestForm,
    serviceId?: string,
  ) => Promise<SubmitSupportRequestResult>
}
