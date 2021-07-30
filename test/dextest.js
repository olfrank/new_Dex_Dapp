const Dex = artifacts.require("Dex");
const ADA = artifacts.require("ADA");
const truffleAssert = require("truffle-assertions");

contract.skip ("Dex", accounts => {
    // the user must have eth deposited such that deposited eth is >= to buy order value
    it("user's deposited ETH is >= buy order", async () => {
        let dex = await Dex.deployed()

        await truffleAssert.reverts( //buy will not be created due to no ETH
            dex.createLimitOrder(0, web3.utils.fromUtf8("ADA"), 10, 1)
        )
        await dex.depositEth({value: 10}) //Eth deposited so will be created
        await truffleAssert.passes( 
            dex.createLimitOrder(0, web3.utils.fromUtf8("ADA"), 10, 1)
        )
        //createLimitOrder(Side side, bytes32 ticker, uint amount, uint price) public {
    })
    // the user must have enough tokens deposited such that token balance is >= to sell order amount
    it("user's token balance is >= sell order amount", async () => {
        let dex = await Dex.deployed()
        let ada = await ADA.deployed()
        await dex.addToken(web3.utils.fromUtf8("ADA"), ada.address, {from: accounts[0]})
        await truffleAssert.reverts( //reverts because no ADA approved or deposited
            dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 10, 1)
        )
        await ada.approve(dex.address, 500);
        await dex.deposit(100, web3.utils.fromUtf8("ADA"));
        await truffleAssert.passes( //passes because deposit has been approved and settled
            dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 10, 1)
        )

        //createLimitOrder(Side side, bytes32 ticker, uint amount, uint price) public {
    })

    // the buy order should be ordered on price from highest to lowest from index 0
    it("(Buy Order)should be in order from highest to lowest", async ()=> {
        let dex = await Dex.deployed()
        let ada = await ADA.deployed()
        await ada.approve(dex.address, 500);
        await dex.depositEth({value: 1000});
        
        dex.createLimitOrder(0, web3.utils.fromUtf8("ADA"), 1, 100)
        dex.createLimitOrder(0, web3.utils.fromUtf8("ADA"), 1, 300)
        dex.createLimitOrder(0, web3.utils.fromUtf8("ADA"), 1, 250)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 0)
        assert(orderbook.length > 0)
        var i;
        for(i = 0; i < orderbook.length -1; i++){
            assert (orderbook[i].price >= orderbook[i+1].price, "Buy order book has not bee sorted")
        }
    })

    // the sell order should be ordered on price from highest to lowest from index 0
    it("(Sell Order)should be in order from highest to lowest", async () => {
        let dex = await Dex.deployed()
        let ada = await ADA.deployed()
        await ada.approve(dex.address, 500);
        await dex.depositEth({value: 1000});
        
        dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 1, 100)
        dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 1, 300)
        dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 1, 250)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 0)
        assert(orderbook.length > 0)
        var i;
        for(i = 0; i < orderbook.length; i++){
            assert (orderbook[i].price <= orderbook[i+1].price, "Sell order book has not bee sorted")
        }
    })
});