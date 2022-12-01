import { ethers } from 'ethers'
import { MMDABI } from './MMD.abi'
import { CMMDABI } from './CMMD.abi'
import { IMetaMaskContext } from 'metamask-react/lib/metamask-context'

const MMDAddress = '0x2497f4F5C4dE2744ad42B7Ab6D96C2cD1c90c01a'
const CMMDAddress = '0x0fD706bc16981fba74497891a04D5EdA71528cb4'

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

export function CMMDContract (metamask: IMetaMaskContext): ethers.Contract {
  const { account } = metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner(account ?? '')
  const contract = new ethers.Contract(CMMDAddress, CMMDABI, provider)
  const contractSigned = contract.connect(signer)
  return contractSigned
}
