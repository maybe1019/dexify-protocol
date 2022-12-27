import { utils } from 'ethers';
import { ChainlinkRateAsset, sighash } from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

import { DeploymentConfig, saveConfig } from '../../utils/config';

// Note that some addresses in this file are checksummed and others are not. This shouldn't be an issue.

// WETH is not included as it is auto-included in the chainlink price feed

const primitives = {
  alpha: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
  band: '0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18',
  busd: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  bzrx: '0x4b87642aedf10b642be4663db842ecc5a88bf5ba',
  comp: '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
  dai: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
  dpi: '0x564d4a58fd000aa7b3e80f8a1f2a8e67f759151d',
  link: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
  sushi: '0x947950bcc74888a40ffa2593c5798f11fc9124c4',
  sxp: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
  uni: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  usdt: '0x55d398326f99059ff775485246999027b3197955',
  btcb: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
  yfi: '0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e',
  zrx: '0x0ddc5e539af1753693e9463ca619406b1b06d66e',
} as const;

const weth = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

const aggregators = {
  alpha: ['0x7bC032A7C19B1BdCb981D892854d090cfB0f238E', ChainlinkRateAsset.ETH],
  band: ['0xC78b99Ae87fF43535b0C782128DB3cB49c74A4d3', ChainlinkRateAsset.USD],
  busd: ['0x87Ea38c9F24264Ec1Fff41B04ec94a97Caf99941', ChainlinkRateAsset.ETH],
  bzrx: ['0xFc362828930519f236ad0c8f126B7996562a695A', ChainlinkRateAsset.USD],
  comp: ['0x0Db8945f9aEf5651fa5bd52314C5aAe78DfDe540', ChainlinkRateAsset.USD],
  dai: ['0x8EC213E7191488C7873cEC6daC8e97cdbAdb7B35', ChainlinkRateAsset.ETH],
  dpi: ['0x7ee7E7847FFC93F8Cf67BCCc0002afF9C52DE524', ChainlinkRateAsset.USD],
  link: ['0xB38722F6A608646a538E882Ee9972D15c86Fc597', ChainlinkRateAsset.ETH],
  sushi: ['0xa679C72a97B654CFfF58aB704de3BA15Cde89B07', ChainlinkRateAsset.USD],
  sxp: ['0xE188A9875af525d25334d75F3327863B2b8cd0F1', ChainlinkRateAsset.USD],
  uni: ['0x25298F020c3CA1392da76Eb7Ac844813b218ccf7', ChainlinkRateAsset.ETH],
  usdc: ['0x45f86CA2A8BC9EBD757225B19a1A0D7051bE46Db', ChainlinkRateAsset.ETH],
  usdt: ['0xD5c40f5144848Bd4EF08a9605d860e727b991513', ChainlinkRateAsset.ETH],
  btcb: ['0x116EeB23384451C78ed366D4f67D5AD44eE771A0', ChainlinkRateAsset.ETH],
  yfi: ['0xF841761481DF19831cCC851A54D8350aE6022583', ChainlinkRateAsset.ETH],
  zrx: ['0xFc362828930519f236ad0c8f126B7996562a695A', ChainlinkRateAsset.USD],
} as const;
// 0x0000000000000000000000000000000000000000
const synths = {} as const;

const ctokens = {} as const;

const atokens = {} as const;

const pools = {
  bandWeth: '0x168b273278f3a8d302de5e879aa30690b7e6c28f',
  busdUsdc: '0x2354ef4df11afacb85a5c7f98b624072eccddbb1',
  busdUsdt: '0x7efaef62fddcca950418312c6c91aef321375a00',
  daiUsdc: '0xadbba1ef326a33fdb754f14e62a96d5278b942bd',
  daiUsdt: '0xf6f5ce9a91dd4fae2d2ed92e25f2a4dc8564f174',
  daiWeth: '0xc7c3ccce4fa25700fd5574da7e200ae28bbd36a3',
  linkWeth: '0x824eb9faDFb377394430d2744fa7C42916DE3eCe',
  sushiWeth: '0x7fbd09099838dd0b70068f07a9021d69d9b4813a',
  sxpWeth: '0xd8e2f8b6db204c405543953ef6359912fe3a88d6',
  uniWeth: '0x014608E87AF97a054C9a49f81E1473076D51d9a3',
  usdcUsdt: '0xEc6557348085Aa57C72514D67070dC863C0a5A8c',
  usdcWeth: '0xd99c7f6c65857ac913a8f880a4cb84032ab2fc5b',
  wethUsdt: '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae',
} as const;

const idle = {} as const;

// const yVaultsV2 = {
//   yCrvSteth: '0xdCD90C7f6324cfa40d7169ef80b12031770B4325',
//   yDai: '0x19D3364A399d251E894aC732651be8B0E4e85001',
//   yUsdc: '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9',
// };

// const unsupportedAssets = {
//   eurs: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
// };

const ethUsdAggregator = '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE';
const xauUsdAggregator = '0x86896fEB19D8A607c3b11f2aF50A0f239Bd71CD0';

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
    augustusSwapper: '0x55a0e3b6579972055faa983482aceb4b251dcf15',
    tokenTransferProxy: '0x7CFCBA271f8671640455f5F81143e741F46507ab',
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
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    pools,
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  },
  uniswapV3: {
    router: '0xe2856bd8290983dd22868522f3b30c1a29d0dc0c'
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
  console.log;
  await saveConfig(hre, mainnetConfig);
};

fn.tags = ['Config'];
fn.skip = async (hre) => {
  // Run this only for mainnet & mainnet forks.
  const chain = parseInt(await hre.getChainId());
  return chain !== 56 && chain !== 31337;
};

export default fn;
