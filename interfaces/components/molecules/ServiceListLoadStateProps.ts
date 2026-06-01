export interface ServiceListLoadStateProps {
  pending: boolean
  error: boolean
  hasData: boolean
}

export interface ServiceListLoadStateEmits {
  retry: []
}
