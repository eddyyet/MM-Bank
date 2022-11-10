import React from 'react';
import ReactDOM from 'react-dom/client';
import { Stack, Divider } from '@mui/material';
import './index.css';
// import App from './App';
import { Wallet, Vault } from './balance';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className = 'root'>
      <Stack spacing={2} className="main" divider={<Divider orientation="horizontal" color="#666666" flexItem />}>
        <Wallet />
        <Vault />
        <div>Borrow CMMD</div>
        <div>Repay CMMD</div>
        <div>Deposit MMD</div>
        <div>Withdraw MMD</div>
      </Stack>
    </div>
  </React.StrictMode>
);