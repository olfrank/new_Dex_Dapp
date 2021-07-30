const Dex = artifacts.require("Dex");
const ADA = artifacts.require("ADA");
const truffleAssert = require("truffle-assertions");

contract ("Dex", accounts => {
    it("should only be possible for owner to add tokens", async () => {
        let dex = await Dex.deployed()
        let ada = await ADA.deployed()
        //we assert that this call will pass
        await truffleAssert.passes(
            dex.addToken(web3.utils.fromUtf8("ADA"), ada.address, {from: accounts[0]})
        )
        await truffleAssert.reverts(
            dex.addToken(web3.utils.fromUtf8("AAVE"), ada.address, {from: accounts[1]})
        )
    })

    it("should handle deposits", async () => {
        let dex = await Dex.deployed();
        let ada = await ADA.deployed();
        await ada.approve(dex.address, 500);
        await dex.deposit(100, web3.utils.fromUtf8("ADA"));
        let balance = await dex.balances( accounts[0], web3.utils.fromUtf8("ADA"));
        assert.equal( balance, 100 );
    })

    it("should handle faulty withdrawals", async () => {
        let dex = await Dex.deployed();
        let ada = await ADA.deployed();
        await truffleAssert.reverts( dex.withdraw(500, web3.utils.fromUtf8("ADA")) )
    })

    it("should handle correct withdrawals", async () => {
        let dex = await Dex.deployed();
        let ada = await ADA.deployed();
        await truffleAssert.passes( dex.withdraw(100, web3.utils.fromUtf8("ADA")) )
    })

})
