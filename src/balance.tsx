import {Stack, Grid} from '@mui/material';
import './component.css';
import { NumericFormat } from 'react-number-format';
import "@fontsource/news-cycle"

export default function Wallet() {
  const test_balance = 321.123;
  const test_balance_large = 654321.123456;

  return (
    <div className='wallet'>
      <Grid container>
        <Grid item xs={12}>
          <div className='heading'>Wallet</div>
        </Grid>
        <Grid item className='balance-box' xs={6}>
          <div className='currency'>MMD</div>
          <div className='balance MMD-color'><NumericFormat displayType="text" value={test_balance} thousandSeparator="," decimalScale={2} /></div>
        </Grid>
        <Grid item className='balance-box' xs={6}>
          <div className='currency'>CMMD</div>
          <div className='balance CMMD-color'><NumericFormat displayType="text" value={test_balance_large} thousandSeparator="," decimalScale={2} /></div>
        </Grid>
      </Grid>
    </div>
  );
}