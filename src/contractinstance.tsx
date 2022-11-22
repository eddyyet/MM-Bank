import { ethers } from 'ethers';
import { M57ABI } from './M57.abi'; 

const M57Address = '0x66C24fbC56c2AaDfB67285bADcE531d0ceEb984c';
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