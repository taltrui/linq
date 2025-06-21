import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const statuses = {
  TO_BE_BUDGETED: 'A presupuestar',
  PENDING: 'Pendiente',
  CANCELED: 'Cancelado',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  ALL: 'Todos',
}
export const formatStatus = (status: string) => {
  return statuses[status as keyof typeof statuses]
}

