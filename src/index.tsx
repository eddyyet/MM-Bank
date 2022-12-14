import React from 'react'
import ReactDOM from 'react-dom/client'
import { Stack, Divider } from '@mui/material'
import { MetaMaskProvider } from 'metamask-react'
import MetaMaskConnection from './metamask'
import { WalletDisplay, VaultDisplay } from './wallet'
import { BalanceProvider } from './tokenvalue'
import { TopUpMMD, DepositMMD, WithdrawMMD, TransferCMMD, BorrowCMMD, RepayCMMD } from './operation'
import './index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
    <React.StrictMode>
        <BalanceProvider>
            <MetaMaskProvider>
                <div className = 'root'>
                    <Stack spacing={2} >
                        <Stack spacing={2} className="wallet" >
                            <div className="brand">MM Bank</div>
                            <MetaMaskConnection />
                            <Stack spacing={2} divider={<Divider orientation="horizontal" color="#666666" flexItem />}>
                                <WalletDisplay />
                                <VaultDisplay />
                            </Stack>
                        </Stack>
                        <Stack spacing={2} className="operation" divider={<Divider orientation="horizontal" color="#666666" flexItem />}>
                            <TopUpMMD />
                            <DepositMMD />
                            <WithdrawMMD />
                            <TransferCMMD />
                            <BorrowCMMD />
                            <RepayCMMD />
                        </Stack>
                    </Stack>
                </div>
            </MetaMaskProvider>
        </BalanceProvider>
    </React.StrictMode>
)
