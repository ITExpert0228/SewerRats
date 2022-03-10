const web3 = require("web3");
const ERC721 = artifacts.require('ERC721TokenMock');
const ERC1155 = artifacts.require('ERC1155Mock');
const Cheeth = artifacts.require('Cheeth');

module.exports = async (deployer, network, addresses) => {
  let deployAddress = addresses[0];
  let erc721_address ;
  let erc1155_address ;
  let erc721, erc1155, cheeth;

  // erc721_address = '0x2aC005beE2ff28ad46DB5fCcb5222b29D346e4Df'; // erc721 contact
  // erc1155_address = '0x495f947276749ce646f68ac8c248420045cb7b5e'; // opensea store front 
  erc1155_address = 0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656; // rinkeby opeansea erc1155
  contract_address = 0x327B0124F8C9eB29565273817518E2Ba493D26C1;
  // deployer.deploy(Cheeth, {gas: 5000000, from: deployAddress });
  // await cheeth.setAnonymiceAddress(erc721_address, erc1155_address);
  // await cheeth.setEmissionsRate1155("75533495865748806087594747552501854381546249591798963151787431419889324130329", "15000000000000000000"); //3
  // await cheeth.setEmissionsRate1155("98154836180348629869130140560359154676586193824686741348109563994860511297561", "35000000000000000000"); //1

  //[75533495865748806087594747552501854381546249591798963151787431419889324130329,98154836180348629869130140560359154676586193824686741348109563994860511297561]
  //[1,1]
};