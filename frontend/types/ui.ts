export interface DropdownItem {
  label: string
  icon?: string
  to?: string
  click?: () => void
  disabled?: boolean
  color?: string
  class?: string
}
