import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { CurrencyIcon } from '@/components/currency-icon.tsx'

interface Props {
  isLoading?: boolean
  label: string
  value: string | number
  color?: string
  helper?: string
  actions?: JSX.Element
  subValue?: JSX.Element
  icon?: React.JSX.Element
}

const StatisticsItem = ({
  label,
  isLoading = false,
  value,
  helper,
  color,
  actions,
  subValue,
  icon,
}: Props) => {
  return (
    <div>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex justify-between">
            {label}
            {icon && icon}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="w-full h-6" />}
          {!isLoading && (
            <>
              <span
                className={cn('text-2xl font-bold flex items-center', color)}
              >
                {value} <CurrencyIcon size={25} />
              </span>
              {subValue}
            </>
          )}
        </CardContent>
        {(helper || actions) && (
          <CardFooter>
            {helper && (
              <span className="text-xs text-muted-foreground">{helper}</span>
            )}
            {actions && !isLoading && (
              <div className="flex flex-1 justify-end">{actions}</div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default StatisticsItem
