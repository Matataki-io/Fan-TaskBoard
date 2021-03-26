import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

/**
 * 小数处理
 * @param amount 需要处理的数据
 * @param deciimal 保留的小数位
 * @return 金额
 */
export const decimalProcessing = (amount: string, deciimal = 4) => {
  const idx = amount.indexOf('.');
  if (~idx) {
    // 位数 + 小数点 + 位置
    const _amount = amount.substring(0, deciimal + 1 + idx);
    return _amount;
  }
  return amount;
};