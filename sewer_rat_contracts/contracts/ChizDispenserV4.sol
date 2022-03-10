/**
 *Submitted for verification at Etherscan.io on 2021-09-19
*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract ChizDispenserV4 {
    mapping(uint256 => uint256) public existingClaims;
    ERC20 public chizContract;
    ERC721 public ratContract;
    ERC721 public cheddazContract;
    bool public paused = false;
    address public deployer  = address(0x0);
    uint256 public amount = 560 * 1 ether;
    uint256 public amountPerday = 0.01 ether;

    uint256 private duration = 1 days;
    mapping(address => uint256) public userLastClaimedTime;
    mapping(address => uint256) public userClaimedERC20Amount;
    uint256 private defaultTime = block.timestamp;
    event Dispense(uint256 amount, uint256 ratId);

    constructor() {
        deployer = msg.sender;
    }
    function initialize(address chizAddress, address ratAddress, address chedAddress) public onlyDeployer{
        require(chizAddress != address(0) && ratAddress != address(0) && chedAddress != address(0), 'invalid address');
        chizContract = ERC20(chizAddress);
        ratContract = ERC721(ratAddress);
        cheddazContract = ERC721(chedAddress);
    }
    modifier onlyDeployer() {
        require(msg.sender == deployer);
        _;
    }

    modifier pauseable() {
        require(paused == false, 'contract is paused');
        _;
    }

    modifier isNotClaimed(uint256 ratId) {
        bool claimed = isClaimed(ratId);
        require(claimed == false, 'tokens for this rat have already been claimed');
        _;
    }

    function isClaimed(uint256 ratId) public view returns (bool) {
        uint256 claim = existingClaims[ratId];
        if (claim >= amount) return true;
        return false;
    }

    function pause() public onlyDeployer {
        paused = true;
    }

    function unpause() public onlyDeployer {
        paused = false;
    }

    function setAmount(uint256 newAmount) public onlyDeployer pauseable {
        amount = newAmount;
    }
    function setAmountPerDay(uint256 newAmount) public onlyDeployer pauseable {
        amountPerday = newAmount;
    }

    function withdraw(uint256 withdrawAmount) public onlyDeployer pauseable {
        chizContract.transfer(msg.sender, withdrawAmount);
    }

    function claimChiz(uint256 ratId) public pauseable isNotClaimed(ratId) {
        address ratOwner = ratContract.ownerOf(ratId);
        require(msg.sender == ratOwner, 'caller is not owner of this rat');

        uint256 amountMinusClaimed = amount - existingClaims[ratId];
        uint256 cheddazBalance = cheddazContract.balanceOf(msg.sender);

        uint256 rewardPercentage = 0;
        if (cheddazBalance >= 1) rewardPercentage = 1;
        if (cheddazBalance >= 5) rewardPercentage = 5;
        if (cheddazBalance >= 10) rewardPercentage = 10;

        uint256 totalChiz = amountMinusClaimed + ((amountMinusClaimed * rewardPercentage) / 100);

        existingClaims[ratId] += amountMinusClaimed;
        chizContract.transfer(msg.sender, totalChiz);

        emit Dispense(totalChiz, ratId);
    }

    function multiClaimChiz(uint256[] memory ratIds) public pauseable {
        for (uint256 i = 0; i < ratIds.length; i++) {
            bool claimed = isClaimed(ratIds[i]);
            if (!claimed) claimChiz(ratIds[i]);
        }
    }

    function megaClaimChiz() public pauseable {
        uint256 ratBalance = ratContract.balanceOf(msg.sender);
        for (uint256 i = 0; i < ratBalance; i++) {
            uint256 tokenId = ratContract.tokenOfOwnerByIndex(msg.sender, i);
            bool claimed = isClaimed(tokenId);
            if (!claimed) claimChiz(tokenId);
        }
    }
    function rewardPercentage(address user) public view returns(uint) {
        uint256 cheddazBalance = cheddazContract.balanceOf(user);

        uint256 _percentage = 0;
        if (cheddazBalance >= 1) _percentage = 1;
        if (cheddazBalance >= 5) _percentage = 5;
        if (cheddazBalance >= 10) _percentage = 10;
        return _percentage;
    }
    function claimChizExt() public pauseable {
        uint256 totalChiz = claimableRewards(address(msg.sender));
        require(totalChiz > 0, '0 rewards');
        require(chizContract.balanceOf(address(this)) >= totalChiz, "insufficent token balance");

        chizContract.transfer(msg.sender, totalChiz);
        
        userClaimedERC20Amount[msg.sender] += totalChiz;
        userLastClaimedTime[msg.sender] = block.timestamp;
    }
    function claimableRewards(address user_) public view returns(uint256) {
        uint256 cDays = claimableDays(user_);
        uint256 dearn = dailyEarn(user_);
        uint256 totalChiz = cDays * dearn;
        return totalChiz;
    }
    function dailyEarn(address user_) public view returns(uint256) {
        uint256 ratBalance = ratContract.balanceOf(user_);
        uint256 _perc = rewardPercentage(user_);
        uint256 chizPerday = (ratBalance * amountPerday * _perc) / 100;
        return chizPerday;
    }
    function claimableDays(address user) public view returns (uint) {
        if(userLastClaimedTime[user] > 0)
            return (block.timestamp - userLastClaimedTime[user]) / duration;
        else
            return (block.timestamp - defaultTime) / duration;
    }
}

abstract contract ERC721 {
    function ownerOf(uint256 id) public virtual returns (address owner);

    function balanceOf(address owner) public view virtual returns (uint256 balance);

    function totalSupply() public view virtual returns (uint256 supply);

    function tokenOfOwnerByIndex(address owner, uint256 index) public virtual returns (uint256 id);
}

abstract contract ERC20 {
    function transfer(address to, uint256 value) public virtual;
    function balanceOf(address account) external view virtual returns (uint256);
}