import { styled } from '@mui/material/styles'
import { Grid, TextField, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useMetaMask } from 'metamask-react'
import { useBalance, ETDtoMMD, MMDtoCMMD, InitialCollateralRatio, MinCollateralRatio } from './tokenvalue'
import { MMDContract } from './contractinstance'
import { ethers } from 'ethers'
import './component.css'

const OperationTextField = styled(TextField)({
  width: '100%',
  '& label': { color: '#999999' },
  '&:hover label': { color: '#CCCCCC' },
  '& label.Mui-focused': { color: '#CCCCCC' },
  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#999999' }, '&:hover fieldset': { borderColor: '#CCCCCC' }, '&.Mui-focused fieldset': { borderColor: '#CCCCCC' } },
  input: {
    textAlign: 'right',
    color: '#999999',
    '&[type=number]': { '-moz-appearance': 'textfield' },
    '&::-webkit-outer-spin-button': { '-webkit-appearance': 'none', margin: 0 },
    '&::-webkit-inner-spin-button': { '-webkit-appearance': 'none', margin: 0 }
  }
}
)

const OperationButton = styled(Button)({
  height: '100%',
  width: 'fill-available',
  marginLeft: '1rem',
  borderRadius: '2rem',
  border: '1px solid #999999',
  backgroundColor: '#1C1B1F',
  color: '#999999',
  '&:hover': { backgroundColor: '#2B2C2F' }
}
)

export function TopUpMMD (): JSX.Element {
  const metamask = useMetaMask()
  const { account, ethereum } = metamask
  const { balance, setBalance } = useBalance()
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const ETD = Number(useBalance().balance.ETD)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0) {
      setMessage('')
    } else if (InputValue / ETDtoMMD <= ETD) {
      setMessage('Consumes ' + String(InputValue / ETDtoMMD) + ' ETD')
    } else {
      setMessage('Consumes ' + String(InputValue / ETDtoMMD) + ' ETD. Not enough ETD.')
    }
  }, [InputValue, ETD])

  async function TopUp (input: number): Promise<void> {
    await MMDContract(metamask).buy({ value: ethers.utils.parseEther(String(input / ETDtoMMD)), gasLimit: 300000 })

    const ETDWei = await ethereum.request({ method: 'eth_getBalance', params: [account ?? '', 'latest'] })
    const ETDEther = ETDWei !== null ? +ethers.utils.formatEther(ETDWei) : NaN
    if (ETDEther !== balance.ETD) { setBalance(existingBalance => ({ ...existingBalance, ETD: ETDEther })) }

    const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
    const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
    if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) };
  }

  return (
        <Grid container>
            <Grid item xs={12} md={9} sx={{ marginBottom: '1rem' }}>
                <Grid container>
                    <Grid item xs={4} className='OperationName'>
                        Top Up MMD
                    </Grid>
                    <Grid item xs={8} className='Note'>
                        <div className='OperationMessage'>{Message}</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
                <Grid container>
                    <Grid item xs={8} md={6}>
                        <OperationTextField size='small' label='MMD'
                            type='number' inputProps={{ min: '0' }}
                            value={InputValue}
                            onChange={event => setInputValue(+event.target.value)} />
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <OperationButton onClick={async () => await TopUp(InputValue)}>
                            Top Up
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function DepositMMD (): JSX.Element {
  const metamask = useMetaMask()
  const { account } = metamask
  const { balance, setBalance } = useBalance()
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const MMDinWallet = Number(useBalance().balance.MMDinWallet)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0 || InputValue <= MMDinWallet) {
      setMessage('')
    } else {
      setMessage('Not enough MMD in Wallet')
    }
  }, [InputValue, MMDinWallet])

  async function Deposit (input: number): Promise<void> {
    await MMDContract(metamask).deposit(ethers.utils.parseEther(String(input)), { gasLimit: 300000 })

    const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
    const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
    if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) };

    const MMDinVaultWei = await MMDContract(metamask).vaultBalanceOf(account ?? '')
    const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
    if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) };
  }

  return (
        <Grid container>
            <Grid item xs={12} md={9} sx={{ marginBottom: '1rem' }}>
                <Grid container>
                    <Grid item xs={4} className='OperationName'>
                        Deposit MMD
                    </Grid>
                    <Grid item xs={8} className='Note'>
                        <div className='OperationMessage'>{Message}</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
                <Grid container>
                    <Grid item xs={8} md={6}>
                        <OperationTextField size='small' label='MMD'
                            type='number' inputProps={{ min: '0' }}
                            value={InputValue}
                            onChange={event => setInputValue(+event.target.value)} />
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <OperationButton onClick={async () => await Deposit(InputValue) }>
                            Deposit
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function WithdrawMMD (): JSX.Element {
  const metamask = useMetaMask()
  const { account } = metamask
  const { balance, setBalance } = useBalance()
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const MMDinVault = Number(useBalance().balance.MMDinVault)
  const CMMDinVault = Number(useBalance().balance.CMMDinVault)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0) {
      setMessage('')
    } else if (InputValue > MMDinVault) {
      setMessage('Not enough MMD Collateral in Vault')
    } else if (InputValue <= MMDinVault && (MMDinVault - InputValue) * MMDtoCMMD < -CMMDinVault * MinCollateralRatio) {
      setMessage('Minimal collateral ratio: 110%. Withdrawal will cause liquidation at 80% of the trading price.')
    } else {
      setMessage('')
    }
  }, [InputValue, MMDinVault, CMMDinVault])

  async function Withdraw (input: number): Promise<void> {
    await MMDContract(metamask).withdraw(ethers.utils.parseEther(String(input)), { gasLimit: 300000 })

    const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
    const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
    if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) }

    const MMDinVaultWei = await MMDContract(metamask).vaultBalanceOf(account ?? '')
    const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
    if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) }
  }

  return (
        <Grid container>
            <Grid item xs={12} md={9} sx={{ marginBottom: '1rem' }}>
                <Grid container>
                    <Grid item xs={4} className='OperationName'>
                        Withdraw MMD
                    </Grid>
                    <Grid item xs={8} className='Note'>
                        <div className='OperationMessage'>{Message}</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
                <Grid container>
                    <Grid item xs={8} md={6}>
                        <OperationTextField size='small' label='MMD'
                            type='number' inputProps={{ min: '0' }}
                            value={InputValue}
                            onChange={event => setInputValue(+event.target.value)} />
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <OperationButton onClick={async () => await Withdraw(InputValue)}>
                            Withdraw
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function TransferCMMD (): JSX.Element {
  const [Address, setAddress] = useState<string>('')
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const CMMDinWallet = Number(useBalance().balance.CMMDinWallet)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0 || InputValue <= CMMDinWallet) {
      setMessage('')
    } else {
      setMessage('Not enough CMMD in Wallet')
    }
  }, [InputValue, CMMDinWallet])

  return (
        <Grid container>
            <Grid item xs={12} md={6} sx={{ marginBottom: ['1rem', '1rem', '0rem'] }}>
                <Grid container>
                    <Grid item xs={4} className='OperationName'>
                        Transfer CMMD
                    </Grid>
                    <Grid item xs={8} className='Note'>
                        <div className='OperationMessage'>{Message}</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3} sx ={{ paddingRight: ['null', 'null', '1rem'], marginBottom: ['1rem', '1rem', '0rem'] }}>
                <OperationTextField size='small' label='Address'
                    InputLabelProps={{ shrink: true }}
                    sx={{ input: { textAlign: 'left' } }}
                    type='text'
                    value={Address}
                    onChange={event => setAddress(event.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
                <Grid container>
                    <Grid item xs={8} md={6}>
                        <OperationTextField size='small' label='CMMD'
                            type='number' inputProps={{ min: '0' }}
                            value={InputValue}
                            onChange={event => setInputValue(+event.target.value)} />
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <OperationButton onClick={() => TransferCMMDOperator(InputValue)}>
                            Transfer
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function BorrowCMMD (): JSX.Element {
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const MMDinWallet = Number(useBalance().balance.MMDinWallet)
  const MMDinVault = Number(useBalance().balance.MMDinVault)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0) {
      setMessage('')
    } else if (InputValue * InitialCollateralRatio / MMDtoCMMD <= (MMDinWallet + MMDinVault)) {
      if (InputValue * InitialCollateralRatio / MMDtoCMMD <= MMDinVault) {
        setMessage('Initial collateral ratio: 150%. Needs ' + String(InputValue * InitialCollateralRatio / MMDtoCMMD) + ' MMD Collateral in Vault.')
      } else {
        setMessage('Initial collateral ratio: 150%. Needs ' + String(InputValue * InitialCollateralRatio / MMDtoCMMD) + ' MMD Collateral in Vault. ' + String(InputValue * InitialCollateralRatio / MMDtoCMMD - MMDinVault) + ' MMD will be transferred from Wallet.')
      }
    } else {
      setMessage('Initial collateral ratio: 150%. Needs ' + String(InputValue * InitialCollateralRatio / MMDtoCMMD) + ' MMD Collateral in Vault. Not enough MMD from Wallet and Vault.')
    }
  }, [InputValue, MMDinWallet, MMDinVault])

  return (
        <Grid container>
            <Grid item xs={12} md={9} sx={{ marginBottom: '1rem' }}>
                <Grid container>
                    <Grid item xs={4} className='OperationName'>
                        Borrow CMMD
                    </Grid>
                    <Grid item xs={8} className='Note'>
                        <div className='OperationMessage'>{Message}</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
                <Grid container>
                    <Grid item xs={8} md={6}>
                        <OperationTextField size='small' label='CMMD'
                            type='number' inputProps={{ min: '0' }}
                            value={InputValue}
                            onChange={event => setInputValue(+event.target.value)} />
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <OperationButton onClick={() => BorrowCMMDOperator(InputValue)}>
                          Borrow
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function RepayCMMD (): JSX.Element {
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const CMMDinWallet = Number(useBalance().balance.CMMDinWallet)
  const CMMDinVault = Number(useBalance().balance.CMMDinVault)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0) {
      setMessage('')
    } else if (InputValue >= -CMMDinVault) {
      setMessage('Input value larger then CMMD credited')
    } else if (InputValue >= CMMDinWallet) {
      setMessage('Not enough CMMD in Wallet')
    } else {
      setMessage('Returns ' + String(InputValue * MMDtoCMMD) + ' MMD Collateral to Wallet')
    }
  }, [InputValue, CMMDinWallet, CMMDinVault])

  return (
        <Grid container>
            <Grid item xs={12} md={9} sx={{ marginBottom: '1rem' }}>
                <Grid container>
                    <Grid item xs={4} className='OperationName'>
                        Repay CMMD
                    </Grid>
                    <Grid item xs={8} className='Note'>
                        <div className='OperationMessage'>{Message}</div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
                <Grid container>
                    <Grid item xs={8} md={6}>
                        <OperationTextField size='small' label='CMMD'
                            type='number' inputProps={{ min: '0' }}
                            value={InputValue}
                            onChange={event => setInputValue(+event.target.value)} />
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <OperationButton onClick={() => RepayCMMDOperator(InputValue)}>
                            Repay
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

function TransferCMMDOperator (input: number): void {

}

function BorrowCMMDOperator (input: number): void {

}

function RepayCMMDOperator (input: number): void {

}
