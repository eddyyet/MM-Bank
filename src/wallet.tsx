import { Stack, Grid } from '@mui/material';
import { Wallet, Lock, ErrorOutlineOutlined } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
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
        <NumericFormat displayType="text" value={props.balance} thousandSeparator="," decimalScale={2} />
      </Grid>
    </Grid>
  );
}

function MMDEquivalent (props: {CMMD: number, ExRate:number}): JSX.Element {
  let MMD = props.CMMD / props.ExRate;
  return (
    <span>≈ MMD <NumericFormat displayType="text" value={MMD} thousandSeparator="," decimalScale={2} /></span>
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
    <span>Collateral ratio: <NumericFormat displayType="text" value={CollateralRatio} thousandSeparator="," decimalScale={0} />%</span>
  );
}

export function WalletDisplay() {
  const test_balance = 321.123;
  const test_balance_large = 654321.123456;
  let MMD = test_balance;
  let CMMD = test_balance_large;
  const ExRate = 50;

  return (
    <Stack>
      <div className='BalanceHeading'>
      <span className='icon'><Wallet /></span> Wallet
      </div>
      <Grid container className ='BalanceBoxContent'>
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD' BalanceClass='BalanceFormat BalancePrimary MMD-color' balance={MMD} />
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