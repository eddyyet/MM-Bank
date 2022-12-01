// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MMDToken.sol";

contract CMMDToken is ERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => int256) private _vaultBalances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address private _owner;
    address private _MMDAddress;
    MMDToken private _MMDContract;

    uint256 private _totalSupply;
    uint public constant initialCollateralPercentage = 150;
    uint public constant minCollateralPercentage = 110;
    uint public constant MMDtoCMMD = 5;

    string private _name;
    string private _symbol;

    constructor(address MMDAddress_) ERC20("Consumer Meta Merchant Dot", "CMMD") {
        _owner = msg.sender;
        _MMDAddress = MMDAddress_;
        _MMDContract = MMDToken(_MMDAddress);
    }

    function MMDAddress() external view returns (address) {
        return _MMDAddress;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function vaultBalanceOf(address account) public view returns (int256) {
        return _vaultBalances[account];
    }

    function borrow(uint256 amount) external {
        uint256 totalDebtAfterBorrow = uint256(-_vaultBalances[msg.sender]) + amount;
        uint256 collateralRequired = totalDebtAfterBorrow * initialCollateralPercentage / 100 / MMDtoCMMD;

        uint256 MMDWalletCurrent = _MMDContract.balanceOf(msg.sender);
        uint256 MMDCollateralCurrent = _MMDContract.vaultBalanceOf(msg.sender);
        uint256 MMDAvailable = MMDWalletCurrent + MMDCollateralCurrent;

        require(collateralRequired <= MMDAvailable, "Not enough MMD as collateral");

        if (MMDCollateralCurrent < collateralRequired) {
            uint256 collateralShortfall = collateralRequired - MMDCollateralCurrent;
            _MMDContract.depositByCMMDContract(collateralShortfall, msg.sender);
        }

        _mint(msg.sender, amount);
        _vaultBalances[msg.sender] -= int256(amount);

        emit Borrowed(amount);
    }

    event Borrowed(uint256 amount);

    function repay(uint256 amount) external {
        require(amount <= _balances[msg.sender], "Not enough CMMD to repay");
        require(amount <= uint256(-_vaultBalances[msg.sender]), "Repay amount is larger than credited amount");

        uint256 totalDebtAfterRepay = uint256(-_vaultBalances[msg.sender]) - amount;
        uint256 collateralRequired = totalDebtAfterRepay * initialCollateralPercentage / 100 / MMDtoCMMD;

        uint256 MMDCollateralCurrent = _MMDContract.vaultBalanceOf(msg.sender);

        if (collateralRequired < MMDCollateralCurrent) {
            uint256 collateralExcess = MMDCollateralCurrent - collateralRequired;
            uint256 collateralOfRepaid = amount * initialCollateralPercentage / 100 / MMDtoCMMD;
            if (collateralOfRepaid < collateralExcess) {
                _MMDContract.withdrawByCMMDContract(collateralOfRepaid, msg.sender);
            } else {
                _MMDContract.withdrawByCMMDContract(collateralExcess, msg.sender);
            }
        }

        _burn(msg.sender, amount);
        _vaultBalances[msg.sender] += int256(amount);

        emit Repaid(amount);
    }

    event Repaid(uint256 amount);

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