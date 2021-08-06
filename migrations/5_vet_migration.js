const VET = artifacts.require("VET");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(VET); 
    let vet = await VET.deployed();
    let dex = await Dex.deployed();
    
    dex.addToken(web3.utils.fromUtf8("VET"), vet.address, {from: accounts[0]});
    await vet.approve(dex.address, 100000);
    await dex.deposit(1000, web3.utils.fromUtf8("VET"));
  
    let balanceOfVET = await dex.balances(accounts[0], web3.utils.fromUtf8("VET"));
    console.log(balanceOfVET);
  

  };
  