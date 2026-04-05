import { STATUS_LABELS, type ProjectStatus } from '../../data/projects'
import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status: ProjectStatus
  variant?: 'badge' | 'text'
  className?: string
}

export function StatusBadge({ status, variant = 'badge', className }: StatusBadgeProps) {
  const baseClass = variant === 'text' ? styles.text : styles.badge
  const cls = className ? `${baseClass} ${className}` : baseClass

  return (
    <span className={cls} data-status={status}>
      {STATUS_LABELS[status]}
    </span>
  )
}
