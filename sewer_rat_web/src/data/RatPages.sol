// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract RatPages {
    struct Page {
        string data;
        uint256 timesUpdated;
    }

    mapping(uint256 => Page) public Pages;

    bool paused = false;
    address deployer;
    uint256 public price = 10000 * 1 ether;

    ERC721 ratContract = ERC721(0xd21a23606D2746f086f6528Cd6873bAD3307b903);
    ERC20 chizContract = ERC20(0x5c761c1a21637362374204000e383204d347064C);

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

    function pause() public onlyDeployer {
        paused = true;
    }

    function unpause() public onlyDeployer {
        paused = false;
    }

    function withdraw() public onlyDeployer {
        uint256 balance = chizContract.balanceOf(address(this));
        chizContract.transfer(msg.sender, balance);
    }

    function setPrice(uint256 newPrice) public onlyDeployer {
        price = newPrice;
    }

    modifier isRatOwner(uint256 ratId) {
        address owner = ratContract.ownerOf(ratId);
        require(owner == msg.sender, 'sender is not the owner of this rat');
        _;
    }

    function updatePage(uint256 ratId, string memory ratData) public isRatOwner(ratId) {
        Page memory page = Pages[ratId];
        chizContract.transferFrom(msg.sender, address(this), (price * page.timesUpdated) + price);
        Pages[ratId] = Page(ratData, page.timesUpdated == 0 ? 1 : page.timesUpdated + 1);
    }
}

abstract contract ERC20 {
    function transfer(address to, uint256 value) public virtual;

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual;

    function balanceOf(address owner) public virtual returns (uint256 balance);
}

abstract contract ERC721 {
    function transfer(address to, uint256 value) public virtual;

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual;

    function ownerOf(uint256 id) public virtual returns (address owner);
}
