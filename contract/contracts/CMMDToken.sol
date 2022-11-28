// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CMMDToken is ERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _vaultBalances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => MMDToken) _MMDContract;

    uint256 private _totalSupply;
    uint public constant initialCollateralPercentage = 150;
    uint public constant minCollateralPercentage = 110;

    string private _name;
    string private _symbol;

    constructor() ERC20("Consumer Meta Merchant Dot", "CMMD") {}

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function vaultBalanceOf(address account) public view returns (uint256) {
        return _vaultBalances[account];
    }

    function linkMMDContract() public {
        if (_MMDContract[msg.sender] != MMDToken(0)) {
            _MMDContract[msg.sender] = new MMDToken(msg.sender);
        }
    }

    function borrow(uint amount) external {
        linkMMDContract();
        
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }
        emit Transfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal override {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        unchecked {
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal override {
        require(account != address(0), "ERC20: burn from the zero address");
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            _totalSupply -= amount;
        }
        emit Transfer(account, address(0), amount);
    }
}