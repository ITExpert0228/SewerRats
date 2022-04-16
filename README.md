# SewerRats for NFT Staking and Rewarding

A NFT staking and reward project with the integration of OpenSea. Based off of the SewerRats website: [app.sewerrats.io](https://app.sewerrats.io/).

## Setup
### Frontend Setup
Clone this repo and enter the project directory:

```sh
$ git clone https://github.com/itexpert0228/sewerrats
$ cd sewer_rat_website
```
Install dependencies:
```sh
$ npm install
```

### Development
Run the local webpack-dev-server with livereload and autocompile on [http://localhost:3000/](http://localhost:3000/)
```sh
$ npm start
```
### Deployment
Build the current application
```sh
$ npm run build
```

### React
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Smart Contract
The smart contract projet is based on Truffle. So all packages and dependencies should be installed.
```sh
$ cd sewer_rat_contracts
$ npm install
```
If truffle framework is not installed, run following command with assertions for contract test environment.
```sh
$ npm install --save truffle
$ npm install truffle-assertions
```
Additional installation
```sh
$ npm install --save eth-gas-reporter
$ npm install --save truffle-plugin-verify
```
As the most advanced framework for testing smart contracts, install waffle using the command below.
```sh
$npm install --save-dev ethereum-waffle
```
### Compiling smart contract
```sh
$ truffle compile
```
### Additional Truffle commands

Look for Usage, Description, and Options of migrate command
```sh
$truffle help migrate 
```

Without compilation before migrating, run contracts from a specific migration to a specific migration 
The number refers to the prefix of the migration file.
i.e:
```sh
$ truffle migrate --f 1 --to 3 --compile-none --network rinkeby
```
To run test scripts without compilation.
```sh
$truffle help test
```
i.e:
```
$ truffle test ../test/presale/token.test.js --compile-none
```

### Rinkeby Test network 

SERC20:  0xC8a02227058026D5072bd0471f30934A0D2803B7 

SRSC(RatERC721):  0x2aC005beE2ff28ad46DB5fCcb5222b29D346e4Df 

SRSCCheddaz(ChedERC721): 0xF6c616E7dc75eBa82ca77E10FC23c305be8498aA 

ChizDispenserV4:  0x394daC740B43318270FC4Ca0c9B95038D43B822B 
