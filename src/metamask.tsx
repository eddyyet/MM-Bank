import { useState } from 'react';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMetaMask } from 'metamask-react';
import { ethers } from 'ethers';

export default function MetaMaskConnection () {
    const { status, connect, account, chainId, ethereum } = useMetaMask();
    const [balance, setBalance] = useState();

    async function getBalance() {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const firstAccount = accounts[0];
      const balance = await ethereum.request({method: 'eth_getBalance', params: [firstAccount, 'latest'],});
      setBalance(balance);
    }
    getBalance();

    const balanceDisplay = balance ? ethers.utils.formatEther(balance) : '0.0';

    if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>
    if (status === "unavailable") return <div>MetaMask not available :</div>
    if (status === "notConnected") return <Button onClick={connect} sx={{borderRadius:'10rem',border:'1px solid #DDDDDD',backgroundColor:'#DDDDDD',color:'#1C1B1F','&:hover':{backgroundColor:'#2C2B2F',color:'#FFFFFF'}}}>Connect to MetaMask</Button>
    if (status === "connecting") return <LoadingButton loading sx={{borderRadius:'10rem',border:'1px solid #2C2B2F',backgroundColor:'#2C2B2F','& .MuiLoadingButton-loadingIndicator':{color:'#999999'}}}>Connnecting</LoadingButton>
    if (status === "connected") return <div>Account: {account} | Chain ID: {chainId} | ETD balance: {balanceDisplay}</div>
    return null;
}