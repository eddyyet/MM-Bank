import React from 'react'
import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useMetaMask } from 'metamask-react'
import { ethers } from 'ethers'
import { useBalance } from './tokenvalue'

export default function MetaMaskConnection (): JSX.Element {
  const { status, connect, account, chainId, ethereum } = useMetaMask()
  const { balance, setBalance } = useBalance()

  function ConnectMetaMask (): void {
    connect()
  }

  async function getBalance (): Promise<void> {
    if (account !== null) {
      const ETDWei = await ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
      const ETDEther = ETDWei !== null ? +ethers.utils.formatEther(ETDWei) : NaN
      if (ETDEther !== balance.ETD) { setBalance(existingBalance => ({ ...existingBalance, ETD: ETDEther })) }
    }
  }
  getBalance()

  if (status === 'initializing') return <div>Synchronisation with MetaMask ongoing...</div>
  if (status === 'unavailable') return <div><b>[ MetaMask not available, please install or use another browser :( ]</b></div>
  if (status === 'notConnected') return <Button onClick={ () => ConnectMetaMask() } sx={{ borderRadius: '2rem', border: '1px solid #DDDDDD', backgroundColor: '#DDDDDD', color: '#0D1117', '&:hover': { backgroundColor: '#1D2127', color: '#FFFFFF' } }}>Connect to MetaMask</Button>
  if (status === 'connecting') return <LoadingButton loading sx={{ borderRadius: '2rem', border: '1px solid #AAAAAA', background: 'none', '& .MuiLoadingButton-loadingIndicator': { color: '#999999' } }}>Connnecting</LoadingButton>
  if (status === 'connected') return <div className="AccountInfo"><div>Account: {account} | Chain ID: {chainId} | ETD balance: {balance.ETD}</div><div>Exchange Rates -  ETD/MMD: 1000, MMD/CMMD: 5</div></div>
  return <div />
}
