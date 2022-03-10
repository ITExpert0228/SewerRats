/**
 *Submitted for verification at FtmScan.com on 2021-09-04
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract ChizDispenserV3 {
    mapping(uint256 => uint256) public existingClaims;

    ERC20 chizContract = ERC20(0xD88cA221231A44A42eC47F978CAD87Ac66e3bbCa);
    ERC721 ratContract = ERC721(0x8d549DF2dfC9e9cD0EC660A09a4DfAE820067282);
    ERC721 cheddazContract = ERC721(0x4A8a92334482821a0ac27e88cc34F33e344E3Df9);

    bool paused = false;
    address deployer = address(0x0);
    uint256 public rewardPerRat = 10000 * 1 ether;

    event Dispense(uint256 amount, address to);

    constructor() {
        deployer = msg.sender;
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
        if (claim >= rewardPerRat) return true;
        return false;
    }

    function pause() public onlyDeployer {
        paused = true;
    }

    function unpause() public onlyDeployer {
        paused = false;
    }

    function setAmount(uint256 newAmount) public onlyDeployer pauseable {
        rewardPerRat = newAmount;
    }

    function withdraw(uint256 withdrawAmount) public onlyDeployer pauseable {
        chizContract.transfer(msg.sender, withdrawAmount);
    }

    function claimChiz(uint256 ratId) public pauseable isNotClaimed(ratId) {
        address ratOwner = ratContract.ownerOf(ratId);
        require(msg.sender == ratOwner, 'caller is not owner of this rat');

        uint256 amountMinusClaimed = rewardPerRat - existingClaims[ratId];
        uint256 cheddazBalance = cheddazContract.balanceOf(msg.sender);

        uint256 rewardPercentage = 0;
        if (cheddazBalance >= 1) rewardPercentage = 1;
        if (cheddazBalance >= 5) rewardPercentage = 5;
        if (cheddazBalance >= 10) rewardPercentage = 10;

        uint256 totalChiz = amountMinusClaimed + ((amountMinusClaimed * rewardPercentage) / 100);

        existingClaims[ratId] += amountMinusClaimed;
        chizContract.transfer(msg.sender, totalChiz);

        emit Dispense(totalChiz, msg.sender);
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
}

abstract contract ERC721 {
    function ownerOf(uint256 id) public virtual returns (address owner);

    function balanceOf(address owner) public virtual returns (uint256 balance);

    function totalSupply() public virtual returns (uint256 supply);

    function tokenOfOwnerByIndex(address owner, uint256 index) public virtual returns (uint256 id);
}

abstract contract ERC20 {
    function transfer(address to, uint256 value) public virtual;
}
