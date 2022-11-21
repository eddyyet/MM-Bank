// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MMDToken is ERC20 {
    constructor() ERC20("MMD", "MMD") {
        _mint(msg.sender, 1000);
    }

    function mintMinerReward() public {
        _mint(block.coinbase, 1000);
    }

}