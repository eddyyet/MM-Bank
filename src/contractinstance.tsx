import { ethers } from 'ethers'
import { MMDABI } from './MMD.abi'
import { IMetaMaskContext } from 'metamask-react/lib/metamask-context'

const MMDAddress = '0xBf59b0FB27a02e7831199D8Ce3bd9A366cd252fd'
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
