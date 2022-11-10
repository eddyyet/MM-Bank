import {Stack, Grid} from '@mui/material';
import './component.css';
import { NumericFormat } from 'react-number-format';
import "@fontsource/news-cycle"

interface Props {
  CurrencyClass: string;
  currency: string;
  BalanceClass: string;
  balance: number;
}

export function BalanceBox (props: Props): JSX.Element {
  // const style = { 'margin-top': '50pt', 'margin-bottom': '0.5rem'};
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

export function Wallet() {
  var test_balance = 321.123;
  var test_balance_large = 654321.123456;

  return (
    <Stack>
      <div className='BalanceHeading'>Wallet</div>
      <Grid container className ='BalanceContent'>
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD' BalanceClass='BalanceFormat MMD-color' balance={test_balance} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD' BalanceClass='BalanceFormat CMMD-color' balance={test_balance_large} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export function Vault() {
  var test_balance_vault = 21;
  var test_balance_vault_large = -321.1;

  return (
    <Stack>
      <div className='BalanceHeading'>Vault</div>
      <Grid container className ='BalanceContent'>
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='MMD Colleteral' BalanceClass='BalanceFormat MMD-color' balance={test_balance_vault} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <BalanceBox CurrencyClass='CurrencyFormat' currency='CMMD Credited' BalanceClass='BalanceFormat CMMD-color' balance={test_balance_vault_large} />
        </Grid>
      </Grid>
    </Stack>
  );
}