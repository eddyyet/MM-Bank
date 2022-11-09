import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import Wallet from './balance';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className = 'root'>
      <Wallet />
    </div>
  </React.StrictMode>
);