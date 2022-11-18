import { styled } from '@mui/material/styles';
import { Grid, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useBalance, ETDtoMMD, MMDtoCMMD, MinCollateralRatio } from './tokenvalue';
import './component.css';

const OperationTextField = styled(TextField)({
    width: '100%',
    '& label':{color:'#999999'},'&:hover label':{color:'#CCCCCC'},'& label.Mui-focused':{color:'#CCCCCC'},
    '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#999999'},'&:hover fieldset': {borderColor: '#CCCCCC'},'&.Mui-focused fieldset': {borderColor: '#CCCCCC'}}, 
    input: {textAlign:'right', color:'#999999',
        '&[type=number]': {'-moz-appearance': 'textfield',},
        '&::-webkit-outer-spin-button': {'-webkit-appearance': 'none', margin: 0, },
        '&::-webkit-inner-spin-button': {'-webkit-appearance': 'none', margin: 0, }}}
);

const OperationButton = styled(Button)({
    height: '100%', width:'100%', marginLeft:'1rem',
    borderRadius:'2rem', border:'1px solid #999999',backgroundColor:'#1C1B1F',color:'#999999',
    '&:hover':{backgroundColor:'#2B2C2F'}}
);

export function TopUpMMD (): JSX.Element {
    const [InputValue, setInputValue] = useState<number>(0);
    const [Message, setMessage] = useState<string>('');
    const ETD = Number(useBalance().balance.ETD);

    useEffect(() => {
        if (InputValue === NaN || InputValue === 0) {
            setMessage('');
        } else if (InputValue / ETDtoMMD <= ETD) {
            setMessage('Needs ' + InputValue / ETDtoMMD + ' ETD');
        } else {
            setMessage('Needs ' + InputValue / ETDtoMMD + ' ETD. Not enough ETD.');
        }
    }, [InputValue]);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                Top Up MMD
            </Grid>
            <Grid item xs={12} sm={8} className='Note'>
                <div className='OperationMessage'>{Message}</div>
            </Grid>
            <Grid item xs={8} sm={1}>
                <OperationTextField size='small' label='MMD'
                    type='number' inputProps={{ min:'0'}}
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <OperationButton onClick={() => TopUpMMDOperator(InputValue)}>
                    Top Up
                </OperationButton>
            </Grid>
        </Grid>
    );
}

export function DepositMMD (): JSX.Element {
    const [InputValue, setInputValue] = useState<number>(0);
    const [Message, setMessage] = useState<string>('');
    const MMDinWallet = Number(useBalance().balance.MMDinWallet);

    useEffect(() => {
        if (InputValue === NaN || InputValue === 0 || InputValue <= MMDinWallet) {
            setMessage('');
        } else {
            setMessage('Not enough MMD in Wallet');
        }
    }, [InputValue]);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                Deposit MMD
            </Grid>
            <Grid item xs={12} sm={8} className='Note'>
                <div className='OperationMessage'>{Message}</div>
            </Grid>
            <Grid item xs={8} sm={1}>
                <OperationTextField size='small' label='MMD'
                    type='number' inputProps={{ min:'0'}}
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <OperationButton onClick={() => DepositMMDOperator(InputValue)}>
                    Deposit
                </OperationButton>
            </Grid>
        </Grid>
    );
}

export function WithdrawMMD (): JSX.Element {
    const [InputValue, setInputValue] = useState<number>(0);
    const [Message, setMessage] = useState<string>('');
    const MMDinVault = Number(useBalance().balance.MMDinVault);

    useEffect(() => {
        if (InputValue === NaN || InputValue === 0 || InputValue <= MMDinVault) {
            setMessage('');
        } else {
            setMessage('Not enough MMD Collateral in Vault');
        }
    }, [InputValue]);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                Withdraw MMD
            </Grid>
            <Grid item xs={12} sm={8} className='Note'>
                <div className='OperationMessage'>{Message}</div>
            </Grid>
            <Grid item xs={8} sm={1}>
                <OperationTextField size='small' label='MMD'
                    type='number' inputProps={{ min:'0'}}
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <OperationButton onClick={() => WithdrawMMDOperator(InputValue)}>
                    Withdraw
                </OperationButton>
            </Grid>
        </Grid>
    );
}

export function TransferCMMD (): JSX.Element {
    const [Address, setAddress] = useState<string>('');
    const [InputValue, setInputValue] = useState<number>(0);
    const [Message, setMessage] = useState<string>('');
    const CMMDinWallet = Number(useBalance().balance.CMMDinWallet);

    useEffect(() => {
        if (InputValue === NaN || InputValue === 0 || InputValue <= CMMDinWallet) {
            setMessage('');
        } else {
            setMessage('Not enough CMMD in Wallet');
        }
    }, [InputValue]);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                Transfer CMMD
            </Grid>
            <Grid item xs={12} sm={6} className='Note'>
                <div className='OperationMessage'>{Message}</div>
            </Grid>
            <Grid item xs={12} sm={2}>
                <Grid item xs={12} sx ={{ paddingRight:'1rem' }}>
                    <OperationTextField size='small' label='Address'
                        InputLabelProps={{ shrink: true }}
                        sx={{ input:{textAlign:'left'} }}
                        type='text'
                        value={Address}
                        onChange={event => setAddress(event.target.value)} />
                </Grid>
            </Grid>
            <Grid item xs={8} sm={1}>
                <OperationTextField size='small' label='CMMD'
                    type='number' inputProps={{ min:'0'}}
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <OperationButton onClick={() => TransferCMMDOperator(InputValue)}>
                    Transfer
                </OperationButton>
            </Grid>
        </Grid>
    );
}

export function BorrowCMMD (): JSX.Element {
    const [InputValue, setInputValue] = useState<number>(0);
    const [Message, setMessage] = useState<string>('');
    const MMDinWallet = Number(useBalance().balance.MMDinWallet);
    const MMDinVault = Number(useBalance().balance.MMDinVault);

    useEffect(() => {
        if (InputValue === NaN || InputValue === 0) {
            setMessage('');
        } else if (InputValue / MMDtoCMMD <= (MMDinWallet + MMDinVault)) {
            if (InputValue / MMDtoCMMD <= MMDinVault) {
                setMessage('Needs ' + InputValue / MMDtoCMMD + ' MMD Collateral in Vault');
            } else {
                setMessage('Needs ' + InputValue / MMDtoCMMD + ' MMD Collateral in Vault. ' + (InputValue / MMDtoCMMD - MMDinVault) + ' MMD will be transferred from Wallet.');
            }
        } else {
            setMessage('Needs ' + InputValue / MMDtoCMMD + ' MMD Collateral in Vault. Not enough MMD from Wallet and Vault.');
        }
    }, [InputValue]);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                Borrow CMMD
            </Grid>
            <Grid item xs={12} sm={8} className='Note'>
                <div className='OperationMessage'>{Message}</div>
            </Grid>
            <Grid item xs={8} sm={1}>
                <OperationTextField size='small' label='CMMD'
                    type='number' inputProps={{ min:'0'}}
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <OperationButton onClick={() => BorrowCMMDOperator(InputValue)}>
                    Borrow
                </OperationButton>
            </Grid>
        </Grid>
    );
}

export function RepayCMMD (): JSX.Element {
    const [InputValue, setInputValue] = useState<number>(0);
    const [Message, setMessage] = useState<string>('');
    const CMMDinWallet = Number(useBalance().balance.CMMDinWallet);
    const CMMDinVault = Number(useBalance().balance.CMMDinVault);

    useEffect(() => {
        if (InputValue === NaN || InputValue === 0) {
            setMessage('');
        } else if (InputValue >= -CMMDinVault) {
            setMessage('Input value larger then CMMD credited')
        } else if (InputValue >= CMMDinWallet) {
            setMessage('Not enough CMMD in Wallet');
        } else {
            setMessage('Returns ' + InputValue * MMDtoCMMD + ' MMD Collateral to Wallet');
        }
    }, [InputValue]);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                Repay CMMD
            </Grid>
            <Grid item xs={12} sm={8} className='Note'>
                <div className='OperationMessage'>{Message}</div>
            </Grid>
            <Grid item xs={8} sm={1}>
                <OperationTextField size='small' label='CMMD'
                    type='number' inputProps={{ min:'0'}}
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={4} sm={1}>
                <OperationButton onClick={() => RepayCMMDOperator(InputValue)}>
                    Repay
                </OperationButton>
            </Grid>
        </Grid>
    );
}

function TopUpMMDOperator (input: number): void {

}

function DepositMMDOperator (input: number): void {

}

function WithdrawMMDOperator (input: number): void {

}

function TransferCMMDOperator (input: number): void {

}

function BorrowCMMDOperator (input: number): void {

}

function RepayCMMDOperator (input: number): void {

}