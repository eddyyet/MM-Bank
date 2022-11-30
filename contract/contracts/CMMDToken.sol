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
    uint public constant initialCollateralRatio = 1;

    string private _name;
    string private _symbol;

    address public sender;

    // uint256 private _MMDContract = MMDToken.balanceOf(msg.sender);

    constructor(address MMDaddress_) ERC20("Consumer Meta Merchant Dot", "CMMD") {
        _MMDaddress = MMDaddress_;
    }

    function setSender() public {
        (bool success, bytes memory data) = _MMDaddress.delegatecall(
            abi.encodeWithSignature("setSender()")
        );
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function vaultBalanceOf(address account) public view returns (uint256) {
        return _vaultBalances[account];
    }

    function borrow(uint amount/*, address addr*/) external {
        MMDToken mmd = MMDToken(_MMDaddress);
        uint256 collateral = amount * initialCollateralPercentage;
        require(mmd.balanceOf(sender) + mmd.vaultBalanceOf(sender) >= collateral, "Not enough MMD in Wallet and Vault");
        if (mmd.vaultBalanceOf(sender) < collateral){
            mmd.deposit(collateral - mmd.vaultBalanceOf(sender)/*, addr*/);
        }
        _mint(sender, amount);
        _vaultBalances[msg.sender] -= uint256(int256(collateral)); // feeling something weird about this line
    }

    function repay(uint amount/*, address addr*/) external {
        MMDToken mmd = MMDToken(_MMDaddress);
        require(_balances[sender] >= amount, "Not enough CMMD in Wallet");
        require(uint256(int256(_vaultBalances[sender]) * -1) >= amount, "Over pay CMMD in Vault");
        _burn(sender, amount);
        _vaultBalances[sender] += amount;
        if (_balances[sender] * initialCollateralPercentage <= mmd.vaultBalanceOf(sender)){
            if (mmd.vaultBalanceOf(sender) >= amount * initialCollateralPercentage){
                mmd.withdraw(amount * initialCollateralPercentage/*, addr*/);
            } else if (mmd.vaultBalanceOf(sender) < amount * initialCollateralPercentage && mmd.vaultBalanceOf(sender) >= amount * minCollateralPercentage){
                mmd.withdraw(mmd.vaultBalanceOf(sender)/*, addr*/);
            }
        }
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