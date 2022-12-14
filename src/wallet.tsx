import React from 'react'
import { Stack, Grid } from '@mui/material'
import { Wallet, Lock, ErrorOutlineOutlined } from '@mui/icons-material'
import { useMetaMask } from 'metamask-react'
import { ethers } from 'ethers'
import { useBalance, NumberFormatted, MMDtoCMMD } from './tokenvalue'
import { MMDContract, CMMDContract } from './contractinstance'
import './component.css'

interface Props {
  CurrencyClass: string
  currency: string
  BalanceClass: string
  balance: number
}

function BalanceBox (props: Props): JSX.Element {
  return (
        <Grid container>
            <Grid item xs={2} className={props.CurrencyClass}>
                {props.currency}
            </Grid>
            <Grid item xs={10} className={props.BalanceClass}>
                <NumberFormatted value={props.balance} />
            </Grid>
        </Grid>
  )
}

function MMDEquivalent (props: { CMMD: number, ExRate: number }): JSX.Element {
  const MMD = props.CMMD / props.ExRate
  return (
        <span>≈ MMD <NumberFormatted value={MMD} /></span>
  )
}

function CollateralRatio (props: { MMD: number, CMMD: number, ExRate: number }): JSX.Element {
  let CollateralRatio: number

  if (props.CMMD < 0 && props.MMD >= 0) {
    CollateralRatio = -props.MMD / props.CMMD * props.ExRate * 100
  } else {
    CollateralRatio = 0
  }

  return (
        <span>Collateral ratio: <NumberFormatted value={CollateralRatio} />%</span>
  )
}

export function WalletDisplay (): JSX.Element {
  const metamask = useMetaMask()
  const { account } = metamask
  const { balance, setBalance } = useBalance()

  async function getBalance (): Promise<void> {
    if (account !== null) {
      const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
      const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
      if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) };

      const CMMDinWalletWei = await CMMDContract(metamask).balanceOf(account ?? '')
      const CMMDinWalletEther = CMMDinWalletWei !== null ? +ethers.utils.formatEther(CMMDinWalletWei) : NaN
      if (CMMDinWalletEther !== balance.CMMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, CMMDinWallet: CMMDinWalletEther })) };
    }
  }
  getBalance()

  return (
        <Stack>
            <div className='BalanceHeading'>
                <span className='icon'><Wallet /></span> Wallet
            </div>
            <Grid container className ='BalanceBoxContent'>
                <Grid item xs={5}>
                    <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD' BalanceClass='BalanceFormat BalancePrimary MMD-color' balance={ Number(balance.MMDinWallet) } />
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={5}>
                    <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD' BalanceClass='BalanceFormat BalancePrimary CMMD-color' balance={ Number(balance.CMMDinWallet) } />
                </Grid>
                <Grid item xs={12} className='Note'><MMDEquivalent CMMD={ Number(balance.CMMDinWallet) } ExRate={MMDtoCMMD} /></Grid>
            </Grid>
        </Stack>
  )
}

export function VaultDisplay (): JSX.Element {
  const metamask = useMetaMask()
  const { account } = metamask
  const { balance, setBalance } = useBalance()

  async function getBalance (): Promise<void> {
    if (account !== null) {
      const MMDinVaultWei = await MMDContract(metamask).vaultBalanceOf(account ?? '')
      const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
      if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) };

      const CMMDinVaultWei = await CMMDContract(metamask).vaultBalanceOf(account ?? '')
      const CMMDinVaultEther = CMMDinVaultWei !== null ? +ethers.utils.formatEther(CMMDinVaultWei) : NaN
      if (CMMDinVaultEther !== balance.CMMDinVault) { setBalance(existingBalance => ({ ...existingBalance, CMMDinVault: CMMDinVaultEther })) };
    }
  }
  getBalance()

  return (
        <Stack>
            <div className='BalanceHeading'>
                <span className='icon'><Lock /></span> Vault
            </div>
            <Grid container className ='BalanceBoxContent'>
                <Grid item xs={5}>
                    <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD Colleteral' BalanceClass='BalanceFormat BalanceSecondary MMD-color' balance={ Number(balance.MMDinVault) } />
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={5}>
                    <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD Credited' BalanceClass='BalanceFormat BalanceSecondary CMMD-color' balance={ Number(balance.CMMDinVault)} />
                </Grid>
                <Grid item xs={12} className='Note'><MMDEquivalent CMMD={ Number(balance.CMMDinVault) } ExRate={MMDtoCMMD} /></Grid>
                <Grid item xs={12} className='Note'><CollateralRatio MMD={ Number(balance.MMDinVault) } CMMD={ Number(balance.CMMDinVault) } ExRate={MMDtoCMMD} /></Grid>
                <Grid item xs={12} className='Note'><ErrorOutlineOutlined className='icon_small' sx={{ fontSize: 12.8 }} /> Liquidates when the collateral ratio is below 110%</Grid>
            </Grid>
        </Stack>
  )
}
