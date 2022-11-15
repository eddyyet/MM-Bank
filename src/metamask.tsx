// import { CheckCircle } from "@mui/icons-material";
// import { LoadingButton } from "@mui/lab";
// import {
//   Collapse,
//   Divider,
//   Stack,
//   Button,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMetaMask } from "metamask-react";
import './component.css';

export function MetaMaskConnection () {
    const { status, connect, account, chainId, ethereum } = useMetaMask();

    if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>
    if (status === "unavailable") return <div>MetaMask not available :(</div>
    if (status === "notConnected") return <Button onClick={connect} sx={{borderRadius:'10rem',border:'1px solid #DDDDDD',backgroundColor:'#DDDDDD',color:'#1C1B1F','&:hover':{backgroundColor:'#2C2B2F',color:'#FFFFFF'}}}>Connect to MetaMask</Button>
    if (status === "connecting") return <LoadingButton loading sx={{borderRadius:'10rem',border:'1px solid #2C2B2F',backgroundColor:'#2C2B2F','& .MuiLoadingButton-loadingIndicator':{color:'#999999'}}}>Connnecting</LoadingButton>
    if (status === "connected") return <div>Account: {account} | Chain ID: {chainId}</div>
    return null;
}