// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MMDToken.sol";

contract CMMDToken is ERC20 {
    address private _owner;
    string private _name;
    string private _symbol;
    

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => int256) private _vaultBalances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address private _MMDAddress;
    MMDToken private _MMDContract;

    uint public constant MMDtoCMMD = 5;
    uint public constant initialCollateralPercentage = 150;
    uint public constant minCollateralPercentage = 110;



    constructor(address MMDAddress_) ERC20("Consumer Meta Merchant Dot", "CMMD") {
        _owner = msg.sender;
        _mint(msg.sender, 10000*10**18);
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
        uint256 debtAfterBorrow = uint256(-_vaultBalances[msg.sender]) + amount;
        uint256 collateralRequired = debtAfterBorrow * initialCollateralPercentage / 100 / MMDtoCMMD;

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

        _repay(amount, msg.sender);

        emit Repaid(amount);
    }

    event Repaid(uint256 amount);

    function liquidateByMMDContract(uint256 amount, address realSender) external {
        require(msg.sender == _MMDAddress, "Not called by MMD Contract");
        require(amount <= _balances[realSender], "Not enough CMMD to liquidate");
        require(amount <= uint256(-_vaultBalances[realSender]), "Liquidate amount is larger than credited amount");

        _repay(amount, realSender);
    }

    event Liquidated(uint256 amount);

    function _repay(uint256 amount, address realSender) private {
        uint256 debtAfterRepay = uint256(-_vaultBalances[realSender]) - amount;
        uint256 collateralRequired = debtAfterRepay * initialCollateralPercentage / 100 / MMDtoCMMD;
        uint256 MMDCollateralCurrent = _MMDContract.vaultBalanceOf(realSender);

        if (collateralRequired < MMDCollateralCurrent) {
            uint256 collateralExcess = MMDCollateralCurrent - collateralRequired;
            uint256 collateralOfRepaid = amount * initialCollateralPercentage / 100 / MMDtoCMMD;
            if (collateralOfRepaid < collateralExcess) {
                _MMDContract.withdrawByCMMDContract(collateralOfRepaid, realSender);
            } else {
                _MMDContract.withdrawByCMMDContract(collateralExcess, realSender);
            }
        }
        
        _burn(realSender, amount);
        _vaultBalances[realSender] += int256(amount);
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
