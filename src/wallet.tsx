import { Stack, Grid } from '@mui/material';
import { Wallet, Lock, ErrorOutlineOutlined } from '@mui/icons-material';
import { useMetaMask } from 'metamask-react';
import React from 'react';
import { ethers } from 'ethers';
import { useBalance, NumberFormatted } from './tokenvalue';
import { M57Contract } from './contractinstance';
import './component.css';

interface Props {
  CurrencyClass: string;
  currency: string;
  BalanceClass: string;
  balance: number;
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
  );
}

function MMDEquivalent (props: {CMMD: number, ExRate:number}): JSX.Element {
  let MMD = props.CMMD / props.ExRate;
  return (
    <span>≈ MMD <NumberFormatted value={MMD} /></span>
  );
}

function CollateralRatio (props: {MMD:number, CMMD: number, ExRate:number}): JSX.Element {
  var CollateralRatio: number;

  if (props.CMMD < 0 && props.MMD >= 0) {
    CollateralRatio = - props.MMD / props.CMMD * props.ExRate * 100;
  } else {
    CollateralRatio = 0;
  }

  return (
    <span>Collateral ratio: <NumberFormatted value={CollateralRatio} />%</span>
  );
}

export function WalletDisplay() {
  const { account } = useMetaMask();
  const { balance, setBalance } = useBalance();

  async function getBalance() {
    if (account) {
      const MMDinWalletWei = await M57Contract().balanceOf(account);
      const MMDinWalletEther = MMDinWalletWei ? +ethers.utils.formatEther(MMDinWalletWei) : NaN;
      if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({existingBalance, MMDinWallet: MMDinWalletEther})) };
    }
  }
  getBalance();

  const test_balance_large = 654321.123456;
  let CMMD = test_balance_large;
  const ExRate = 50;

  return (
    <Stack>
      <div className='BalanceHeading'>
      <span className='icon'><Wallet /></span> Wallet
      </div>
      <Grid container className ='BalanceBoxContent'>
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD' BalanceClass='BalanceFormat BalancePrimary MMD-color' balance={Number(balance.MMDinWallet)} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD' BalanceClass='BalanceFormat BalancePrimary CMMD-color' balance={CMMD} />
        </Grid>
        <Grid item xs={12} className='Note'><MMDEquivalent CMMD={CMMD} ExRate={ExRate} /></Grid>
      </Grid>
    </Stack>
  );
}

export function VaultDisplay() {
  const test_balance_vault = 21;
  const test_balance_vault_large = -321.1;
  let MMD = test_balance_vault;
  let CMMD = test_balance_vault_large;
  const ExRate = 50;

  return (
    <Stack>
      <div className='BalanceHeading'>
        <span className='icon'><Lock /></span> Vault
      </div>
      <Grid container className ='BalanceBoxContent'>
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD Colleteral' BalanceClass='BalanceFormat BalanceSecondary MMD-color' balance={MMD} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD Credited' BalanceClass='BalanceFormat BalanceSecondary CMMD-color' balance={CMMD} />
        </Grid>
        <Grid item xs={12} className='Note'><MMDEquivalent CMMD={CMMD} ExRate={ExRate} /></Grid>
        <Grid item xs={12} className='Note'><CollateralRatio MMD={MMD} CMMD={CMMD} ExRate={ExRate} /></Grid>
        <Grid item xs={12} className='Note'><ErrorOutlineOutlined className='icon_small' sx={{ fontSize: 12.8 }} /> Liquidates when the collateral ratio is below 110%</Grid>
      </Grid>
    </Stack>
  );
}