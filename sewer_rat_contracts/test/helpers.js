const { BigNumber } = require("ethers");
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

advanceTime = (time) => {
	return new Promise((resolve, reject) => {
	  web3.currentProvider.send({
		jsonrpc: '2.0',
		method: 'evm_increaseTime',
		params: [time],
		id: new Date().getTime()
	  }, (err, result) => {
		if (err) { return reject(err) }
		return resolve(result)
	  })
	})
  }
  
  advanceBlock = () => {
	return new Promise((resolve, reject) => {
	  web3.currentProvider.send({
		jsonrpc: '2.0',
		method: 'evm_mine',
		id: new Date().getTime()
	  }, (err, result) => {
		if (err) { return reject(err) }
		const newBlockHash = web3.eth.getBlock('latest').hash
  
		return resolve(newBlockHash)
	  })
	})
  }
const addDays = async (days) => {
	await advanceTime(days * 24 * 60 * 60)
	await advanceBlock()
  	return Promise.resolve(web3.eth.getBlock('latest'))
};
const timestampToDays = (ts) => {
	const bn = BigNumber.from(ts);
	const res = bn.div(24 * 60 * 60);
	return res.toNumber();
};
const daysToTimestamp = (days) => {
	const bn = BigNumber.from(days);
	const res = bn.mul(24 * 60 * 60);
	return res.toNumber();
};

const tenExponent = (digits) => {
	return BigNumber.from(10).pow(digits);
};

const posE = (number, digits = 18, decimals = -1) => {
	number = number || "0";
	const bn = BigNumber.from(number);
	const exp = tenExponent(digits);
	const outcome = bn.mul(exp);
	if (decimals !== -1) {
		return outcome.toFixed(decimals);
	}
	return outcome.toString();
};

const negE = (number, digits = 18, decimals = -1) => {
	number = number || "0";
	const bn = BigNumber.from(number);
	const exp = tenExponent(digits);
	const outcome = bn.div(exp);
	if (decimals !== -1) {
		return outcome.toTwos(decimals);
	}
	return outcome.toString();
};

module.exports = {
	addDays,
	timestampToDays, 
	daysToTimestamp,
	posE,
	negE,
};
