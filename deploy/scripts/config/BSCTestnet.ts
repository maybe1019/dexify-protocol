import { utils } from 'ethers';
import { ChainlinkRateAsset, sighash } from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

import { DeploymentConfig, saveConfig } from '../../utils/config';

// Note that some addresses in this file are checksummed and others are not. This shouldn't be an issue.

// WETH is not included as it is auto-included in the chainlink price feed

const primitives = {
  aave: '0xa372425353a7b94629eae6ad2b2167bd187ad971',
  busd: '0x8301f2213c0eed49a7e28ae4c3e91722919b8b47',
  dai: '0xeacfa009ea412f6b6571048a418d02e27e90f395',
  link: '0xb224bf57200a26d194d1e8c356d0f0482c7fa3e8',
  sxp: '0x75107940Cf1121232C0559c747A986DEfbc69DA9',
  usdc: '0xbbf0a4c58257c7af712085141b6d4bd747d46d12',
  usdt: '0x1413874e27d8d575dac0be8aca645a60826d051f',
} as const;

const weth = '0xae13d989dac2f0debff460ac112a837c89baa7cd';

const aggregators = {
  aave: ['0x298619601ebCd58d0b526963Deb2365B485Edc74', ChainlinkRateAsset.USD],
  busd: ['0x5ea7D6A33D3655F661C298ac8086708148883c34', ChainlinkRateAsset.ETH],
  dai: ['0x0630521aC362bc7A19a4eE44b57cE72Ea34AD01c', ChainlinkRateAsset.ETH],
  link: ['0x351Ff08FF5077d6E8704A4763836Fe187f074380', ChainlinkRateAsset.ETH],
  sxp: ['0x678AC35ACbcE272651874E782DB5343F9B8a7D66', ChainlinkRateAsset.USD],
  usdc: ['0x90c069C4538adAc136E051052E14c1cD799C41B7', ChainlinkRateAsset.USD],
  usdt: ['0xEca2605f0BCF2BA5966372C99837b1F182d3D620', ChainlinkRateAsset.USD],
} as const;
// 0x0000000000000000000000000000000000000000
const synths = {} as const;

const ctokens = {} as const;

const atokens = {} as const;

const pools = {} as const;

const idle = {} as const;

// const yVaultsV2 = {
//   yCrvSteth: '0xdCD90C7f6324cfa40d7169ef80b12031770B4325',
//   yDai: '0x19D3364A399d251E894aC732651be8B0E4e85001',
//   yUsdc: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
// };

// const unsupportedAssets = {
//   eurs: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
// };

const ethUsdAggregator = '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526';
const xauUsdAggregator = '0x0000000000000000000000000000000000000000';

const curveMinter = '0x0000000000000000000000000000000000000000';
const synthetixDelegateApprovals = '0x0000000000000000000000000000000000000000';

// prettier-ignore
const mainnetConfig: DeploymentConfig = {
  aave: {
    atokens,
    lendingPoolAddressProvider: '0x0000000000000000000000000000000000000000',
    protocolDataProvider: '0x0000000000000000000000000000000000000000',
  },
  alphaHomoraV1: {
    ibeth: '0x0000000000000000000000000000000000000000'
  },
  chainlink: {
    aggregators,
    ethusd: ethUsdAggregator,
  },
  compound: {
    ceth: '0x0000000000000000000000000000000000000000',
    ctokens,
  },
  curve: {
    addressProvider: '0x0000000000000000000000000000000000000000',
    minter: curveMinter,
    pools: {
      aave: {
        invariantProxyAsset: primitives.usdc,
        liquidityGaugeToken: '0x0000000000000000000000000000000000000000',
        lpToken: '0x0000000000000000000000000000000000000000',
        pool: '0x0000000000000000000000000000000000000000'
      },
      seth: {
        invariantProxyAsset: weth,
        liquidityGaugeToken: '0x0000000000000000000000000000000000000000',
        lpToken: '0x0000000000000000000000000000000000000000',
        pool: '0x0000000000000000000000000000000000000000'
      },
      steth: {
        invariantProxyAsset: weth,
        liquidityGaugeToken: '0x0000000000000000000000000000000000000000',
        lpToken: '0x0000000000000000000000000000000000000000',
        pool: '0x0000000000000000000000000000000000000000'
      },
    },
  },
  idle,
  kyber: {
    networkProxy: '0x0000000000000000000000000000000000000000',
  },
  lido: {
    steth: '0x0000000000000000000000000000000000000000'
  },
  paraSwapV4: {
    augustusSwapper: '0x0000000000000000000000000000000000000000',
    tokenTransferProxy: '0x0000000000000000000000000000000000000000',
  },
  policies: {
    guaranteedRedemption: {
      redemptionWindowBuffer: 300,
    },
  },
  primitives,
  stakehound: {
    steth: '0x0000000000000000000000000000000000000000'
  },
  synthetix: {
    addressResolver: '0x0000000000000000000000000000000000000000',
    delegateApprovals: synthetixDelegateApprovals,
    originator: '0x0000000000000000000000000000000000000000',
    snx: '0x0000000000000000000000000000000000000000',
    susd: '0x0000000000000000000000000000000000000000',
    synths,
    trackingCode: '0x454e5a594d450000000000000000000000000000000000000000000000000000',
  },
  uniswap: {
    factory: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
    pools,
    router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
  },
  uniswapV3: {
    router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'
  },
  unsupportedAssets: {},
  wdgld: {
    ethusd: ethUsdAggregator,
    wdgld: '0x0000000000000000000000000000000000000000',
    xauusd: xauUsdAggregator,
  },
  weth: weth,
  yearn: {
    vaultV2: {
      registry: '0x0000000000000000000000000000000000000000',
      yVaults: {}
    }
  },
  zeroex: {
    allowedMakers: [],
    exchange: '0x0000000000000000000000000000000000000000',
  },
  vaultCalls: [
    [
      synthetixDelegateApprovals,
      sighash(utils.FunctionFragment.fromString('approveExchangeOnBehalf(address delegate)')),
    ],
    [curveMinter, sighash(utils.FunctionFragment.fromString('mint(address)'))],
    [curveMinter, sighash(utils.FunctionFragment.fromString('mint_many(address[8])'))],
    [curveMinter, sighash(utils.FunctionFragment.fromString('toggle_approve_mint(address)'))],
  ],
}

const fn: DeployFunction = async (hre) => {
  await saveConfig(hre, mainnetConfig);
};

fn.tags = ['Config'];
fn.skip = async (hre) => {
  // Run this only for mainnet & mainnet forks.
  const chain = parseInt(await hre.getChainId());
  return chain !== 97;
};

export default fn;
