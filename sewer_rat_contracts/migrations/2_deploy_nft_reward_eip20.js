const web3 = require("web3");
const ChedERC721 = artifacts.require('SRSCCheddaz');
const RatERC721 = artifacts.require("SRSC");
const SERC20 = artifacts.require('SERC20');

const ChizDispenserV4 = artifacts.require('ChizDispenserV4');

module.exports = async (deployer, network, addresses) => {
    let deployAddress = addresses[0];
  //await deployer.deploy(Airdrop, {gas: 5000000, from: deployAddress });
  //const airdrop = await Airdrop.deployed();
  
  await deployer.deploy(SERC20, "SERC20", "SERC20", {gas: 5000000, from: deployAddress });
  const sErc20 = await SERC20.deployed();
  
  await deployer.deploy(RatERC721,  "http://", {gas: 5000000, from: deployAddress });
  const ratERC721 = await RatERC721.deployed();

  await deployer.deploy(ChedERC721, ratERC721.address, {gas: 5000000, from: deployAddress });
  const chedERC721 = await ChedERC721.deployed();
  
  await deployer.deploy(ChizDispenserV4,  {gas: 5000000, from: deployAddress });
  const chizDispenserV4 = await ChizDispenserV4.deployed();
  await chizDispenserV4.initialize(sErc20.address, ratERC721.address, chedERC721.address);

};