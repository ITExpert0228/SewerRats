const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const {
	addDays,
	timestampToDays, 
	daysToTimestamp,
	posE,
	negE,
} = require("./helpers");

const ERC721 = artifacts.require('ERC721TokenMock');
const ERC1155 = artifacts.require('ERC1155Mock');
const Cheeth = artifacts.require('Cheeth');
const TOTAL_SUPPLY = web3.utils.toWei('177760000');
const TotalReward = web3.utils.toWei('100000');
const erc1155_id_1 = "111";
const erc1155_id_2 = "222";

contract('Cheeth', ([admin, user1, user2, _]) => {
  beforeEach(async () => {

    erc721 = await ERC721.new();
    erc1155 = await ERC1155.new();
    cheeth = await Cheeth.new();

    await erc721.safeMint(admin, 1);
    await erc721.safeMint(admin, 2);
    await erc721.safeMint(admin, 3);
    
    await erc1155.mint(admin, erc1155_id_1, 3, '0x00');
    await erc1155.mint(admin, erc1155_id_2, 3, '0x00');

    await erc721.setApprovalForAll(cheeth.address, true);
    await erc1155.setApprovalForAll(cheeth.address, true);

    await cheeth.setAnonymiceAddress(erc721.address, erc1155.address);
    await cheeth.setEmissionsRate1155(erc1155_id_1, "15000000000000000000");
    await cheeth.setEmissionsRate1155(erc1155_id_2, "35000000000000000000");


  });
  it('1. getStakedTokens', async() =>{
    balance = await erc721.balanceOf(admin);
    ts = await erc721.totalSupply();
    console.log('balance', balance.toString());
    console.log('totalSupply', ts.toString());
    token1 = await erc721.tokenOfOwnerByIndex(admin, 0);
    //token2 = await erc721.tokenOfOwnerByIndex(admin, 1);
    console.log('token1', token1);
    //console.log('token2', token2);
    console.log("anonymiceAddress", await cheeth.anonymiceAddress.call());
    await cheeth.stake(1, {from: admin});
    await cheeth.stake(2, {from: admin});
    await cheeth.stake(3, {from: admin});
    bal = await cheeth.getStakedTokens(admin);
    console.log('getStakedTokens', bal);
    balance = await erc721.balanceOf(cheeth.address);
    console.log('Cheeth nft balance', balance);
    await cheeth.unstake("2", {from: admin});
    //await cheeth.unstake("2");
    await cheeth.unstake("1", {from: admin});
    balance = await erc721.balanceOf(cheeth.address);
    console.log('Cheeth nft balance', balance);
    bal2 = await cheeth.getStakedTokens(admin);
    console.log('getStakedTokens', bal2);
    // count = bal.length;
    // console.log(count);
    // assert(count, 1);
  });
  it('2. stake1155 and unstake1155', async() =>{
    // await cheeth.unstake(1, {from: admin});
    // bal = await cheeth.getStakedTokens(admin);
    // console.log(bal.length);
    // assert(bal.length, 0);
    await cheeth.stake1155(erc1155_id_1, 1, {from: admin});
    bal = await cheeth.getStakedTokens1155(admin);
    console.log(bal.tokenIds,bal.amounts);
    await cheeth.unstake1155(erc1155_id_1, 1, {from: admin});
    bal = await cheeth.getStakedTokens1155(admin);
    console.log(bal.tokenIds,bal.amounts);
  }); 
  it('3. claim', async() =>{
    await cheeth.stake(1, {from: admin});
    await cheeth.stake1155(erc1155_id_1, 1, {from: admin});
    await cheeth.stake1155(erc1155_id_2, 1, {from: admin});
    addDays(1);
    await cheeth.claimReward(admin);
    bal = await cheeth.balanceOf(admin);
    console.log("Balance after claiming ERC721 rewards", bal.toString());
    await cheeth.claimReward1155(admin);
    bal = await cheeth.balanceOf(admin);
    console.log("Balance after claiming all ERC1155s' rewards", bal.toString());
  });
  it('4. stake1155Batch and unstake1155Batch', async() =>{
    await cheeth.stake(1, {from: admin});
    await cheeth.stake1155Batch([erc1155_id_1, erc1155_id_2], [2, 2], {from: admin});
    addDays(1);
    await cheeth.claimReward(admin);
    bal = await cheeth.balanceOf(admin);
    console.log("Balance after claiming ERC721 rewards", bal.toString());
    await cheeth.claimReward1155(admin);
    bal = await cheeth.balanceOf(admin);
    console.log("Balance after claiming all ERC1155s' rewards", bal.toString());
    
    bal = await cheeth.getStakedTokens1155(admin);
    console.log("Staked Amount before unstakeBatch: [2,2]", bal.tokenIds,bal.amounts);
    
    await cheeth.unstake1155Batch([erc1155_id_1, erc1155_id_2], [1, 1], {from: admin});
    
    bal = await cheeth.getStakedTokens1155(admin);
    console.log("Staked Amount after unstakeBatch: [1,0]", bal.tokenIds,bal.amounts);

    await cheeth.unstake1155Batch([erc1155_id_1, erc1155_id_2], [1, 1], {from: admin});
    
    bal = await cheeth.getStakedTokens1155(admin);
    console.log("Staked Amount after unstakeBatch: [0,0]", bal.tokenIds,bal.amounts);
  });
});