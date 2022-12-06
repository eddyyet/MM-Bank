# MM Bank
The **MM Bank** application provides one-stop shop decentralized financial services to both Merchants and Users with its distributed ledger and online teller.

Features:
- Fully **decentralized** - both the application and ledger balances - for security
- Support the **dual token system** (MMD and CMMD) with two smart contracts that interact with each other
- **Deposit**, **withdrawal**, **borrow** and **transfer** for daily economic activities
- **Collateral requirement** (lock MMD to borrow CMMD) and **liquidation** as credit risk control


> This is a course project for MSBD5017 in The Hong Kong University of Science and Technology (HKUST) in Fall 2022-23. The project demostrates the possibility of using blockchain technology to build a decentralized financial application like a centralized bank. The blockchain data is dependent on the maintenance of the Etherdata Blockchain (Testnet). The front-end elements are developed for quick demostration only and may not follow best practices. Comments are welcomed.


## Blockchain information

Etherdata Blockchain (Testnet) - 
RPC URL: https://rpc.debugchain.net, Chain ID: `8348`

MMD Smart Contract `MMDToken`: `0x0D1b6f0180620c7E8Cef155c2524C870887e1728`

CMMD Smart Contract `CMMDToken`: `0x2C33779280B3D6C2201297e6C6de7b58108c4199`

## Visit
MM Bank demo website: https://mm-bank-six.vercel.app

## Contract files

MMD: `./contract/contracts/MMDToken.sol`

CMMD: `./contract/contracts/CMMDToken.sol`

Test to MMD and CMMD operations: `./contract/test/MMDToken.test.ts`

## Local installation 
1. Clone the files down to your directory, `git clone https://github.com/eddyyet/test.git`
2. The repo root directory contains 1 folder, `MM-bank`. Use `cd MM-bank` to enter the folder.
3. Use `npm install` to install the dependencies.
4. Use `npm start` to start the application in your browser.
