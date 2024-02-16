export interface Statistics {
  totalToCome: number
  amountLeftForMonth: number
  refunds: {
    collected: number
    toCome: number
    total: number
  }
  oneTime: {
    collected: number
    toCome: number
    total: number
  }
  recurring: {
    collected: number
    toCome: number
    total: number
  }
  transactions: {
    refunds: {
      collected: number
      toCome: number
      total: number
    }
    oneTime: {
      collected: number
      toCome: number
      total: number
    }
    recurring: {
      collected: number
      toCome: number
      total: number
    }
    total: number
  }
}
