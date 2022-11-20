// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract cMMDToken is ERC20 {
    constructor() ERC20("cMMD", "cMMD") {
        _mint(msg.sender, 5000);
    }
}