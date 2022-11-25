import { ethers } from 'ethers'
import { MMDABI } from './MMD.abi'
import { useMetaMask } from 'metamask-react'

const MMDAddress = '0x2dA09a2F4dB08a7e513601f4B834bfCD385b25A4'
// const CMMDAddress = '';

declare global {
  interface Window {
    ethereum?: any
  }
}

export function MMDContract (): ethers.Contract {
  const { account } = useMetaMask()
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner(account ?? '')
  const contract = new ethers.Contract(MMDAddress, MMDABI, provider)
  const contractSigned = contract.connect(signer)
  return contractSigned
}
