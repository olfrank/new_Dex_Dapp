const LINK = artifacts.require("LINK");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(LINK); 
    let link = await LINK.deployed();
    let dex = await Dex.deployed();
    
    dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]});
    await link.approve(dex.address, 100000);
    await dex.deposit(1000, web3.utils.fromUtf8("LINK"));
  
    let balanceOfLINK = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"));
    console.log(balanceOfLINK);
  

  };
  