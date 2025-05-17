import * as React from 'react'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator.tsx'
import { CurrencyIcon } from '@/components/currency-icon.tsx'

export interface InputProps extends React.ComponentProps<'input'> {
  startIcon?: React.JSX.Element | string
  endIcon?: React.JSX.Element | string
}

export interface BigInputProps extends React.ComponentProps<'input'> {
  currency?: string
}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

const BigInput = ({ ref, className, currency, ...props }: BigInputProps) => {
  return (
    <div className="items-center gap-2 flex h-auto w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border border-input">
      <input
        type="number"
        className={cn(
          'w-full text-[60px] px-2 outline-hidden bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          className,
        )}
        ref={ref}
        {...props}
      />
      <Separator orientation="vertical" />
      <CurrencyIcon size={60} currency={currency} />
    </div>
  )
}
BigInput.displayName = 'BigInput'

export { Input, BigInput }
