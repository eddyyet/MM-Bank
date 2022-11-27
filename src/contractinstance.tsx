import { ethers } from 'ethers'
import { MMDABI } from './MMD.abi'
import { IMetaMaskContext } from 'metamask-react/lib/metamask-context'

const MMDAddress = '0x5D25A2F6dBCBA347bCe83166fddb90c7938420c2'
// const CMMDAddress = '';

declare global {
  interface Window {
    ethereum?: any
  }
}

export function MMDContract (metamask: IMetaMaskContext): ethers.Contract {
  const { account } = metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner(account ?? '')
  const contract = new ethers.Contract(MMDAddress, MMDABI, provider)
  const contractSigned = contract.connect(signer)
  return contractSigned
}
