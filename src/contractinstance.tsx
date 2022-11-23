import { ethers } from 'ethers';
import { MMDABI } from './MMD.abi'; 

const MMDAddress = '0x5038BB6563b386889f7A4c369Ba621166CDDc0b8';
// const CMMDAddress = '';

declare global {
    interface Window{
      ethereum?:any
    }
  }

export function MMDContract() { 
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MMDAddress, MMDABI, provider);
    const contractSigned = contract.connect(signer);
    return contractSigned;
}