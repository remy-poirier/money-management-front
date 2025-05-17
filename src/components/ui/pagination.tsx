import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { cva, VariantProps } from 'class-variance-authority'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = (
  {
    ref,
    className,
    ...props
  }: React.ComponentProps<'ul'> & {
    ref: React.RefObject<HTMLUListElement>;
  }
) => (<ul
  ref={ref}
  className={cn('flex flex-row items-center gap-1', className)}
  {...props}
/>)
PaginationContent.displayName = 'PaginationContent'

const paginationItemVariants = cva(
  'border bg-background shadow-xs border-input rounded-md text-sm cursor-pointer',
  {
    variants: {
      variant: {
        default: '',
        active: 'bg-primary text-white',
        disabled: 'bg-muted-foreground text-muted cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface PaginationItemProps
  extends React.ComponentProps<'li'>,
    VariantProps<typeof paginationItemVariants> {}

const PaginationItem = (
  {
    ref,
    className = false,
    ...props
  }: PaginationItemProps & {
    ref: React.RefObject<HTMLLIElement>;
  }
) => (<li ref={ref} className={cn('', className)} {...props} />)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  disabled = false,
  size = 'icon',
  onClick,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      disabled || isActive ? 'cursor-not-allowed' : 'cursor-pointer',
      buttonVariants({
        variant: isActive ? 'outline-solid' : 'ghost',
        size,
      }),
      className,
    )}
    {...(!disabled && !!onClick && { onClick })}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  onClick,
  disabled = false,
  ...props
}: { disabled?: boolean } & React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      'gap-1 pl-2.5',
      disabled
        ? 'cursor-not-allowed text-muted-foreground hover:bg-transparent hover:text-muted-foreground'
        : 'cursor-pointer',
      className,
    )}
    {...(!disabled && !!onClick && { onClick })}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span>Précédent</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  onClick,
  disabled = false,
  ...props
}: { disabled?: boolean } & React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      'gap-1 pr-2.5',
      disabled
        ? 'cursor-not-allowed hover:bg-transparent hover:text-muted-foreground text-muted-foreground'
        : 'cursor-pointer',
      className,
    )}
    {...(!disabled && !!onClick && { onClick })}
    {...props}
  >
    <span>Suivant</span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
