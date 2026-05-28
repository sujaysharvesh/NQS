import { AssignedTo } from '../../core/models/record.model';

export function getAssignedName(assignedTo: AssignedTo): string {
  return assignedTo?.name ?? assignedTo?.userId ?? '—';
}

export function getInitials(input: string | AssignedTo): string {
  const name =
    typeof input === 'string'
      ? input
      : input?.name ?? input?.userId ?? '??';

  return name
    .split(/[\s_]/)
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

export function getProgressColor(progress: number, status: string): string {
  if (status === 'Archived' && progress === 100) return '#4ade80';
  if (progress < 30) return '#f87171';
  return '#6366f1';
}