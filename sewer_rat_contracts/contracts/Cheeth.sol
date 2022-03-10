// contracts/Cheeth.sol 
// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0; 
 
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; 
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol"; 
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
 
contract Cheeth is ERC20Burnable, Ownable, IERC721Receiver, ERC1155Holder{ 
    /* 
                     
/  __ \ |             | | | | 
| /  \/ |_     ___| |_| | 
| |   | ' \ /  \/  \ _| '_ \ 
| \__/\ | | |  _/  _/ |_| | | | 
 \____/_| |_|\___|\___|\__|_| |_| 
*/ 
 
    using SafeMath for uint256; 
 
    uint256 public MAX_WALLET_STAKED = 10; 
    uint256 public EMISSIONS_RATE = 15000000000000000000; 
    uint256 public TEAM_MAX_MINT_LIMIT = 100000000000; 
    mapping (uint256 => uint256) public EMISSIONS_RATE_1155; //opensea storefront : tokenId => emission_rate
    uint256 public CLAIM_END_TIME = 1799920376; 
 
    address public anonymiceAddress; 
    address public anonymiceAddress1155; 

    uint256 public lastUpdateTime;

    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;
    uint256 private teamMaximumAmount;
 
  /**
    @notice Struct to track what user is staking which tokens
    @dev tokenIds are all the tokens staked by the staker
    @dev rewardsEarned is the total reward for the staker till now
    @dev rewardsReleased is how much reward has been paid to the staker
    */
    struct Staker {
        uint256[] tokenIds;
        mapping (uint256 => uint256) tokenIndex;
        mapping (uint256 => uint) tokenAmount; //for ERC1155
        uint256 lastRewardPoints;
        uint256 rewardsEarned;
        uint256 rewardsReleased;
    }

    /// @notice mapping of a staker to its current properties
    mapping (address => Staker) public stakers;
    mapping (address => Staker) public stakers1155;

    // Mapping from token ID to owner address
    mapping (uint256 => address) public tokenOwner;
    mapping (uint256 => address) public token1155Owner;

    /// @notice sets the token to be claimable or not, cannot claim if it set to false
    bool public tokensClaimable = true;

    /// @notice event emitted when a user has staked a token
    event Staked(address owner, uint256 tokenID, uint256 amount);

    /// @notice event emitted when a user has unstaked a token
    event Unstaked(address owner, uint256 tokenID, uint256 amount);

    /// @notice event emitted when a user claims reward
    event RewardPaid(address indexed user, uint256 reward);
    
    /// @notice Allows reward tokens to be claimed
    event ClaimableStatusUpdated(bool status);

    /// @notice Emergency unstake tokens without rewards
    event EmergencyUnstake(address indexed user, uint256 tokenId);

    constructor() ERC20("Cheeth", "CHEETH") {} 
    function mintForTreasury(address _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "Cheeth.mintForTreasury: zero address");
        require(teamMaximumAmount + _amount <= TEAM_MAX_MINT_LIMIT * 1e18, "Cheeth.mintForTreasury: maximum exceeded");
        _mint(_to, _amount);
        teamMaximumAmount += _amount;
    }
    function setAnonymiceAddress(address _anonymiceAddress, address _anonymiceAddress1155) public onlyOwner { 
        anonymiceAddress = _anonymiceAddress; 
        anonymiceAddress1155 = _anonymiceAddress1155;
        return; 
    }
    function setEmissionsRate(uint256 ratePerDay_) public onlyOwner {
        EMISSIONS_RATE = ratePerDay_;
    }
    function setEmissionsRate1155(uint256 tokenId_, uint256 ratePerDay_) public onlyOwner {
        EMISSIONS_RATE_1155[tokenId_] = ratePerDay_;
    }
    function setClaimEndTime(uint endTimestamp_) public onlyOwner {
        CLAIM_END_TIME = endTimestamp_;
    }
    function setMaxStakedAmount(uint newValue_) public onlyOwner {
        MAX_WALLET_STAKED = newValue_;
    }
    /// @notice Lets admin set the Rewards to be claimable
    function setTokensClaimable(bool _enabled) external onlyOwner{
        tokensClaimable = _enabled;
        emit ClaimableStatusUpdated(_enabled);
    }
    /// @dev Getter functions for Staking contract
    /// @dev Get the tokens staked by a user
    function getStakedTokens(address _user) external view returns (uint256[] memory tokenIds) {
        return stakers[_user].tokenIds;
    }
    function getStakedTokens1155(address _user) external view returns (uint256[] memory tokenIds, uint[] memory amounts) {
        Staker storage staker = stakers1155[_user];
        uint[] memory _amounts = new uint[](staker.tokenIds.length);
        for (uint i = 0; i < staker.tokenIds.length; i++) {
            _amounts[i] = staker.tokenAmount[staker.tokenIds[i]];
        }
        return (staker.tokenIds, _amounts);
    }
    /// @notice Stake NFTs and earn reward tokens. 
    function stake(uint256 tokenId) external {
        _stake(msg.sender, tokenId);
    }
    /// @notice Stake multiple NFTs and earn reward tokens. 
    function stakeBatch(uint256[] memory tokenIds) external {
        for (uint i = 0; i < tokenIds.length; i++) {
            _stake(msg.sender, tokenIds[i]);
        }
    }
    function stakeAll() external {
        IERC721Enumerable parentNFT =  IERC721Enumerable(anonymiceAddress);
        uint256 balance = parentNFT.balanceOf(msg.sender);
        for (uint i = 0; i < balance; i++) {
            _stake(msg.sender, parentNFT.tokenOfOwnerByIndex(msg.sender,i));
        }
    }

    /**
     * @dev All the staking goes through this function
     * @dev Rewards to be given out is calculated
     * @dev Balance of stakers are updated as they stake the nfts based on ether price
    */
    function _stake(address _user, uint256 _tokenId) internal {

        Staker storage staker = stakers[_user];

        require(block.timestamp < CLAIM_END_TIME, "Cheeth._stake: Claim period is over!");
        require(staker.tokenIds.length < MAX_WALLET_STAKED, "Cheeth._stake: max staked amount exceeded ");

        if (staker.lastRewardPoints == 0 ) {
          staker.lastRewardPoints = block.timestamp;
        }

        updateReward(_user);
        staker.tokenIds.push(_tokenId);
        staker.tokenIndex[_tokenId] = staker.tokenIds.length - 1;
        tokenOwner[_tokenId] = _user;
        IERC721Enumerable parentNFT =  IERC721Enumerable(anonymiceAddress);
        parentNFT.safeTransferFrom(_user, address(this), _tokenId);

        emit Staked(_user, _tokenId, 0);
    }
    /// @notice Unstake NFTs. 
    function unstake(uint256 _tokenId) external {
        require(tokenOwner[_tokenId] == msg.sender, "Cheeth._unstake: Sender must have staked tokenID");
        claimReward(msg.sender);
        _unstake(msg.sender, _tokenId);
    }

    /// @notice Stake multiple NFTs and claim reward tokens. 
    function unstakeBatch(uint256[] memory tokenIds) external {
        claimReward(msg.sender);
        for (uint i = 0; i < tokenIds.length; i++) {
            if (tokenOwner[tokenIds[i]] == msg.sender) {
                _unstake(msg.sender, tokenIds[i]);
            }
        }
    }
    /**
     * @dev All the unstaking goes through this function
     * @dev Rewards to be given out is calculated
     * @dev Balance of stakers are updated as they unstake the nfts based on ether price
    */
    function _unstake(address _user, uint256 _tokenId) internal {

        Staker storage staker = stakers[_user];
        if(staker.tokenIds.length == 0) {
            revert("Cheeth._unstake: stake doesn't exist");
        }
        uint256 lastIndex = staker.tokenIds.length - 1;
        uint256 lastIndexKey = staker.tokenIds[lastIndex];
        uint256 tokenIdIndex = staker.tokenIndex[_tokenId];
        
        staker.tokenIds[tokenIdIndex] = lastIndexKey;
        staker.tokenIndex[lastIndexKey] = tokenIdIndex;
        if (staker.tokenIds.length > 0) {
            staker.tokenIds.pop();
            delete staker.tokenIndex[_tokenId];
        }

        if (staker.tokenIds.length == 0) {
            delete stakers[_user];
        }
        delete tokenOwner[_tokenId];

        IERC721Enumerable parentNFT =  IERC721Enumerable(anonymiceAddress);
        parentNFT.safeTransferFrom(
            address(this),
            _user,
            _tokenId
        );

        emit Unstaked(_user, _tokenId, 0);

    }
    
    /// @dev Updates the amount of rewards owed for each user before any tokens are moved
    function updateReward(address _user) public {
        lastUpdateTime = block.timestamp;
        uint256 rewards = rewardsOwing(_user);

        Staker storage staker = stakers[_user];
        if (_user != address(0)) {
            staker.rewardsEarned = staker.rewardsEarned.add(rewards);
            staker.lastRewardPoints = block.timestamp; 
        }
    }


    /// @notice Returns the rewards owing for a user
    /// @dev The rewards are dynamic and normalised from the other pools
    /// @dev This gets the rewards from each of the periods as one multiplier
    function rewardsOwing(address _user) public view returns(uint256) {
        
        uint256 newRewardPerToken = (block.timestamp - stakers[_user].lastRewardPoints) * EMISSIONS_RATE;
        uint256 rewards = newRewardPerToken.mul(stakers[_user].tokenIds.length).div(1 days);
        return rewards;
    }


    /// @notice Returns the about of rewards yet to be claimed
    function unclaimedRewards(address _user) external view returns(uint256) {
        uint256 rewards = rewardsOwing(_user);
        return rewards.add(stakers[_user].rewardsEarned).sub(stakers[_user].rewardsReleased);
    }


    /// @notice Lets a user with rewards owing to claim tokens
    function claimReward(address _user) public {
        require(
            tokensClaimable == true,
            "Tokens cannnot be claimed yet"
        );
        updateReward(_user);

        Staker storage staker = stakers[_user];
    
        uint256 payableAmount = staker.rewardsEarned.sub(staker.rewardsReleased);
        staker.rewardsReleased = staker.rewardsReleased.add(payableAmount);

        /// @dev accounts for dust 
       
        _mint(_user, payableAmount); 
        emit RewardPaid(_user, payableAmount);
    }
    ///****************************************** */
    ///****************************************** */
    /// @notice Stake NFTs and earn reward tokens. 
    function stake1155(uint256 tokenId, uint amount) external {
        _stake1155(msg.sender, tokenId, amount);
    }
    /// @notice Stake multiple NFTs and earn reward tokens. 
    function stake1155Batch(uint256[] memory tokenIds, uint[] memory amounts) external {
        for (uint i = 0; i < tokenIds.length; i++) {
            _stake1155(msg.sender, tokenIds[i], amounts[i]);
        }
    }
    function _stake1155(address _user, uint256 _tokenId, uint _amount) internal {

        Staker storage staker = stakers1155[_user];

        require(block.timestamp < CLAIM_END_TIME, "Cheeth._stake: Claim period is over!");

        if (staker.lastRewardPoints == 0 ) {
          staker.lastRewardPoints = block.timestamp;
        }

        updateReward1155(_user);
        if(staker.tokenAmount[_tokenId] == 0) {
            staker.tokenIds.push(_tokenId);
            staker.tokenIndex[_tokenId] = staker.tokenIds.length - 1;
            tokenOwner[_tokenId] = _user;
        }
        staker.tokenAmount[_tokenId] += _amount;
        IERC1155 parentNFT =  IERC1155(anonymiceAddress1155);
        parentNFT.safeTransferFrom(_user, address(this), _tokenId, _amount, "0x00");
        emit Staked(_user, _tokenId, _amount);
    }
    /// @notice Unstake NFTs. 
    function unstake1155(uint256 _tokenId, uint _amount) external {
        require(tokenOwner[_tokenId] == msg.sender, "Cheeth._unstake: Sender must have staked tokenID");
        claimReward1155(msg.sender);
        _unstake1155(msg.sender, _tokenId, _amount);
    }

    /// @notice Stake multiple NFTs and claim reward tokens. 
    function unstake1155Batch(uint256[] memory tokenIds, uint[] memory amounts) external {
        claimReward1155(msg.sender);
        for (uint i = 0; i < tokenIds.length; i++) {
            if (tokenOwner[tokenIds[i]] == msg.sender) {
                _unstake1155(msg.sender, tokenIds[i], amounts[i]);
            }
        }
    }
    /**
     * @dev All the unstaking goes through this function
     * @dev Rewards to be given out is calculated
     * @dev Balance of stakers are updated as they unstake the nfts based on ether price
    */
    function _unstake1155(address _user, uint256 _tokenId, uint _amount) internal {

        Staker storage staker = stakers1155[_user];
        if(staker.tokenIds.length == 0) {
            revert("Cheeth._unstake1155: stake doesn't exist");
        }
        uint256 lastIndex = staker.tokenIds.length - 1;
        uint256 lastIndexKey = staker.tokenIds[lastIndex];
        uint256 tokenIdIndex = staker.tokenIndex[_tokenId];
        uint256 tokenIdAmount = staker.tokenAmount[_tokenId];

        if(staker.tokenAmount[_tokenId] >= _amount) {
            staker.tokenAmount[_tokenId] -= _amount;
        } 
        if(staker.tokenAmount[_tokenId] == 0) {
            staker.tokenIds[tokenIdIndex] = lastIndexKey;
            staker.tokenIndex[lastIndexKey] = tokenIdIndex;
            staker.tokenAmount[lastIndexKey] = tokenIdAmount;
            if (staker.tokenIds.length > 0) {
                staker.tokenIds.pop();
                delete staker.tokenIndex[_tokenId];
                delete staker.tokenAmount[_tokenId];
            }

            if (staker.tokenIds.length == 0) {
                delete stakers[_user];
            }
            delete tokenOwner[_tokenId];
        }
        IERC1155 parentNFT =  IERC1155(anonymiceAddress1155);
        parentNFT.safeTransferFrom(
            address(this),
            _user,
            _tokenId,
            _amount,
            "0x00"
        );

        emit Unstaked(_user, _tokenId, _amount);
    }    
    /// @dev Updates the amount of rewards owed for each user before any tokens are moved
    function updateReward1155(address _user) public {
        lastUpdateTime = block.timestamp;
        uint256 rewards = rewardsOwing1155(_user);

        Staker storage staker = stakers1155[_user];
        if (_user != address(0)) {
            staker.rewardsEarned = staker.rewardsEarned.add(rewards);
            staker.lastRewardPoints = block.timestamp; 
        }
    }


    /// @notice Returns the rewards owing for a user
    /// @dev The rewards are dynamic and normalised from the other pools
    /// @dev This gets the rewards from each of the periods as one multiplier
    function rewardsOwing1155(address _user) public view returns(uint256) {
        Staker storage staker = stakers1155[_user];
        uint256 rewards = 0;
        for(uint i = 0; i < staker.tokenIds.length; i++) {
            uint256 tokenId = staker.tokenIds[i];
            uint256 newRewardPerToken = (block.timestamp - staker.lastRewardPoints) * EMISSIONS_RATE_1155[tokenId];
            uint amount = staker.tokenAmount[tokenId];
            rewards += newRewardPerToken.mul(amount);
        }
        
        return rewards.div(1 days);
    }
    /// @notice Returns the about of rewards yet to be claimed
    function unclaimedRewards1155(address _user) external view returns(uint256) {
        uint256 rewards = rewardsOwing1155(_user);
        Staker storage staker = stakers1155[_user];
        return rewards.add(staker.rewardsEarned).sub(staker.rewardsReleased);
    }


    /// @notice Lets a user with rewards owing to claim tokens
    function claimReward1155(address _user) public {
        require(
            tokensClaimable == true,
            "Tokens cannnot be claimed yet"
        );
        updateReward1155(_user);

        Staker storage staker = stakers1155[_user];
    
        uint256 payableAmount = staker.rewardsEarned.sub(staker.rewardsReleased);
        staker.rewardsReleased = staker.rewardsReleased.add(payableAmount);

        /// @dev accounts for dust 
       
        _mint(_user, payableAmount); 
        emit RewardPaid(_user, payableAmount);
    }
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
}