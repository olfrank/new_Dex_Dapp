const ADA = artifacts.require("ADA");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(ADA);
  
  let dex = await Dex.deployed()
  let ada = await ADA.deployed()
  dex.addToken(web3.utils.fromUtf8("ADA"), ada.address)
  await ada.approve(dex.address, 500)
  await dex.deposit(100, web3.utils.fromUtf8("ADA"))
  let balanceOfADA = await dex.balances(accounts[0], web3.utils.fromUtf8("ADA"))
  console.log(balanceOfADA)
};
