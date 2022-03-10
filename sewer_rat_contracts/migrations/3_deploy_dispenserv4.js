const web3 = require("web3");
const ChedERC721 = artifacts.require('SRSCCheddaz');
const RatERC721 = artifacts.require("SRSC");
const SERC20 = artifacts.require('SERC20');

const ChizDispenserV4 = artifacts.require('ChizDispenserV4');

module.exports = async (deployer, network, addresses) => {
  let deployAddress = addresses[0];
  let serc20_address ;
  let ratERC721_address ;
  let chedERC721_address ;

  if(network == 'eth_testnet') {
    serc20_address = '0xC8a02227058026D5072bd0471f30934A0D2803B7';
    ratERC721_address = '0x2aC005beE2ff28ad46DB5fCcb5222b29D346e4Df';
    chedERC721_address = '0xF6c616E7dc75eBa82ca77E10FC23c305be8498aA';

  } else if(network == 'eth_mainnet') {
    serc20_address = '0xC8a02227058026D5072bd0471f30934A0D2803B7';
    ratERC721_address = '0x2aC005beE2ff28ad46DB5fCcb5222b29D346e4Df';
    chedERC721_address = '0xF6c616E7dc75eBa82ca77E10FC23c305be8498aA';
  }
  // await deployer.deploy(ChizDispenserV4, {gas: 5000000, from: deployAddress });
  // const chizDispenserV4 = await ChizDispenserV4.deployed();
  // await chizDispenserV4.initialize(serc20_address, ratERC721_address, chedERC721_address);

  // console.log("Dispenser V4 address", chizDispenserV4.address)
};