import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Stack, Divider } from '@mui/material';
import { WalletDisplay, VaultDisplay } from './balance';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className = 'root'>
      <Stack spacing={2} className="main" divider={<Divider orientation="horizontal" color="#666666" flexItem />}>
        <WalletDisplay />
        <VaultDisplay />
        <div>Transfer CMMD</div>
        <div>Borrow CMMD</div>
        <div>Repay CMMD</div>
        <div>Top up MMD</div>
        <div>Deposit MMD</div>
        <div>Withdraw MMD</div>
      </Stack>
    </div>
  </React.StrictMode>
);