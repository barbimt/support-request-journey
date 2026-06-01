export interface ServiceSearchFieldProps {
  id?: string
  label?: string
  modelValue: string
}

export interface ServiceSearchFieldEmits {
  'update:modelValue': [value: string]
}
