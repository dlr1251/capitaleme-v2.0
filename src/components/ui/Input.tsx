import * as React from 'react';
import clsx from 'clsx';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize; // Renombrado para evitar conflicto con el atributo nativo
}

const baseStyles =
  'block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-50 disabled:pointer-events-none';

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = 'md', ...props }, ref) => {
    return (
      <input
        className={clsx(baseStyles, sizeStyles[inputSize], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export default Input; 