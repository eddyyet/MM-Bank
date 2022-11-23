import { ethers } from 'ethers';
import { MMDABI } from './MMD.abi'; 

const MMDAddress = '0x7D0Ee74f1df232EE48289B7e4f6c65239e6f4c24';
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