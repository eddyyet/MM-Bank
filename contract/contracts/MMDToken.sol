// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MMDToken is ERC20 {

    ERC20 public token;

    constructor() ERC20("MMD", "MMD") {
        _mint(msg.sender, 1000);
    }

    function mintMinerReward() public {
        _mint(block.coinbase, 1000);
    }

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    

    function buy() payable public {
        uint256 amountTobuy = msg.value;
        uint256 Balance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some ether");
        require(amountTobuy <= Balance, "Not enough tokens in the reserve");
        token.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }

    function deposit(uint256 amount) public {
        uint256 Balance = token.balanceOf(address(this));
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        // vaultBalances[msg.sender] += amount;

    }

}