import {
  CalendarClock,
  Fuel,
  Gamepad2,
  Landmark,
  Home,
  PiggyBankIcon,
  Router,
  ShoppingBag,
  ShoppingBasket,
  UtensilsCrossed,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils.ts'
import { useMediaQuery } from '@uidotdev/usehooks'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'

interface Props {
  categoryId: string
}

const fullConfig = resolveConfig(tailwindConfig)

export const TransactionCategory = ({ categoryId }: Props) => {
  const isSmallDevice = useMediaQuery(
    `only screen and (max-width : ${fullConfig.theme.screens.md})`,
  )

  const size = isSmallDevice ? 20 : 12
  const defaultClass = isSmallDevice
    ? 'btn-circle h-[40px] w-[40px] bg-gray-300 flex items-center justify-center'
    : 'rounded-3xl ml-[-2px] h-[25px] w-[25px] bg-gray-300 flex items-center justify-center'

  if (categoryId === '850b6d2c-cc0f-11ee-9def-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-orange-400')}>
        <ShoppingBag className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '908b0308-c642-4525-afce-e3302869a7cf') {
    return (
      <div className={cn(defaultClass, 'bg-green-400')}>
        <ShoppingBasket className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '850b6b06-cc0f-11ee-8e37-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-blue-400')}>
        <PiggyBankIcon className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '88de2372-cc0f-11ee-b901-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-purple-400')}>
        <Gamepad2 className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '88de1fa8-cc0f-11ee-9779-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-sky-400')}>
        <CalendarClock className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '88de21e2-cc0f-11ee-be1b-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-teal-400')}>
        <Landmark className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '7bb254b6-cc0f-11ee-9a91-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-amber-400')}>
        <UtensilsCrossed className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '7bb25088-cc0f-11ee-9f6d-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-lime-400')}>
        <Fuel className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '7bb25290-cc0f-11ee-bb3e-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-indigo-400')}>
        <Home className="text-white" size={size} />
      </div>
    )
  }

  if (categoryId === '7bb25524-cc0f-11ee-b1f4-325096b39f47') {
    return (
      <div className={cn(defaultClass, 'bg-slate-400')}>
        <MoreHorizontal className="text-white" size={size} />
      </div>
    )
  }

  return (
    <div className={cn(defaultClass, 'bg-red-400')}>
      <Router className="text-white" size={size} />
    </div>
  )
}
