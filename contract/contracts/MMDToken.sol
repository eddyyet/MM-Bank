// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./CMMDToken.sol";

contract MMDToken is ERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _vaultBalances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    address private _owner;
    address private _CMMDAddress;

    string private _name;
    string private _symbol;
    
    constructor() ERC20("Meta Merchant Dot", "MMD") {
        _owner = msg.sender;
        _mint(msg.sender, 25000*10**18);
    }

    function setCMMDAddress(address CMMDAdress_) external onlyOwner {
        _CMMDAddress = CMMDAdress_;
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
        require(_balances[msg.sender] >= amount, "Not enough MMD in Wallet");
        _balances[msg.sender] -= amount;
        _vaultBalances[msg.sender] += amount;
        emit Deposited(amount);
    }

    event Deposited(uint256 amount);

    function withdraw(uint256 amount) external {
        require(_vaultBalances[msg.sender] >= amount, "Not enough MMD Collteral in Vault");
        _balances[msg.sender] += amount;
        _vaultBalances[msg.sender] -= amount;
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