import { DollarSignIcon, EuroIcon } from 'lucide-react'
import { useUserStore } from '@/store/store.ts'

interface Props {
  size?: number
  currency?: string
}

export const CurrencyIcon = ({ size = 13, ...rest }: Props) => {
  const user = useUserStore((state) => state.user)
  if (!user) {
    return <EuroIcon size={size} />
  }

  const currency = rest.currency || user.currency
  const textSize = `text-[${size - 15}px]`

  switch (currency) {
    case 'CAD':
      return (
        <span className="flex items-center">
          <DollarSignIcon size={size} />
          <span className={textSize}>CA</span>
        </span>
      )
    case 'USD':
      return (
        <span className="inline-flex">
          <DollarSignIcon size={size} />
        </span>
      )
    case '€':
      return (
        <span className="inline-flex">
          <EuroIcon size={size} />
        </span>
      )
    default:
      return (
        <span className="inline-flex">
          <EuroIcon size={size} />
        </span>
      )
  }
}
