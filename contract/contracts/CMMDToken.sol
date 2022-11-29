// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MMDToken.sol";

contract CMMDToken is ERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _vaultBalances;
    mapping(address => mapping(address => uint256)) private _allowances;
    // mapping(address => MMDToken) _MMDContract;
    address private _MMDaddress;
    // MMDToken private MMD;

    uint256 private _totalSupply;
    uint public constant initialCollateralPercentage = 150;
    uint public constant minCollateralPercentage = 110;

    string private _name;
    string private _symbol;

    // uint256 private _MMDContract = MMDToken.balanceOf(msg.sender);

    constructor(address MMDaddress_) ERC20("Consumer Meta Merchant Dot", "CMMD") {
        _MMDaddress = MMDaddress_;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function vaultBalanceOf(address account) public view returns (uint256) {
        return _vaultBalances[account];
    }

    function linkMMDContract() public {
        // if (_MMDContract[msg.sender] != MMDToken(0)) {
        //     _MMDContract[msg.sender] = new MMDToken(msg.sender);
        // }
        // if (_MMDContract.balanceOf(msg.sender) == 0) {
        //     _MMDContract[msg.sender] = new MMDToken(msg.sender);
        // }
        // burn mmd tokens
        // _MMDContract[msg.sender].withdraw(_MMDContract[msg.sender].balanceOf(msg.sender));
    }

    function borrow(uint amount/*, address addr*/) external {
        // linkMMDContract();
        // _MMDContract[msg.sender].decreaseVault(amount);
        console.log("msg.sender: %s", msg.sender);
        MMDToken mmd = MMDToken(_MMDaddress);
        mmd.decreaseVault(amount);
        _balances[msg.sender] += amount;    
    }

    function repay(uint amount/*, address addr*/) external {
        MMDToken mmd = MMDToken(_MMDaddress);
        // mmd.increaseVault(amount);
        _balances[msg.sender] -= amount;
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