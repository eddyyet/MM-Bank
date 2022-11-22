pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MSBD5017Token is ERC20 {
    constructor() ERC20("MSBD5017", "M57") {
        _mint(msg.sender, 3500*10**18);
    }

    function buy() payable public {
        uint256 amount = msg.value * 1000;
        _mint(msg.sender, amount);
    }
}