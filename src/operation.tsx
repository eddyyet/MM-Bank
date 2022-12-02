import { styled } from '@mui/material/styles'
import { Grid, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useState, useEffect } from 'react'
import { useMetaMask } from 'metamask-react'
import { useBalance, ETDtoMMD, MMDtoCMMD, InitialCollateralRatio, MinCollateralRatio } from './tokenvalue'
import { MMDContract, CMMDContract } from './contractinstance'
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

const OperationButton = styled(LoadingButton)({
  height: '100%',
  width: 'fill-available',
  marginLeft: '1rem',
  borderRadius: '2rem',
  border: '1px solid #999999',
  backgroundColor: '#10141C',
  color: '#999999',
  '&:hover': { backgroundColor: '#20242C' },
  '&:disabled': { border: '1px solid #666666', backgroundColor: '#2B2C2F' },
  '& .MuiLoadingButton-loadingIndicator': { color: '#666666' }
})

export function TopUpMMD (): JSX.Element {
  const metamask = useMetaMask()
  const { account, ethereum } = metamask
  const { balance, setBalance } = useBalance()
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
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
    setLoading(true)

    try {
      const tx = await MMDContract(metamask).buy({ value: ethers.utils.parseEther(String(input / ETDtoMMD)), gasLimit: 300000 })
      await tx.wait()

      const ETDWei = await ethereum.request({ method: 'eth_getBalance', params: [account ?? '', 'latest'] })
      const ETDEther = ETDWei !== null ? +ethers.utils.formatEther(ETDWei) : NaN
      if (ETDEther !== balance.ETD) { setBalance(existingBalance => ({ ...existingBalance, ETD: ETDEther })) }

      const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
      const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
      if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) }
    } catch (error) {
      console.log(error)
    }

    setInputValue(0)
    setLoading(false)
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
                        <OperationButton loading={loading} onClick={async () => await TopUp(InputValue)}>
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
  const [loading, setLoading] = useState<boolean>(false)
  const MMDinWallet = Number(useBalance().balance.MMDinWallet)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0 || InputValue <= MMDinWallet) {
      setMessage('')
    } else {
      setMessage('Not enough MMD in Wallet')
    }
  }, [InputValue, MMDinWallet])

  async function Deposit (input: number): Promise<void> {
    setLoading(true)

    try {
      const tx = await MMDContract(metamask).deposit(ethers.utils.parseEther(String(input)), { gasLimit: 300000 })
      await tx.wait()

      const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
      const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
      if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) };

      const MMDinVaultWei = await MMDContract(metamask).vaultBalanceOf(account ?? '')
      const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
      if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) };
    } catch (error) {
      console.log(error)
    }

    setInputValue(0)
    setLoading(false)
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
                        <OperationButton loading={loading} onClick={async () => await Deposit(InputValue) }>
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
  const [loading, setLoading] = useState<boolean>(false)
  const MMDinVault = Number(useBalance().balance.MMDinVault)
  const CMMDinWallet = Number(useBalance().balance.CMMDinWallet)
  const CMMDinVault = Number(useBalance().balance.CMMDinVault)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0) {
      setMessage('')
    } else if (InputValue > MMDinVault) {
      setMessage('Not enough MMD Collateral in Vault')
    } else if (InputValue <= MMDinVault && (MMDinVault - InputValue) * MMDtoCMMD < -CMMDinVault * MinCollateralRatio) {
      if (CMMDinVault >= CMMDinWallet) {
        setMessage('Minimal collateral ratio: 110%. Withdrawal will cause liquidation with 5% discount charged from MMD in Wallet.')
      } else {
        setMessage('Minimal collateral ratio: 110%. Not enough CMMD in Wallet for liquidation. Withdrawal will be cancelled.')
      }
    } else {
      setMessage('')
    }
  }, [InputValue, MMDinVault, CMMDinWallet, CMMDinVault])

  async function Withdraw (input: number): Promise<void> {
    setLoading(true)

    try {
      const tx = await MMDContract(metamask).withdraw(ethers.utils.parseEther(String(input)), { gasLimit: 300000 })
      await tx.wait()

      const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
      const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
      if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) }

      const MMDinVaultWei = await MMDContract(metamask).vaultBalanceOf(account ?? '')
      const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
      if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) }
    } catch (error) {
      console.log(error)
    }

    setInputValue(0)
    setLoading(false)
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
                        <OperationButton loading={loading} onClick={async () => await Withdraw(InputValue)}>
                            Withdraw
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function TransferCMMD (): JSX.Element {
  const metamask = useMetaMask()
  const { account } = metamask
  const { balance, setBalance } = useBalance()
  const [Address, setAddress] = useState<string>('')
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const CMMDinWallet = Number(useBalance().balance.CMMDinWallet)

  useEffect(() => {
    if (isNaN(InputValue) || InputValue === 0 || InputValue <= CMMDinWallet) {
      setMessage('')
    } else {
      setMessage('Not enough CMMD in Wallet')
    }
  }, [InputValue, CMMDinWallet])

  async function Transfer (address: string, input: number): Promise<void> {
    setLoading(true)

    try {
      const tx = await CMMDContract(metamask).transfer(address, ethers.utils.parseEther(String(input)), { gasLimit: 300000 })
      await tx.wait()

      const CMMDinWalletWei = await CMMDContract(metamask).balanceOf(account ?? '')
      const CMMDinWalletEther = CMMDinWalletWei !== null ? +ethers.utils.formatEther(CMMDinWalletWei) : NaN
      if (CMMDinWalletEther !== balance.CMMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: CMMDinWalletEther })) };
    } catch (error) {
      console.log(error)
    }

    setAddress('')
    setInputValue(0)
    setLoading(false)
  }

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
                        <OperationButton loading={loading} onClick={async () => await Transfer(Address, InputValue)}>
                            Transfer
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function BorrowCMMD (): JSX.Element {
  const metamask = useMetaMask()
  const { account } = metamask
  const { balance, setBalance } = useBalance()
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
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

  async function Borrow (input: number): Promise<void> {
    setLoading(true)

    try {
      const tx = await CMMDContract(metamask).borrow(ethers.utils.parseEther(String(input)), { gasLimit: 300000 })
      await tx.wait()

      const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
      const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
      if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) }

      const MMDinVaultWei = await MMDContract(metamask).vaultBalanceOf(account ?? '')
      const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
      if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) }

      const CMMDinWalletWei = await CMMDContract(metamask).balanceOf(account ?? '')
      const CMMDinWalletEther = CMMDinWalletWei !== null ? +ethers.utils.formatEther(CMMDinWalletWei) : NaN
      if (CMMDinWalletEther !== balance.CMMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, CMMDinWallet: CMMDinWalletEther })) }

      const CMMDinVaultWei = await CMMDContract(metamask).vaultBalanceOf(account ?? '')
      const CMMDinVaultEther = CMMDinVaultWei !== null ? +ethers.utils.formatEther(CMMDinVaultWei) : NaN
      if (CMMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, CMMDinVault: CMMDinVaultEther })) }
    } catch (error) {
      console.log(error)
    }

    setInputValue(0)
    setLoading(false)
  }

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
                        <OperationButton loading={loading} onClick={async () => await Borrow(InputValue)}>
                          Borrow
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}

export function RepayCMMD (): JSX.Element {
  const metamask = useMetaMask()
  const { account } = metamask
  const { balance, setBalance } = useBalance()
  const [InputValue, setInputValue] = useState<number>(0)
  const [Message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const MMDinVault = Number(useBalance().balance.MMDinVault)
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
      const CollateralRequired = (-CMMDinVault - InputValue) * InitialCollateralRatio / MMDtoCMMD
      const CollateralExcess = MMDinVault - CollateralRequired
      if (CollateralExcess < 0) {
        setMessage('The collateral ratio after repayment is still below 150%. All MMD Collateral in Vault will be kept unchanged.')
      } else {
        const CollateralOfRepaid = InputValue * InitialCollateralRatio / MMDtoCMMD
        if (CollateralOfRepaid < CollateralExcess) {
          const NewCollateralRatio = String(Math.round((MMDinVault - CollateralOfRepaid) * MMDtoCMMD / (-CMMDinVault - InputValue) * 10000) / 100)
          setMessage('Returns ' + String(Math.round(CollateralOfRepaid * 100) / 100) + ' MMD Collateral to Wallet. Collateral ratio after repayment:' + NewCollateralRatio + '%.')
        } else {
          setMessage('Returns ' + String(Math.round(CollateralExcess * 100) / 100) + ' MMD Collateral to Wallet. Collateral ratio after repayment: 150%')
        }
      }
    }
  }, [InputValue, MMDinVault, CMMDinWallet, CMMDinVault])

  async function Repay (input: number): Promise<void> {
    setLoading(true)

    try {
      const tx = await CMMDContract(metamask).repay(ethers.utils.parseEther(String(input)), { gasLimit: 300000 })
      await tx.wait()

      const MMDinWalletWei = await MMDContract(metamask).balanceOf(account ?? '')
      const MMDinWalletEther = MMDinWalletWei !== null ? +ethers.utils.formatEther(MMDinWalletWei) : NaN
      if (MMDinWalletEther !== balance.MMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, MMDinWallet: MMDinWalletEther })) }

      const MMDinVaultWei = await MMDContract(metamask).vaultBalanceOf(account ?? '')
      const MMDinVaultEther = MMDinVaultWei !== null ? +ethers.utils.formatEther(MMDinVaultWei) : NaN
      if (MMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, MMDinVault: MMDinVaultEther })) }

      const CMMDinWalletWei = await CMMDContract(metamask).balanceOf(account ?? '')
      const CMMDinWalletEther = CMMDinWalletWei !== null ? +ethers.utils.formatEther(CMMDinWalletWei) : NaN
      if (CMMDinWalletEther !== balance.CMMDinWallet) { setBalance(existingBalance => ({ ...existingBalance, CMMDinWallet: CMMDinWalletEther })) }

      const CMMDinVaultWei = await CMMDContract(metamask).vaultBalanceOf(account ?? '')
      const CMMDinVaultEther = CMMDinVaultWei !== null ? +ethers.utils.formatEther(CMMDinVaultWei) : NaN
      if (CMMDinVaultEther !== balance.MMDinVault) { setBalance(existingBalance => ({ ...existingBalance, CMMDinVault: CMMDinVaultEther })) }
    } catch (error) {
      console.log(error)
    }

    setInputValue(0)
    setLoading(false)
  }

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
                        <OperationButton loading={loading} onClick={async () => await Repay(InputValue)}>
                            Repay
                        </OperationButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
  )
}
