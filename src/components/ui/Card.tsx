import * as React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'bg-primary-50 border border-primary-200 rounded-xl p-4 md:p-5 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export default Card; 