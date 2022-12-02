// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./CMMDToken.sol";

contract MMDToken is ERC20 {
    address private _owner;
    string private _name;
    string private _symbol;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _vaultBalances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address private _CMMDAddress;
    CMMDToken private _CMMDContract;

    uint public constant ETDtoMMD = 1000;
    uint public constant MMDtoCMMD = 5;
    uint public constant initialCollateralPercentage = 150;
    uint public constant minCollateralPercentage = 110;
    uint public constant liquidationDiscountPercentage = 5;

    constructor() ERC20("Meta Merchant Dot", "MMD") {
        _owner = msg.sender;
        _mint(msg.sender, 25000*10**18);
    }

    function setCMMDAddress(address CMMDAdress_) external onlyOwner {
        _CMMDAddress = CMMDAdress_;
        _CMMDContract = CMMDToken(_CMMDAddress);
    }

    function CMMDAddress() external view returns (address) {
        return _CMMDAddress;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function vaultBalanceOf(address account) public view returns (uint256) {
        return _vaultBalances[account];
    }

    function buy() payable external {
        uint256 amount = msg.value * ETDtoMMD;
        _mint(msg.sender, amount);
        emit Bought(amount);
    }

    event Bought(uint256 amount);

    function sell(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Not enough MMD in Wallet");
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount / ETDtoMMD);
        emit Sold(amount);
    }

    event Sold(uint256 amount);

    function deposit(uint256 amount) external {
        require(_balances[msg.sender] >= amount, "Not enough MMD in Wallet");
        _balances[msg.sender] -= amount;
        _vaultBalances[msg.sender] += amount;
        emit Deposited(amount);
    }

    function depositByCMMDContract(uint256 amount, address realSender) external {
        require(msg.sender == _CMMDAddress, "Not called by CMMD Contract");
        require(_balances[realSender] >= amount, "Not enough MMD in Wallet");
        _balances[realSender] -= amount;
        _vaultBalances[realSender] += amount;
        emit Deposited(amount);
    }

    event Deposited(uint256 amount);

    function withdraw(uint256 amount) external {
        require(_vaultBalances[msg.sender] >= amount, "Not enough MMD Collteral in Vault");

        uint256 collateralCurrent = _vaultBalances[msg.sender];
        uint256 collateralAfterWithdraw = collateralCurrent - amount;
        uint256 debtCurrent = uint256(-_CMMDContract.vaultBalanceOf(msg.sender));
        uint256 collateralMinimum = debtCurrent * minCollateralPercentage / 100 / MMDtoCMMD;
        
        if (collateralAfterWithdraw >= collateralMinimum) {
            _balances[msg.sender] += amount;
            _vaultBalances[msg.sender] -= amount;
        } else {
            uint256 CMMDAvailable = _CMMDContract.balanceOf(msg.sender);
            uint256 CMMDtoLiquidate;
            if (CMMDAvailable >= debtCurrent) {
                CMMDtoLiquidate = debtCurrent;
            } else {
                CMMDtoLiquidate = CMMDAvailable;
            }

            _CMMDContract.liquidateByMMDContract(CMMDtoLiquidate, msg.sender);

            uint256 collateralReleased = CMMDtoLiquidate / MMDtoCMMD;
            uint256 liquidationDiscount = collateralReleased * liquidationDiscountPercentage / 100;

            uint256 collateralToWithdraw;
            if (collateralCurrent >= collateralReleased + amount) {
                collateralToWithdraw = amount + collateralReleased;
            } else {
                collateralToWithdraw = collateralCurrent;
            }

            _balances[msg.sender] -= liquidationDiscount;
        }

        emit Withdrawn(amount);
    }

    function withdrawByCMMDContract(uint256 amount, address realSender) external {
        require(msg.sender == _CMMDAddress, "Not called by CMMD Contract");
        require(_vaultBalances[realSender] >= amount, "Not enough MMD Collteral in Vault");
        _balances[realSender] += amount;
        _vaultBalances[realSender] -= amount;
        emit Withdrawn(amount);
    }

    event Withdrawn(uint256 amount); 
    
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
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

    modifier onlyOwner {
        require(msg.sender == _owner);
        _;
    }
}
