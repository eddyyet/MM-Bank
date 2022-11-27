// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MMDToken is ERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _vaultBalances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    
    constructor() ERC20("MMD", "MMD") {
        _mint(msg.sender, 25000*10**18);
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function vaultBalanceOf(address account) public view returns (uint256) {
        return _vaultBalances[account];
    }

    function _mint(address account, uint256 amount) internal override {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        unchecked {
            _balances[account] += amount;
        }
    }

    function _burn(address account, uint256 amount) internal override {
        require(account != address(0), "ERC20: burn from the zero address");
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            _totalSupply -= amount;
        }
    }

    function buy() payable external {
        uint256 amount = msg.value * 1000;
        _mint(msg.sender, amount);
        emit Bought(amount);
    }

    event Bought(uint256 amount);

    function sell(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Not enough MMD in Wallet");
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount / 1000);
        emit Sold(amount);
    }

    event Sold(uint256 amount);

    function deposit(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Not enough MMD in Wallet");
        _balances[msg.sender] = balanceOf(msg.sender) - amount;
        _vaultBalances[msg.sender] += vaultBalanceOf(msg.sender) + amount;
        emit Deposited(amount);
    }

    event Deposited(uint256 amount);

    function withdraw(uint256 amount) external {
        require(vaultBalanceOf(msg.sender) >= amount, "Not enough MMD Collteral in Vault");
        _balances[msg.sender] = balanceOf(msg.sender) + amount;
        _vaultBalances[msg.sender] += vaultBalanceOf(msg.sender) - amount;
        emit Withdrawn(amount);
    }

    event Withdrawn(uint256 amount);

    // function buy() payable public {
    //     uint256 amountTobuy = msg.value;
    //     uint256 Balance = token.balanceOf(address(this));
    //     require(amountTobuy > 0, "You need to send some ether");
    //     require(amountTobuy <= Balance, "Not enough tokens in the reserve");
    //     token.transfer(msg.sender, amountTobuy);
    //     emit Bought(amountTobuy);
    // }

    // function sell(uint256 amount) public {
    //     require(amount > 0, "You need to sell at least some tokens");
    //     uint256 allowance = token.allowance(msg.sender, address(this));
    //     require(allowance >= amount, "Check the token allowance");
    //     token.transferFrom(msg.sender, address(this), amount);
    //     payable(msg.sender).transfer(amount);
    //     emit Sold(amount);
    // }
}