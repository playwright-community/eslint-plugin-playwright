export const getAmountData = (amount: number) => ({
  amount: amount.toString(),
  s: amount === 1 ? '' : 's',
});
