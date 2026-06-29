import BigNumber from 'bignumber.js/bignumber'

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const contractAddresses = {
  sushi: {
    1: '0xd413a77ea07747fa9ea7bcc1888edd51815eade4',
  },
  masterChef: {
    1: '0x65b9dd8073bc7d0fddaac6631520078c51d0c0be',
  },
  weth: {
    1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
}

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      1: '0x08FA2C5a034AfC118C4E6448902c6e29526B9ad6',
    },
    tokenAddresses: {
      1: '0xd413a77ea07747fa9ea7bcc1888edd51815eade4',
    },
    name: '',
    symbol: 'CYBER-ETH UNI-V2 LP',
    tokenSymbol: 'CYBER',
    icon: '🐢',
  },
]
