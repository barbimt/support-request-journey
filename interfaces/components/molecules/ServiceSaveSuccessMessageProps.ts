export type ServiceSaveSuccessMode = 'created' | 'updated'

export interface ServiceSaveSuccessMessageProps {
  serviceId: string
  serviceTitle: string
  mode: ServiceSaveSuccessMode
}
