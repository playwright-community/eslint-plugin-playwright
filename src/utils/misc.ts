export const getAmountData = (amount: number) => ({
  amount: amount.toString(),
  s: amount === 1 ? '' : 's',
})

export const truthy = Boolean as unknown as <T>(
  value: T | undefined | null | false | 0 | '',
) => value is T
