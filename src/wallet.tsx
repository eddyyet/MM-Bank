import React from 'react'
import { Stack, Grid } from '@mui/material'
import { Wallet, Lock, ErrorOutlineOutlined } from '@mui/icons-material'
import { useMetaMask } from 'metamask-react'
import { ethers } from 'ethers'
import { useBalance, NumberFormatted, MMDtoCMMD } from './tokenvalue'
import { MMDContract } from './contractinstance'
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
  const { account } = useMetaMask()
  const { balance, setBalance } = useBalance()

  async function getBalance (): Promise<void> {
    const MMDinWalletWei = await MMDContract().balanceOf(account ?? '')
    const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
    if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) };
  }
  getBalance()

  const testBalanceLarge = 654321.123456
  const CMMD = testBalanceLarge

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
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD' BalanceClass='BalanceFormat BalancePrimary CMMD-color' balance={CMMD} />
        </Grid>
        <Grid item xs={12} className='Note'><MMDEquivalent CMMD={CMMD} ExRate={MMDtoCMMD} /></Grid>
      </Grid>
    </Stack>
  )
}

export function VaultDisplay (): JSX.Element {
  const { account } = useMetaMask()
  const { balance, setBalance } = useBalance()

  async function getBalance (): Promise<void> {
    const MMDinVaultWei = await MMDContract().vaultBalanceOf(account ?? '')
    const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
    if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) };
  }
  getBalance()

  const testBalanceVault = 21
  const testBalanceVaultLarge = -321.1
  const MMD = testBalanceVault
  const CMMD = testBalanceVaultLarge

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
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD Credited' BalanceClass='BalanceFormat BalanceSecondary CMMD-color' balance={CMMD} />
        </Grid>
        <Grid item xs={12} className='Note'><MMDEquivalent CMMD={CMMD} ExRate={MMDtoCMMD} /></Grid>
        <Grid item xs={12} className='Note'><CollateralRatio MMD={MMD} CMMD={CMMD} ExRate={MMDtoCMMD} /></Grid>
        <Grid item xs={12} className='Note'><ErrorOutlineOutlined className='icon_small' sx={{ fontSize: 12.8 }} /> Liquidates when the collateral ratio is below 110%</Grid>
      </Grid>
    </Stack>
  )
}
