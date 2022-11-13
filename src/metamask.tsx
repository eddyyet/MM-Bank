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

export function MetaMaskConnection () {
    const { status, connect, account, chainId, ethereum } = useMetaMask();

    if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>
    if (status === "unavailable") return <div>MetaMask not available :(</div>
    if (status === "notConnected") return <Button variant='outlined' onClick={connect}>Connect to MetaMask</Button>
    if (status === "connecting") return <LoadingButton loading variant='outlined'>Connecting to Metamask</LoadingButton>
    if (status === "connected") return <div>Account: {account} | Chain ID: {chainId}</div>
    return null;
}