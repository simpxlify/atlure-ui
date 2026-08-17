import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { className, icon, title, description, action, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      className={cn(
        'flex w-full flex-col items-center gap-sm px-md py-3xl text-center',
        className,
      )}
      {...props}
    >
      {icon ? <div className="pb-sm text-muted-foreground">{icon}</div> : null}
      <p className="text-lg font-medium text-foreground">{title}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="pt-sm">{action}</div> : null}
    </div>
  );
});
