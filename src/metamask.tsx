import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMetaMask } from "metamask-react";
// import { ethers } from 'ethers';
import useSWR from 'swr';
import './component.css';

export function MetaMaskConnection () {
    const { status, connect, account, chainId, ethereum } = useMetaMask();

    if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>
    if (status === "unavailable") return <div>MetaMask not available :(</div>
    if (status === "notConnected") return <Button onClick={connect} sx={{borderRadius:'10rem',border:'1px solid #DDDDDD',backgroundColor:'#DDDDDD',color:'#1C1B1F','&:hover':{backgroundColor:'#2C2B2F',color:'#FFFFFF'}}}>Connect to MetaMask</Button>
    if (status === "connecting") return <LoadingButton loading sx={{borderRadius:'10rem',border:'1px solid #2C2B2F',backgroundColor:'#2C2B2F','& .MuiLoadingButton-loadingIndicator':{color:'#999999'}}}>Connnecting</LoadingButton>
    if (status === "connected") return <div>Account: {account} | Chain ID: {chainId} | Balance: <ETDBalance account={account} /></div>
    return null;
}

// const fetcher = (provider: any) => (...args: any) => {
//   const [method, ...params] = args
//   console.log(method, params)
//   return provider[method](...params)
// }

// function ETDBalance () {
//   const { status, connect, account, chainId, ethereum } = useMetaMask();
//   const provider = new ethers.providers.Web3Provider(ethereum);
//   const { data: balance } = useSWR(['getBalance'], {
//     fetcher: fetcher(provider), refreshInterval: 10000
//   })
  
//   return useMetaMask(), balance;
// }

function ETDBalance (props: {account: string}) {
  const account = props.account;
  const { data: accountETDBalance, error: accountETDBalanceError } = useSWR(
    account,
    async (account) => {
      if (account.length > 0) {
        const res = await fetch('./api/balance/${account}');
        return res.json();
      }
    },
    { refreshInterval: 10000 });
  return accountETDBalance;
}