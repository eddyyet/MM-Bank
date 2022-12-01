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
  if (status === 'unavailable') return <div>MetaMask not available :(</div>
  if (status === 'notConnected') return <Button onClick={ () => ConnectMetaMask() } sx={{ borderRadius: '2rem', border: '1px solid #DDDDDD', backgroundColor: '#DDDDDD', color: '#1C1B1F', '&:hover': { backgroundColor: '#2C2B2F', color: '#FFFFFF' } }}>Connect to MetaMask</Button>
  if (status === 'connecting') return <LoadingButton loading sx={{ borderRadius: '2rem', border: '1px solid #2C2B2F', backgroundColor: '#2C2B2F', '& .MuiLoadingButton-loadingIndicator': { color: '#999999' } }}>Connnecting</LoadingButton>
  if (status === 'connected') return <div><div>Account: {account} | Chain ID: {chainId} | ETD balance: {balance.ETD}</div><div>Exchange Rates -  ETD/MMD: 1000, MMD/CMMD: 5</div></div>
  return <div />
}
