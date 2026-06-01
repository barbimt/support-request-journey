export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  rangeStart: number
  rangeEnd: number
  totalItems: number
  label?: string
  controlsId?: string
}

export interface PaginationControlsEmits {
  previous: []
  next: []
}
