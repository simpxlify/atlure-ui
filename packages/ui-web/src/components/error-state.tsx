import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  { className, icon, title, description, action, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'flex w-full flex-col items-center gap-sm px-md py-3xl text-center',
        className,
      )}
      {...props}
    >
      {icon ? <div className="pb-sm text-destructive">{icon}</div> : null}
      <p className="text-lg font-medium text-foreground">{title}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="pt-sm">{action}</div> : null}
    </div>
  );
});
