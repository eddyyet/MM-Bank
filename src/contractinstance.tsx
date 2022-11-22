import { ethers } from 'ethers';
import { M57ABI } from './M57.abi'; 

const M57Address = '0x6afcb5f153efC2B35c52B12682ab6c9B5FDF73C1';
// const MMDAddress = '';
// const CMMDAddress = '';

declare global {
    interface Window{
      ethereum?:any
    }
  }

export function M57Contract() { 
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(M57Address, M57ABI, provider);;
    return contract;
}