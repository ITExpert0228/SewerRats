// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

contract ChizShop is IERC721Receiver {
    struct Product {
        bool exists;
        uint256 price;
        uint256 tokenId;
        address contractAddress;
        bool multiple;
    }

    mapping(string => Product) public Products;

    address shopManager;
    bool paused;

    event ProductCreated(string slug);
    event ProductSold(string slug);
    event ProductDeleted(string slug);
    event ProductPurchased(string slug, address owner);

    ERC20 chizToken = ERC20(0x5c761c1a21637362374204000e383204d347064c);

    modifier onlyShopManager() {
        require(msg.sender == shopManager, 'you must be the shop manager to use this function');
        _;
    }

    modifier pauseable() {
        require(paused == false, 'contract is paused');
        _;
    }

    constructor() {
        shopManager = msg.sender;
    }

    function pause() public onlyShopManager {
        paused = true;
    }

    function unpause() public onlyShopManager {
        paused = false;
    }

    function setToken(address contractAddress) public pauseable onlyShopManager {
        chizToken = ERC20(contractAddress);
    }

    function setShopManager(address newShopManager) public pauseable onlyShopManager {
        shopManager = newShopManager;
    }

    function withdraw(uint256 withdrawAmount) public pauseable onlyShopManager {
        chizToken.transfer(msg.sender, withdrawAmount);
    }

    function createProduct(
        string memory slug,
        uint256 price,
        uint256 tokenId,
        address contractAddress,
        bool multiple
    ) public pauseable onlyShopManager {
        Product memory product = Products[slug];
        require(product.exists == false, 'a product with this slug already exists');

        ERC721 tokenContract = ERC721(contractAddress);

        if (!multiple) {
            address tokenOwner = tokenContract.ownerOf(tokenId);
            require(tokenOwner == address(this), 'contract is not the owner of this token');
        } else {
            uint256 balance = tokenContract.balanceOf(address(this));
            require(balance != 0, 'contract does not own any of these tokens');
        }

        Products[slug] = Product(true, price, tokenId, contractAddress, multiple);
        emit ProductCreated(slug);
    }

    function deleteProduct(string memory slug) public pauseable onlyShopManager {
        delete Products[slug];
        emit ProductDeleted(slug);
    }

    function purchaseProduct(string memory slug) public payable pauseable {
        Product memory product = Products[slug];
        require(product.exists == true, 'a product with this slug does not exist');

        ERC721 tokenContract = ERC721(product.contractAddress);
        uint256 tokenId;

        if (product.multiple) {
            tokenId = tokenContract.tokenOfOwnerByIndex(address(this), 0);
        } else {
            tokenId = product.tokenId;
            address tokenOwner = tokenContract.ownerOf(tokenId);
            require(tokenOwner == address(this), 'contract is sold out of these tokens');
        }

        chizToken.transferFrom(msg.sender, address(this), product.price);
        tokenContract.transferFrom(address(this), msg.sender, tokenId);

        Products[slug] = Product(true, product.price, product.tokenId, product.contractAddress, product.multiple);
        emit ProductPurchased(slug, msg.sender);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

abstract contract ERC721 {
    function ownerOf(uint256 id) public virtual returns (address owner);

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual;

    function balanceOf(address owner) public virtual returns (uint256 amount);

    function tokenOfOwnerByIndex(address owner, uint256 tokenId) public virtual returns (uint256 index);
}

abstract contract ERC20 {
    function allowance(address owner, address spender) public virtual;

    function transfer(address to, uint256 value) public virtual;

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual;
}
