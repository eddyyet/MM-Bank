import './component.css';
import { Stack, Grid } from '@mui/material';
import { Wallet, Lock, ErrorOutlineOutlined } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
// import "@fontsource/news-cycle"

interface Props {
  CurrencyClass: string;
  currency: string;
  BalanceClass: string;
  balance: number;
}

function BalanceBox (props: Props): JSX.Element {
  var {
    CurrencyClass, 
    currency, 
    BalanceClass, 
    balance,
  } = props;

  return (
    <Grid container>
      <Grid item xs={2} className={CurrencyClass}>
        {currency}
      </Grid>
      <Grid item xs={10} className={BalanceClass}>
        <NumericFormat displayType="text" value={balance} thousandSeparator="," decimalScale={2} />
      </Grid>
    </Grid>
  );
}

function MMDEquivalent (CMMD: number, ExRate:number): JSX.Element {
  var MMD = CMMD / ExRate;
  return (
    <span className='note'>≈{MMD}</span>
  );
}

export function WalletDisplay() {
  var test_balance = 321.123;
  var test_balance_large = 654321.123456;

  return (
    <Stack>
      <div className='BalanceHeading'>
      <span className='icon'><Wallet /></span> Wallet
      </div>
      <Grid container className ='BalanceBoxContent'>
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD' BalanceClass='BalanceFormat BalancePrimary MMD-color' balance={test_balance} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD' BalanceClass='BalanceFormat BalancePrimary CMMD-color' balance={test_balance_large} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export function VaultDisplay() {
  var test_balance_vault = 21;
  var test_balance_vault_large = -321.1;

  return (
    <Stack>
      <div className='BalanceHeading'>
        <span className='icon'><Lock /></span> Vault
      </div>
      <Grid container className ='BalanceBoxContent'>
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD Colleteral' BalanceClass='BalanceFormat BalanceSecondary MMD-color' balance={test_balance_vault} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD Credited' BalanceClass='BalanceFormat BalanceSecondary CMMD-color' balance={test_balance_vault_large} />
        </Grid>
        <Grid item xs={12} className='note'><span className='icon'><ErrorOutlineOutlined sx={{ fontSize: 12.8 }} /></span> Your MMD would be liquidated if the collateral ratio is below XX%.</Grid>
      </Grid>
    </Stack>
  );
}