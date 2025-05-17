import {
  CalendarClock,
  Fuel,
  Gamepad2,
  Landmark,
  PiggyBankIcon,
  Router,
  ShoppingBag,
  ShoppingBasket,
  UtensilsCrossed,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils.ts'
import { useMediaQuery } from '@uidotdev/usehooks'

interface Props {
  categoryId: string
  forceSmall?: boolean
}

const CATEGORY_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  '850b6d2c-cc0f-11ee-9def-325096b39f47': {
    icon: ShoppingBag,
    color: 'bg-orange-400',
  },
  '908b0308-c642-4525-afce-e3302869a7cf': {
    icon: ShoppingBasket,
    color: 'bg-green-400',
  },
  '850b6b06-cc0f-11ee-8e37-325096b39f47': {
    icon: PiggyBankIcon,
    color: 'bg-blue-400',
  },
  '88de2372-cc0f-11ee-b901-325096b39f47': {
    icon: Gamepad2,
    color: 'bg-purple-400',
  },
  '88de1fa8-cc0f-11ee-9779-325096b39f47': {
    icon: CalendarClock,
    color: 'bg-sky-400',
  },
  '88de21e2-cc0f-11ee-be1b-325096b39f47': {
    icon: Landmark,
    color: 'bg-teal-400',
  },
  '7bb254b6-cc0f-11ee-9a91-325096b39f47': {
    icon: UtensilsCrossed,
    color: 'bg-amber-400',
  },
  '7bb25088-cc0f-11ee-9f6d-325096b39f47': {
    icon: Fuel,
    color: 'bg-lime-400',
  },
}

export const TransactionCategory = ({
  categoryId,
  forceSmall = false,
}: Props) => {
  const isSmallDevice = useMediaQuery(`only screen and (max-width : 28rem)`)

  const size = isSmallDevice ? 20 : 12
  const defaultClass =
    isSmallDevice || forceSmall
      ? 'btn-circle h-[40px] w-[40px] bg-gray-300 flex items-center justify-center'
      : 'rounded-3xl ml-[-2px] h-[25px] w-[25px] bg-gray-300 flex items-center justify-center'
  const baseShape =
    'md:rounded-3xl md:ml-[-2px] md:h-[25px] md:w-[25px] @max-sm:btn-circle @max-sm:h-[40px] @max-sm:w-[40px]'

  const categoryItem = CATEGORY_MAP[categoryId]

  const renderItem = (Component: LucideIcon, itemClasses: string) => {
    return (
      <div className={cn(defaultClass, baseShape, itemClasses)}>
        <Component className="text-white" size={size} />
      </div>
    )
  }

  if (!categoryItem) {
    return renderItem(Router, 'bg-red-400')
  }

  const { icon, color } = categoryItem

  return renderItem(icon, color)
}
