import { FundDeployerArgs } from '@enzymefinance/protocol';
import { DeployFunction } from 'hardhat-deploy/types';

import { loadConfig } from '../../../utils/config';
// import { mainnetConfig } from './../../config/Kovan';

const fn: DeployFunction = async function (hre) {
  const {
    deployments: { deploy, get },
    ethers: { getSigners },
  } = hre;

  // await saveConfig(hre, mainnetConfig);

  const deployer = (await getSigners())[0];
  const config = await loadConfig(hre);
  const dispatcher = await get('Dispatcher');
  const vaultLib = await get('VaultLib');

  await deploy('FundDeployer', {
    args: [
      dispatcher.address,
      vaultLib.address,
      config.vaultCalls.map(([address]) => address),
      config.vaultCalls.map(([, selector]) => selector),
    ] as FundDeployerArgs,
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

fn.dependencies = ['Config', 'Dispatcher', 'VaultLib'];
fn.tags = ['Release', 'FundDeployer'];

export default fn;
