const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const {
	addDays,
	timestampToDays, 
	daysToTimestamp,
	posE,
	negE,
} = require("./helpers");

const ChedERC721 = artifacts.require('SRSCCheddaz');
const RatERC721 = artifacts.require("SRSC");
const SERC20 = artifacts.require('SERC20');
const ChizDispenserV4 = artifacts.require('ChizDispenserV4');
let chizDispenserV4, sERC20, rat, ched;
const TOTAL_SUPPLY = web3.utils.toWei('177760000');
const TotalReward = web3.utils.toWei('100000');

contract('ChizDispenserV4', ([admin, signer, _]) => {
  beforeEach(async () => {

    sERC20 = await SERC20.new("SERC20", "SERC20");
    rat =  await RatERC721.new("http://");
    ched =  await ChedERC721.new(rat.address);
    chizDispenserV4 = await ChizDispenserV4.new(sERC20.address, rat.address, ched.address);

    await sERC20.transfer(chizDispenserV4.address,TotalReward);
    await rat.mintSewerRat(admin, 1, {value: web3.utils.toWei('0.05','ether')});

  });
  it('1. Should have ERC20 balance', async() =>{
    bal = await sERC20.balanceOf(chizDispenserV4.address);
    assert(bal.eq(web3.utils.toBN(TotalReward)));
  });

  it('2. Should reduce admin balance', async() =>{
    const bal1 = await sERC20.balanceOf(admin);
    const bal2 = await sERC20.balanceOf(chizDispenserV4.address);
    const bal = bal1.add(bal2);
    assert(bal.eq(web3.utils.toBN(TOTAL_SUPPLY)));
  });
  it('3. Should have Rat balance', async() =>{
    const bal = await rat.balanceOf(admin);
    assert(bal, 1);
  });

  it('4. Should have rewards', async() =>{

    //uint256 totalChiz = (cDays * ratBalance * amountMinusClaimed * rewardRatePercentage) / 100;
    const ratBalance = await rat.balanceOf(admin);
    const amountMinusClaimed = web3.utils.toWei('560','ether');
    const rewardRatePercentage = 1;
    const expectedValue = 2 * ratBalance * amountMinusClaimed * rewardRatePercentage /100;
    const beforeBalance = await sERC20.balanceOf(admin);
    await addDays(2);
    const cDays = await chizDispenserV4.ClaimableDays(admin);
    assert.equal(cDays, 2);
    await chizDispenserV4.ClaimChizExt();
    const afterBalance = await sERC20.balanceOf(admin);
    expect(afterBalance-beforeBalance).to.be.closeTo(expectedValue, 0.000000005 * 10**18);

    await expectRevert(
      chizDispenserV4.ClaimChizExt(),
      'day error'
    );
  });
  
});