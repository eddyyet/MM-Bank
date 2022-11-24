import { ethers } from 'ethers';

export async function reason() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const a = await provider.getTransaction('0xc7e9bea5e4f96b3d1bfaa73ca21633b0f451434dc799e8ea7d440f5660f3e800');
  try {
    let code = await provider.call(a, a.blockNumber);
    console.log("success", code);
  } catch (err) {
    const code = err.data.replace('Reverted ','');
    console.log({err});
    let reason = ethers.utils.toUtf8String('0x' + code.substr(138));
    console.log('revert reason:', reason);
  }
}