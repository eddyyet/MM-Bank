import { ethers } from 'ethers'

export async function reason () {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const a = await provider.getTransaction('0x69435f68e5153614391b00be063230b2a3b3a5fe7e10831319fe3ce06a2b6848')
  try {
    const code = await provider.call(a, a.blockNumber)
    console.log('success', code)
  } catch (err) {
    const code = err.data.replace('Reverted ', '')
    console.log({ err })
    const reason = ethers.utils.toUtf8String('0x' + code.substr(138))
    console.log('revert reason:', reason)
  }
}
