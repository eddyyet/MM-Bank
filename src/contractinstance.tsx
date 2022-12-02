import { ethers } from 'ethers'
import { MMDABI } from './MMD.abi'
import { CMMDABI } from './CMMD.abi'
import { IMetaMaskContext } from 'metamask-react/lib/metamask-context'

const MMDAddress = '0x0D1b6f0180620c7E8Cef155c2524C870887e1728'
const CMMDAddress = '0x2C33779280B3D6C2201297e6C6de7b58108c4199'

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
