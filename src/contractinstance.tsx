import { ethers } from 'ethers'
import { MMDABI } from './MMD.abi'
import { CMMDABI } from './CMMD.abi'
import { IMetaMaskContext } from 'metamask-react/lib/metamask-context'

const MMDAddress = '0x0Ba0bf0F6155774816A32f2983DCB53B12fb6f46'
const CMMDAddress = '0x7330f402b2abCb4DEC78c0406A065fE9F56AF73e'

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
