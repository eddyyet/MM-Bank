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
    uint public constant initialCollateralRatio = 1;
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
        uint256 MMDWalletCurrent = _MMDContract.balanceOf(msg.sender);
        uint256 MMDCollateralCurrent = _MMDContract.vaultBalanceOf(msg.sender);
        uint256 MMDAvailable = MMDWalletCurrent + MMDCollateralCurrent;
        uint256 totalDebtAfterBorrow = uint256(-_vaultBalances[msg.sender]) + amount;
        uint256 collateralRequired = totalDebtAfterBorrow * initialCollateralPercentage / 100 / MMDtoCMMD;

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

    // function borrow(uint amount, address addr) external {
    //     MMDToken mmd = MMDToken(_MMDaddress);
    //     address mmdSender = mmd.setSender(addr);
    //     console.log("MMD sender:", mmdSender);
    //     setSender(addr);
    //     console.log("cMMD sender:", sender);
    //     console.log("MMD sender mmd:", mmd.balanceOf(mmdSender) + mmd.vaultBalanceOf(mmdSender));
    //     uint256 collateral = (amount * initialCollateralPercentage)/100;
    //     console.log("collateral:", collateral);
    //     require((mmd.balanceOf(sender) + mmd.vaultBalanceOf(sender)) >= collateral, "Not enough MMD in Wallet and Vault");
    //     if (mmd.vaultBalanceOf(sender) < collateral){
    //         mmd.deposit(collateral - mmd.vaultBalanceOf(sender), mmdSender);
    //     }
    //     _mint(sender, amount);
    //     // _vaultBalances[sender] -= uint256(int256(collateral)); // feeling something weird about this line
    //     _vaultBalances[sender] += collateral;
    // }

    // function repay(uint amount, address addr) external {
    //     MMDToken mmd = MMDToken(_MMDaddress);
    //     address mmdSender = mmd.setSender(addr);
    //     setSender(addr);
    //     require(_balances[sender] >= amount, "Not enough CMMD in Wallet");
    //     require(uint256(int256(_vaultBalances[sender]) * -1) >= amount, "Over pay CMMD in Vault");
    //     _burn(sender, amount);
    //     // _vaultBalances[sender] += amount;
    //     _vaultBalances[sender] -= amount;
    //     if (_balances[sender] * initialCollateralPercentage <= mmd.vaultBalanceOf(mmdSender)*100){
    //         if (mmd.vaultBalanceOf(mmdSender) >= (amount * initialCollateralPercentage)/100){
    //             mmd.withdraw((amount * initialCollateralPercentage)/100, mmdSender);
    //         } else if (mmd.vaultBalanceOf(mmdSender) < (amount * initialCollateralPercentage)/100 && mmd.vaultBalanceOf(mmdSender) >= (amount * minCollateralPercentage)/100){
    //             mmd.withdraw(mmd.vaultBalanceOf(mmdSender), mmdSender);
    //         }
    //     }
    // }

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