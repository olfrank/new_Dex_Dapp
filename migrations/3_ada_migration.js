const ADA = artifacts.require("ADA");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(ADA);
  let ada = await ADA.deployed();
  let dex = await Dex.deployed();
  
  dex.addToken(web3.utils.fromUtf8("ADA"), ada.address, {from: accounts[0]});
  await ada.approve(dex.address, 100000);
  await dex.deposit(1000, web3.utils.fromUtf8("ADA"));
  let balanceOfADA = await dex.balances(accounts[0], web3.utils.fromUtf8("ADA"));
  console.log(balanceOfADA);


};
